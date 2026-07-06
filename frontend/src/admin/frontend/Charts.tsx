import React from 'react';

// Helper to format currency
const formatCurrency = (val: number, cur: string = 'USD') => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

// --- DONUT / PIE CHART ---
interface DonutChartProps {
  data: { [key: string]: number };
  colors: { [key: string]: string };
  title: string;
}

export function DonutChart({ data, colors, title }: DonutChartProps) {
  const entries = Object.entries(data).filter(([_, val]) => val > 0);
  const total = entries.reduce((sum, [_, val]) => sum + val, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border border-white/5 bg-zinc-900/20 rounded-2xl p-4">
        <p className="text-xs text-white/30 font-light">No data available for {title}</p>
      </div>
    );
  }

  let accumulatedPercent = 0;
  const strokeWidth = 14;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  const segments = entries.map(([key, val]) => {
    const percent = val / total;
    const strokeDashoffset = circumference - percent * circumference;
    const strokeDasharray = `${circumference} ${circumference}`;
    const rotation = accumulatedPercent * 360 - 90;
    accumulatedPercent += percent;

    return {
      key,
      value: val,
      percent: Math.round(percent * 100),
      strokeDashoffset,
      strokeDasharray,
      rotation,
      color: colors[key] || '#cccccc'
    };
  });

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* SVG Circle */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={seg.key}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                transform={`rotate(${seg.rotation} 50 50)`}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out hover:stroke-[16px] cursor-pointer"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-display font-black text-white">{total}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-widest">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 flex-1">
          {segments.map((seg) => (
            <div key={seg.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></span>
                <span className="text-xs font-light text-white/70">{seg.key}</span>
              </div>
              <span className="text-xs font-mono font-bold text-white/90">
                {seg.value} <span className="text-[10px] text-white/30">({seg.percent}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// --- LINE CHART (CLIENT GROWTH) ---
interface LineChartProps {
  data: { month: string; count: number }[];
  title: string;
}

export function LineChart({ data, title }: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 border border-white/5 bg-zinc-900/20 rounded-2xl p-4">
        <p className="text-xs text-white/30 font-light">No data available for {title}</p>
      </div>
    );
  }

  const counts = data.map(d => d.count);
  const maxVal = Math.max(...counts, 5); // Avoid division by 0, min ceiling is 5
  
  // Dimensions
  const width = 500;
  const height = 200;
  const paddingX = 40;
  const paddingY = 20;

  // Chart bounds
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * chartW;
    const y = paddingY + chartH - (d.count / maxVal) * chartH;
    return { x, y, label: d.month, value: d.count };
  });

  // Construct path SVG string
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth curve calculation using bezier control points
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
  }

  // Create area path D (closed shape to fill gradient)
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{title}</h3>
      <div className="w-full overflow-hidden">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + chartH * ratio;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.03)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#lineGrad)" />}

          {/* Stroke line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#3b82f6"
                stroke="#000000"
                strokeWidth="1.5"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="#3b82f6"
                className="opacity-0 group-hover:opacity-20 transition-opacity"
              />
              
              {/* Tooltip bubble on hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <rect
                  x={p.x - 20}
                  y={p.y - 25}
                  width="40"
                  height="18"
                  rx="4"
                  fill="#18181b"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={p.y - 13}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {p.value}
                </text>
              </g>
            </g>
          ))}

          {/* X axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              fontFamily="monospace"
            >
              {p.label.substring(5)} {/* show MM of YYYY-MM */}
            </text>
          ))}

          {/* Y Axis min/max labels */}
          <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            {maxVal}
          </text>
          <text x={paddingX - 10} y={paddingY + chartH + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            0
          </text>
        </svg>
      </div>
    </div>
  );
}


// --- BAR / AREA DUAL CHART (MONTHLY REVENUE VS EXPENSES) ---
interface BarChartProps {
  data: { month: string; revenue: number; expense: number; profit: number }[];
  title: string;
  currency?: string;
}

export function BarChart({ data, title, currency = 'USD' }: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-white/5 bg-zinc-900/20 rounded-2xl p-4">
        <p className="text-xs text-white/30 font-light">No data available for {title}</p>
      </div>
    );
  }

  const values = data.flatMap(d => [d.revenue, d.expense]);
  const maxVal = Math.max(...values, 1000); // Minimum scale ceiling is $1000

  // Dimensions
  const width = 600;
  const height = 240;
  const paddingX = 50;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const totalBars = data.length;
  const barGroupWidth = chartW / totalBars;
  const barWidth = Math.max(12, barGroupWidth * 0.3); // width of individual bars

  return (
    <div className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{title}</h3>
        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
            <span className="text-white/60">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-500"></span>
            <span className="text-white/60">Expenses</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + chartH * ratio;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.03)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Render Bars */}
          {data.map((d, i) => {
            const groupX = paddingX + i * barGroupWidth;
            const centerX = groupX + barGroupWidth / 2;

            // Coordinates for Revenue (Blue)
            const revHeight = (d.revenue / maxVal) * chartH;
            const revX = centerX - barWidth - 2;
            const revY = paddingY + chartH - revHeight;

            // Coordinates for Expense (Purple)
            const expHeight = (d.expense / maxVal) * chartH;
            const expX = centerX + 2;
            const expY = paddingY + chartH - expHeight;

            return (
              <g key={d.month} className="group">
                {/* Revenue Bar */}
                <rect
                  x={revX}
                  y={revY}
                  width={barWidth}
                  height={Math.max(2, revHeight)}
                  rx="3"
                  fill="#3b82f6"
                  className="hover:brightness-110 transition-all duration-300"
                />

                {/* Expense Bar */}
                <rect
                  x={expX}
                  y={expY}
                  width={barWidth}
                  height={Math.max(2, expHeight)}
                  rx="3"
                  fill="#a855f7"
                  className="hover:brightness-110 transition-all duration-300"
                />

                {/* X axis labels */}
                <text
                  x={centerX}
                  y={height - 2}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {d.month}
                </text>

                {/* Custom Tooltip */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <rect
                    x={centerX - 50}
                    y={paddingY - 15}
                    width="100"
                    height="32"
                    rx="6"
                    fill="#18181b"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                  <text x={centerX} y={paddingY - 3} textAnchor="middle" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    Rev: {formatCurrency(d.revenue, currency)}
                  </text>
                  <text x={centerX} y={paddingY + 9} textAnchor="middle" fill="#a855f7" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    Exp: {formatCurrency(d.expense, currency)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Y Axis scale markers */}
          <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            {formatCurrency(maxVal, currency)}
          </text>
          <text x={paddingX - 10} y={paddingY + chartH / 2 + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            {formatCurrency(maxVal / 2, currency)}
          </text>
          <text x={paddingX - 10} y={paddingY + chartH + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            {formatCurrency(0, currency)}
          </text>
        </svg>
      </div>
    </div>
  );
}
