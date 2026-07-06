import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Printer, ArrowLeft, Download } from 'lucide-react';

const formatCurrency = (val: number, cur: string) => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
  }).format(val);
};

export default function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setLoading(true);
        const invList = await api.get('/api/invoices');
        const inv = invList.find((i: any) => i._id === id);
        const settingsData = await api.get('/api/settings');
        
        setInvoice(inv);
        setSettings(settingsData);
      } catch (err) {
        console.error('Failed to load invoice print details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoiceDetails();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Loading Print Invoice Layout...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <p className="text-red-400 font-bold mb-4">Invoice record not found.</p>
        <button onClick={() => navigate('/admin/invoices')} className="px-4 py-2 bg-zinc-800 rounded-xl text-xs text-white">
          Return to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 p-6 md:p-12 font-sans relative">
      {/* CSS style block to handle print specific formatting */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}} />

      {/* Action Navigation Header (Hidden on Print) */}
      <div className="no-print max-w-4xl mx-auto mb-8 p-4 bg-zinc-900 border border-white/10 rounded-2xl flex justify-between items-center text-white">
        <button 
          onClick={() => navigate('/admin/invoices')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            <Printer size={14} /> Print Invoice
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest border border-white/5 transition-all cursor-pointer"
          >
            <Download size={14} /> Save PDF
          </button>
        </div>
      </div>

      {/* Invoice Sheet container */}
      <div className="invoice-card max-w-4xl mx-auto p-10 bg-white border border-zinc-200 rounded-3xl shadow-sm space-y-12">
        
        {/* Company Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-zinc-900">{settings?.companyName || 'Sujoy Moulick'}</h2>
            <div className="text-xs text-zinc-500 leading-relaxed space-y-0.5">
              {settings?.address && <p className="max-w-xs">{settings.address}</p>}
              {settings?.phone && <p>Phone: {settings.phone}</p>}
              {settings?.email && <p>Email: {settings.email}</p>}
              {settings?.website && <p>Website: {settings.website}</p>}
              {settings?.gst && <p className="font-mono text-zinc-900 font-bold uppercase">GSTIN: {settings.gst}</p>}
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Invoice Reference</span>
            <h1 className="text-2xl font-mono font-black text-zinc-900">{invoice.invoiceNumber}</h1>
            <div className="inline-block px-2.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 text-[9px] font-bold uppercase tracking-wider rounded-full mt-2">
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Client & Date Details */}
        <div className="grid grid-cols-2 gap-8 border-t border-b border-zinc-100 py-8">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Billed To</span>
            <div className="text-xs space-y-1 text-zinc-700">
              <p className="font-bold text-zinc-900 text-sm">{invoice.clientDetails?.name}</p>
              {invoice.clientDetails?.company && <p className="font-medium text-zinc-800">{invoice.clientDetails.company}</p>}
              {invoice.clientDetails?.email && <p>Email: {invoice.clientDetails.email}</p>}
              {invoice.clientDetails?.phone && <p>Phone: {invoice.clientDetails.phone}</p>}
              {invoice.clientDetails?.address && <p className="max-w-xs text-zinc-500">{invoice.clientDetails.address}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Billing Terms</span>
            <div className="text-xs space-y-1.5 text-zinc-700 font-mono">
              <p><span className="text-zinc-400">Date of Issue:</span> {invoice.issueDate}</p>
              <p><span className="text-zinc-400">Payment Due:</span> {invoice.dueDate}</p>
              <p><span className="text-zinc-400">Payment Method:</span> {invoice.paymentMethod}</p>
              {invoice.projectDetails && <p><span className="text-zinc-400">Project:</span> {invoice.projectDetails.projectName}</p>}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-300 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <th className="py-3">Description</th>
                <th className="py-3 w-16 text-center">Qty</th>
                <th className="py-3 w-28 text-right">Unit Price</th>
                <th className="py-3 w-28 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {(invoice.items || []).map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-4 font-medium text-zinc-900">{item.description}</td>
                  <td className="py-4 text-center font-mono">{item.quantity}</td>
                  <td className="py-4 text-right font-mono">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-4 text-right font-mono font-bold text-zinc-900">{formatCurrency(item.total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Details */}
        <div className="flex flex-col sm:flex-row justify-end items-start gap-8 pt-6 border-t border-zinc-100">
          {/* Pricing Totals */}
          <div className="w-full sm:w-64 space-y-2.5 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-zinc-950 font-bold">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax ({invoice.tax}%)</span>
                <span className="font-mono text-zinc-950 font-bold">+{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-mono text-zinc-950 font-bold">-{formatCurrency(invoice.discountAmount, invoice.currency)}</span>
              </div>
            )}
            <div className="border-t border-zinc-300 pt-3 flex justify-between text-sm font-bold text-zinc-950">
              <span>Grand Total</span>
              <span className="font-mono text-blue-600 text-base">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Footer notes & Signature */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-end gap-8">
          {invoice.notes && (
            <div className="flex-1 text-[10px] text-zinc-400 leading-relaxed max-w-md">
              <span className="font-bold uppercase tracking-widest text-zinc-500 block mb-1">Terms & Conditions</span>
              <p>{invoice.notes}</p>
            </div>
          )}
          
          {/* Signature placeholder */}
          <div className="text-center w-48 space-y-2">
            <div className="h-12 flex items-center justify-center">
              {/* Optional cursive name placeholder */}
              <span className="font-display italic text-lg text-zinc-500">{settings?.companyName || 'Sujoy Moulick'}</span>
            </div>
            <div className="border-t border-zinc-300 pt-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
