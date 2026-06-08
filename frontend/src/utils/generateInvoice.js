import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (payment) => {
  const doc  = new jsPDF();
  // REPLACE WITH:
const dateObj = payment.paymentDate
  ? new Date(payment.paymentDate + 'T00:00:00')
  : new Date();
const date = dateObj.toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });

  // Header bar
  doc.setFillColor(46, 96, 169);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('IIITB COMET Foundation', 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Future Wireless Communications Program', 14, 21);
  doc.text(`Date: ${date}`, 160, 21);

  // Date of Payment box
doc.setFillColor(240, 249, 255);
doc.setDrawColor(147, 197, 253);
doc.roundedRect(14, 119, 182, 20, 3, 3, 'FD');
doc.setTextColor(29, 78, 216);
doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.text('Date of Payment:', 19, 128);
doc.setFontSize(11);
doc.text(date, 19, 136);
  // Yellow bar
  doc.setFillColor(255, 204, 0);
  doc.rect(0, 30, 210, 3, 'F');

  // Status badge
  doc.setFillColor(220, 252, 231);
  doc.rect(0, 33, 210, 12, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('✓  Payment Submitted', 14, 41);

  // Student info
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Details', 14, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Name: ${payment.name}`,         14, 66);
  doc.text(`COMET ID: ${payment.cometId}`,  14, 73);
  doc.text(`Email: ${payment.email}`,        14, 80);
  doc.text(`Contact: ${payment.contact}`,   14, 87);

  // UTR box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(134, 239, 172);
  doc.roundedRect(14, 95, 182, 20, 3, 3, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('UPI Transaction Reference (UTR):', 19, 104);
  doc.setFontSize(11);
  doc.text(payment.utrNumber, 19, 112);

  // Modules table
  autoTable(doc, {
    startY: 145,
    head: [['Module / Term', 'Amount (₹)']],
    body: [
      ...payment.modules.map(m => [
        `${m.moduleName}${m.termName ? ' — ' + m.termName : ''}`,
        m.fee.toLocaleString('en-IN')
      ]),
      ['Total', payment.grandTotal.toLocaleString('en-IN')]
    ],
    headStyles:  { fillColor: [46, 96, 169], fontSize: 9 },
    bodyStyles:  { fontSize: 9 },
    footStyles:  { fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } }
  });

  // Footer
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('© 2025 IIITB COMET Foundation', 14, 290);
  doc.text('Computer-generated document', 140, 290);

  doc.save(`Invoice_COMET_${payment.cometId}.pdf`);
};
