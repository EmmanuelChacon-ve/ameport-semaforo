/**
 * semaforoUtils.js
 * 
 * Generic semáforo (traffic light) utilities.
 * Unifies the logic from all 9 department-specific data files into one
 * generic function that auto-detects the task format.
 */

/* ── Status constants ── */
export const STATUS = {
  REALIZADO: 'Realizado',
  EN_CURSO: 'En Curso',
  PENDIENTE: 'Pendiente',
  ATRASADO: 'Atrasado',
  NO_REALIZADO: 'No Realizado',
};

export const STATUS_CONFIG = {
  [STATUS.REALIZADO]: {
    color: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    icon: '✓',
    label: 'Realizado',
  },
  [STATUS.EN_CURSO]: {
    color: '#3B82F6',
    bgLight: 'rgba(59, 130, 246, 0.12)',
    icon: '▶',
    label: 'En Curso',
  },
  [STATUS.PENDIENTE]: {
    color: '#F59E0B',
    bgLight: 'rgba(245, 158, 11, 0.12)',
    icon: '◉',
    label: 'Pendiente',
  },
  [STATUS.ATRASADO]: {
    color: '#EF4444',
    bgLight: 'rgba(239, 68, 68, 0.12)',
    icon: '!',
    label: 'Atrasado',
  },
  [STATUS.NO_REALIZADO]: {
    color: '#6B7280',
    bgLight: 'rgba(107, 114, 128, 0.12)',
    icon: '✗',
    label: 'No Realizado',
  },
};

/* ── Current month helpers ── */
const CURRENT_MONTH = new Date().getMonth();

const monthLabels = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const currentMonthLabel = monthLabels[CURRENT_MONTH];

/**
 * Determines if a task is active in the current month.
 * Works with both `months[]` and `startMonth/endMonth` task formats.
 */
export function isActiveThisMonth(task) {
  if (Array.isArray(task.months)) {
    return task.months.includes(CURRENT_MONTH);
  }
  if (task.startMonth !== undefined && task.endMonth !== undefined) {
    return CURRENT_MONTH >= task.startMonth && CURRENT_MONTH <= task.endMonth;
  }
  return false;
}

/**
 * Generic semáforo calculator — unifies the logic from all department-specific
 * getStatus functions. Detects the task format and applies the right logic:
 *
 * 1. Tasks with `months[]` array (Consumo / Mantenimiento style)
 * 2. Tasks with `startMonth/endMonth` + `status` (Turismo / Com / Salud / Crec / Gestión)
 * 3. Tasks with only `startMonth/endMonth` (Sistemas / Finanzas)
 *
 * @param {object} task — activity object from the API
 * @param {number} currentMonth — 0-based month index
 * @returns {'green' | 'yellow' | 'red'}
 */
export function calculateSemaforo(task, currentMonth = CURRENT_MONTH) {
  // ── Format 1: months array (Consumo, Mantenimiento) ──
  if (Array.isArray(task.months) && task.months.length > 0) {
    const hasCurrentMonth = task.months.includes(currentMonth);
    const hasPassedMonths = task.months.some((m) => m < currentMonth);
    const hasFutureMonths = task.months.some((m) => m > currentMonth);

    if (hasCurrentMonth) return 'yellow';

    // Mantenimiento "Único" tasks that are fully past
    if (task.frequency === 'Único' && hasPassedMonths && !hasFutureMonths) {
      const maxMonth = Math.max(...task.months);
      if (currentMonth - maxMonth > 2) return 'red';
      return 'green';
    }

    return 'green';
  }

  // ── Format 2: startMonth/endMonth + status (Turismo, Comunicación, etc.) ──
  if (task.status && task.startMonth !== undefined && task.endMonth !== undefined) {
    if (task.status === 'En curso' || task.status === 'En Curso') {
      if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) return 'green';
      if (currentMonth > task.endMonth) return 'red';
      return 'yellow';
    }
    if (task.status === 'Pendiente') {
      if (currentMonth < task.startMonth) return 'green';
      if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) return 'yellow';
      return 'red';
    }
    // Ocasional or other statuses
    return 'green';
  }

  // ── Format 3: only startMonth/endMonth (Sistemas, Finanzas) ──
  if (task.startMonth !== undefined && task.endMonth !== undefined) {
    if (currentMonth < task.startMonth) return 'green';
    if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) return 'green';
    if (currentMonth === task.endMonth + 1) return 'yellow';
    if (currentMonth > task.endMonth + 1) return 'red';
    return 'green';
  }

  return 'green';
}

/**
 * Maps a semáforo color to a dashboard STATUS value.
 */
export function semaforoToStatus(sem) {
  switch (sem) {
    case 'green': return STATUS.REALIZADO;
    case 'yellow': return STATUS.EN_CURSO;
    case 'red': return STATUS.ATRASADO;
    default: return STATUS.PENDIENTE;
  }
}

/* ── Shared Gantt constants (previously duplicated in each data file) ── */

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const statusLabels = {
  green: 'A tiempo',
  yellow: 'En cierre',
  red: 'Atrasado',
};

export const semaforoColors = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
};

export const frequencyColors = {
  Mensual: '#3B82F6',
  Bimensual: '#8B5CF6',
  Trimestral: '#EC4899',
  Semestral: '#F97316',
  Anual: '#14B8A6',
  Único: '#64748B',
};
