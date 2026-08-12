export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const keys = columns 
    ? columns.map(c => c.key) 
    : (Object.keys(data[0]) as (keyof T)[]);

  const headers = columns 
    ? columns.map(c => c.label) 
    : keys.map(k => String(k).toUpperCase());

  const csvRows: string[] = [];
  csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  for (const row of data) {
    const values = keys.map(key => {
      const rawVal = row[key];
      let valStr = '';
      if (rawVal === null || rawVal === undefined) {
        valStr = '';
      } else if (typeof rawVal === 'object') {
        valStr = JSON.stringify(rawVal);
      } else {
        valStr = String(rawVal);
      }
      return `"${valStr.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}
