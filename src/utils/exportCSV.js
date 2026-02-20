import { monthNames } from './semaforoUtils';

const CURRENT_MONTH = new Date().getMonth();
const SEMAFORO_LABELS = { green: 'Realizado', blue: 'En Curso', yellow: 'Pendiente', red: 'Atrasado', gray: 'No Realizado' };

/**
 * exportCSV — Downloads a CSV file from the filtered tasks array.
 *
 * @param {Array}    tasks          — array of task objects (from useGanttData)
 * @param {string}   filename       — file name without extension
 * @param {Function} getDeptStatus  — (id, semaforo) => effective status key
 */
export default function exportCSV(tasks, filename, getDeptStatus) {
    if (!tasks || tasks.length === 0) return;

    const headers = ['#', 'Actividad', 'Categoría', 'Inicio', 'Compromiso', 'Avance %', 'Estado', 'Desvío (meses)', 'Próximo Hito'];

    const rows = tasks.map((t, i) => {
        const eff = getDeptStatus ? getDeptStatus(t.id, t.semaforo) : t.semaforo;
        const desvio = t.endMonth != null ? t.endMonth - CURRENT_MONTH : '';
        return [
            i + 1,
            t.name || '',
            t.category || '',
            t.startMonth != null ? monthNames[t.startMonth] : '',
            t.endMonth != null ? monthNames[t.endMonth] : '',
            t.progress ?? 0,
            SEMAFORO_LABELS[eff] || eff || '',
            desvio,
            t.nextMilestoneTitle || '',
        ];
    });

    // UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const escape = (v) => {
        const s = String(v ?? '');
        return s.includes(',') || s.includes('"') || s.includes('\n')
            ? `"${s.replace(/"/g, '""')}"`
            : s;
    };

    const csv = BOM
        + headers.map(escape).join(',') + '\n'
        + rows.map(r => r.map(escape).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
