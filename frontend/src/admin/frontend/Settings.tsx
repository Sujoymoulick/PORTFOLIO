import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Settings as SettingsIcon, Save, Loader2, CheckCircle, Upload } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    logo: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    gst: '',
    invoicePrefix: 'INV-',
    invoiceFooter: 'Thank you for your business!',
    currency: 'USD',
    timezone: 'UTC'
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await api.get('/api/settings');
        if (data) {
          setFormData({
            companyName: data.companyName || '',
            logo: data.logo || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            gst: data.gst || '',
            invoicePrefix: data.invoicePrefix || 'INV-',
            invoiceFooter: data.invoiceFooter || 'Thank you for your business!',
            currency: data.currency || 'USD',
            timezone: data.timezone || 'UTC'
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await api.put('/api/settings', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to update system settings.');
    } finally {
      setSubmitting(false);
    }
  };

  // Convert uploaded image to base64 string
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo size must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded w-1/4"></div>
        <div className="h-96 bg-white/5 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-display font-black text-white">System Settings</h2>
        <p className="text-xs text-white/40 font-light mt-1">Configure company details, banking information, tax codes, and default invoice setups.</p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>System settings updated successfully! Changes reflect on print invoices immediately.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Company profile Card */}
        <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">Company Details</h3>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo box */}
            <div className="space-y-2">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Company Logo</span>
              <div className="w-40 h-28 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logo: '' })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-red-400 transition-opacity font-bold uppercase tracking-wider"
                    >
                      Clear Logo
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload size={20} className="mx-auto text-white/30 mb-2" />
                    <span className="text-[10px] text-white/40">Select Image</span>
                  </div>
                )}
                {!formData.logo && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">GSTIN / Tax ID</label>
                <input
                  type="text"
                  placeholder="27AAAAA1111A1Z1"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Billing Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Website URL</label>
              <input
                type="url"
                placeholder="https://sujoymoulick.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Physical Billing Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Invoice Preferences card */}
        <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 border-b border-white/5 pb-3">Invoice Defaults</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">System Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl focus:outline-none text-xs text-white"
              >
                <option value="UTC">UTC (Universal Time)</option>
                <option value="GMT">GMT (London)</option>
                <option value="IST">IST (Kolkata/Delhi)</option>
                <option value="EST">EST (New York)</option>
                <option value="PST">PST (Los Angeles)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Default Invoice Footer/Terms</label>
            <textarea
              rows={3}
              value={formData.invoiceFooter}
              onChange={(e) => setFormData({ ...formData, invoiceFooter: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs text-white resize-none"
            />
          </div>
        </div>

        {/* Form buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving Changes
              </>
            ) : (
              <>
                <Save size={14} /> Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
