export const exportPaymentsCSV = (payments) => {
  const headers = ['COMET ID', 'Name', 'Email', 'Contact', 'Modules', 'Amount', 'UTR', 'Status', 'Date'];
  const rows = payments.map(p => [
    p.cometId,
    p.name,
    p.email,
    p.contact,
    p.modules.map(m => `${m.moduleName}${m.termName ? '-' + m.termName : ''}`).join(' | '),
    p.grandTotal,
    p.utrNumber,
    p.paymentStatus,
    new Date(p.createdAt).toLocaleDateString('en-IN')
  ]);

  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `COMET_Payments_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};