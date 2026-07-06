import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Web Audio Engine ─────────────────────────────────────────────────────────

function createAudioCtx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

// C major pentatonic scale — joyful & relaxing (C4, D4, E4, G4, A4, C5, D5, E5, G5)
const PENTATONIC_FREQS = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

// Gentle ascending "chime" melody pattern (indices into PENTATONIC_FREQS)
const MELODY: number[] = [0, 2, 4, 5, 4, 2, 4, 6, 5, 4, 2, 0, 2, 5, 4, 2, 6, 5, 4, 6, 8, 6, 5, 4];

/** Simulate a gentle reverb with a feedback delay network */
function createReverb(ctx: AudioContext): { input: GainNode; output: GainNode } {
  const input = ctx.createGain();
  const output = ctx.createGain();
  output.gain.value = 1;

  const delays = [0.11, 0.17, 0.23];
  const feedbacks = [0.25, 0.2, 0.15];

  delays.forEach((delayTime, i) => {
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = delayTime;

    const fb = ctx.createGain();
    fb.gain.value = feedbacks[i];

    input.connect(delay);
    delay.connect(output);
    delay.connect(fb);
    fb.connect(delay);
  });

  return { input, output };
}

/** Play a single music-box note (sine + soft triangle blend) */
function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  masterGain: GainNode,
  reverbInput: GainNode,
  velocity = 0.22
) {
  // Primary tone — sine (warm, mellow)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = freq;

  // Overtone — triangle at 2× (adds brightness without harshness)
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = freq * 2;

  const noteGain = ctx.createGain();
  noteGain.gain.setValueAtTime(0, startTime);
  noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.02);             // fast attack
  noteGain.gain.exponentialRampToValueAtTime(velocity * 0.5, startTime + 0.08); // sustain
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);     // gentle decay

  const overGain = ctx.createGain();
  overGain.gain.value = 0.12; // subtle overtone

  osc1.connect(noteGain);
  osc2.connect(overGain);
  overGain.connect(noteGain);
  noteGain.connect(masterGain);
  noteGain.connect(reverbInput); // send to reverb

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration + 0.05);
  osc2.stop(startTime + duration + 0.05);
}

/** Warm low pad — sustained, breathing chord (C + G) */
function createPad(ctx: AudioContext, masterGain: GainNode): () => void {
  const padGain = ctx.createGain();
  padGain.gain.setValueAtTime(0, ctx.currentTime);
  padGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 3);
  padGain.connect(masterGain);

  const freqs = [65.41, 98.0, 130.81]; // C2, G2, C3
  const oscs = freqs.map(f => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;

    // Slight vibrato LFO per oscillator
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.25 + Math.random() * 0.15;
    lfoG.gain.value = 0.5;
    lfo.connect(lfoG);
    lfoG.connect(o.frequency);
    lfo.start();

    o.connect(padGain);
    o.start();
    return { o, lfo };
  });

  return () => {
    const t = ctx.currentTime + 1.8;
    padGain.gain.linearRampToValueAtTime(0, t);
    oscs.forEach(({ o, lfo }) => { o.stop(t + 0.1); lfo.stop(t + 0.1); });
  };
}

/** Gentle sparkle — random high glints on the pentatonic scale */
function scheduleSparkle(ctx: AudioContext, masterGain: GainNode, reverbInput: GainNode): NodeJS.Timeout {
  const sparkle = () => {
    const freq = PENTATONIC_FREQS[Math.floor(Math.random() * PENTATONIC_FREQS.length)];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * 2; // two octaves up
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.07, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.connect(g);
    g.connect(masterGain);
    g.connect(reverbInput);
    osc.start(now);
    osc.stop(now + 0.65);
  };

  // Schedule sparkles randomly every 1.5–3.5 s
  const tick = () => {
    sparkle();
    timerId = setTimeout(tick, 1500 + Math.random() * 2000) as any;
  };
  let timerId = setTimeout(tick, 800 + Math.random() * 1200) as any;
  return timerId;
}

/**
 * Start the full joyful ambient — melody sequencer + warm pad + sparkles + reverb.
 * Returns a cleanup / stop function.
 */
function startJoyfulAmbient(ctx: AudioContext): () => void {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 1.5);
  masterGain.connect(ctx.destination);

  // Reverb bus
  const reverb = createReverb(ctx);
  const reverbOut = ctx.createGain();
  reverbOut.gain.value = 0.32;
  reverb.output.connect(reverbOut);
  reverbOut.connect(masterGain);

  // Pad
  const stopPad = createPad(ctx, masterGain);

  // Melody sequencer
  const NOTE_DUR = 0.55;   // duration of each note (seconds)
  const NOTE_GAP = 0.72;   // time between note starts
  let sequencerTimer: ReturnType<typeof setTimeout> | null = null;
  let noteIdx = 0;

  const scheduleMelody = () => {
    const now = ctx.currentTime;
    // Buffer ahead: schedule next 4 notes
    for (let i = 0; i < 4; i++) {
      const idx = (noteIdx + i) % MELODY.length;
      const freq = PENTATONIC_FREQS[MELODY[idx]];
      // Softer velocity on "inner" notes, brighter on phrase starts
      const velocity = idx % 6 === 0 ? 0.26 : idx % 3 === 0 ? 0.20 : 0.16;
      playNote(ctx, freq, now + i * NOTE_GAP, NOTE_DUR, masterGain, reverb.input, velocity);
    }
    noteIdx = (noteIdx + 4) % MELODY.length;
    sequencerTimer = setTimeout(scheduleMelody, NOTE_GAP * 4 * 1000 - 80); // slight overlap
  };
  scheduleMelody();

  // Sparkles
  const sparkleTimer = scheduleSparkle(ctx, masterGain, reverb.input);

  // ── Stop / cleanup ──────────────────────────────────────────────────────────
  return () => {
    if (sequencerTimer) clearTimeout(sequencerTimer);
    clearTimeout(sparkleTimer as any);
    stopPad();
    const fadeOut = ctx.currentTime + 1.8;
    masterGain.gain.linearRampToValueAtTime(0, fadeOut);
  };
}

/** Cheerful 3-note ascending chime when enabling */
function playEnableChime(ctx: AudioContext) {
  const freqs = [523.25, 659.25, 783.99]; // C5 E5 G5
  freqs.forEach((f, i) => {
    const t = ctx.currentTime + i * 0.13;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  });
}

/** Soft descending 2-note "goodbye" when disabling */
function playDisableChime(ctx: AudioContext) {
  const freqs = [659.25, 392.0];
  freqs.forEach((f, i) => {
    const t = ctx.currentTime + i * 0.15;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  });
}

/** Crisp, satisfying UI click sound for global buttons */
function playUIClickSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // A bright, quick pluck (like a water drop or marimba tap)
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(1600, now + 0.04);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

// ─── React Component ──────────────────────────────────────────────────────────

export function SoundButton() {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const toggle = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioCtx();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    if (!enabled) {
      playEnableChime(ctx);
      // Short delay so the chime plays before the ambient starts
      setTimeout(() => {
        if (ctxRef.current) {
          stopRef.current = startJoyfulAmbient(ctxRef.current);
        }
      }, 350);
      setEnabled(true);
    } else {
      playDisableChime(ctx);
      if (stopRef.current) {
        stopRef.current();
        stopRef.current = null;
      }
      setEnabled(false);
    }
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (stopRef.current) stopRef.current();
      ctxRef.current?.close();
    };
  }, []);

  // Sync enabled state to ref for the global listener
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Global UI Click Listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!enabledRef.current || !ctxRef.current) return;
      
      const target = e.target as HTMLElement;
      // Check if clicked element is a button, anchor, or acts as a button
      const clickable = target.closest('button, a, [role="button"]');
      
      // We don't want to play the click sound on the sound toggle itself, 
      // because it already plays the enable/disable chime!
      if (clickable && clickable.id !== 'sound-toggle-btn') {
        // Resume context if browser suspended it
        if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
        playUIClickSound(ctxRef.current);
      }
    };

    // Use capture phase so it triggers immediately before react events or default actions
    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  return (
    <motion.button
      id="sound-toggle-btn"
      aria-label={enabled ? 'Disable relaxing sound' : 'Enable relaxing sound'}
      onClick={toggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 focus:outline-none overflow-visible"
      style={{
        borderColor: enabled ? 'rgba(167,243,208,0.55)' : 'rgba(255,255,255,0.15)',
        backgroundColor: enabled ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.03)',
      }}
    >
      {/* Dual pulse rings when enabled */}
      <AnimatePresence>
        {enabled && (
          <>
            <motion.span
              key="pulse1"
              className="absolute inset-0 rounded-full border border-emerald-400/30"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              key="pulse2"
              className="absolute inset-0 rounded-full border border-emerald-300/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Animated musical note icon */}
      <MusicIcon enabled={enabled} hovered={isHovered} />

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.25em] text-white/60 bg-black/85 border border-white/10 px-3 py-1.5 rounded-full pointer-events-none backdrop-blur-sm z-50"
          >
            {enabled ? '♪ Playing' : 'Relax Mode'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Music Note SVG Icon ──────────────────────────────────────────────────────

function MusicIcon({ enabled, hovered }: { enabled: boolean; hovered: boolean }) {
  const color = enabled
    ? 'rgba(52,211,153,0.95)'
    : hovered
    ? 'rgba(255,255,255,0.75)'
    : 'rgba(255,255,255,0.32)';

  return (
    <motion.svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={enabled ? { rotate: [0, 6, -6, 0] } : { rotate: 0 }}
      transition={enabled ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ transition: 'stroke 0.3s' }}
    >
      {/* Music note: stem + flag + filled notehead */}
      <line x1="9" y1="18" x2="9" y2="5" />
      <line x1="15" y1="16" x2="15" y2="3" />
      <polyline points="9 5 15 3" />

      <motion.circle
        cx="6"
        cy="18"
        r="3"
        animate={enabled ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={enabled ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
        style={{ transformOrigin: '6px 18px' }}
      />
      <motion.circle
        cx="12"
        cy="16"
        r="3"
        animate={enabled ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={enabled ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 } : {}}
        style={{ transformOrigin: '12px 16px' }}
      />
    </motion.svg>
  );
}
