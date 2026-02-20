/**
 * printTable — Opens a new window with just the table content
 * and triggers the browser print dialog.
 *
 * @param {HTMLElement} tableEl  — the table (or wrapper) DOM element to print
 * @param {string}      title   — title shown in the print header
 */
export default function printTable(tableEl, title = 'Grilla') {
    if (!tableEl) return;

    const win = window.open('', '_blank', 'width=1100,height=700');
    if (!win) return;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
    .print-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
    .print-title { font-size: 1.1rem; font-weight: 700; }
    .print-date  { font-size: 0.78rem; color: #64748b; }
    table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
    th { text-align: left; padding: 8px 10px; font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc; border-bottom: 2px solid #e2e8f0; }
    td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:nth-child(even) { background: #fafbfc; }
    /* hide non-table elements in print */
    .gantt__detail-btn, .aeg__action-btn, .adm-table__action-btn,
    .gantt__td--actions, .aeg__td--actions, .adm-table__td--actions,
    button, input, select, .adm-table__search, .adm-table__toolbar,
    .gantt__toolbar, .gantt__filters, .gantt__search,
    [class*="search"], [class*="filter"], [class*="toolbar"] { display: none !important; }
    /* status pill */
    [class*="sem-pill"], [class*="status-pill"] { font-weight: 600; font-size: 0.72rem; }
    [class*="sem-dot"], [class*="status-dot"] { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 4px; }
    /* progress bar */
    [class*="progress-bar"] { display: inline-block; width: 50px; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; vertical-align: middle; margin-right: 4px; }
    [class*="progress-fill"] { height: 100%; border-radius: 3px; }
    /* dept header */
    [class*="cat-header-cell"], [class*="dept-header-cell"] { padding: 8px 10px; font-weight: 700; font-size: 0.8rem; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; border-left: 3px solid #6366f1; }
    @media print {
        body { padding: 12px; }
        .print-header { margin-bottom: 12px; }
    }
</style>
</head>
<body>
    <div class="print-header">
        <span class="print-title">${title}</span>
        <span class="print-date">${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
    </div>
    ${tableEl.outerHTML}
    <script>
        window.onload = function() {
            setTimeout(function() { window.print(); }, 250);
        };
    </script>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
}
