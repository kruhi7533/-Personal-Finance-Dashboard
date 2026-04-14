import { formatINR, formatDate } from './formatters';

export const exportTransactionsToPDF = (transactions) => {
  if (!transactions || transactions.length === 0) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to generate the PDF report.");
    return;
  }

  const tableRows = transactions.map(t => {
    const formattedDate = formatDate(t.date, { month: 'short', day: '2-digit', year: 'numeric' });
    const formattedAmount = formatINR(t.amount);
    const amountColor = t.type === 'income' ? '#16a34a' : '#333333';
    const typeLabel = t.type.toUpperCase();

    return `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${t.name}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${formattedDate}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${t.category}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0;">
          <span style="font-size: 10px; padding: 4px 8px; background: #f1f5f9; border-radius: 6px; font-weight: bold; color: ${t.type === 'income' ? '#16a34a' : '#ef4444'}">
            ${typeLabel}
          </span>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${amountColor};">
          ${t.type === 'income' ? '+' : '-'}${formattedAmount}
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Transactions_Report</title>
        <style>
          @media print { @page { margin: 20mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 1000px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
          .header h1 { margin: 0; font-size: 28px; color: #0f172a; }
          .header p { margin: 8px 0 0 0; color: #64748b; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
          th { padding: 12px 8px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Transactions Report</h1>
            <p>Exported on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div><p style="font-weight: bold; color: #0f172a;">FinFlow Dashboard</p></div>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Date</th><th>Category</th><th>Type</th><th style="text-align: right;">Amount</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>window.onload = () => { setTimeout(() => { window.print(); }, 250); }</script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
