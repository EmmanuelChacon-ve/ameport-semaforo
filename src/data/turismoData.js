/* export const turismoCategories = [
  'TURISMO SOCIAL',
  'LIMA 265-ACARA',
  'AGENCIA AMEPORT',
];

export const turismoTasks = [
  // TURISMO SOCIAL
  {
    id: 't1a',
    name: 'Salidas grupales con el objetivo de afianzar el sentido de pertenencia',
    status: 'Pendiente',
    startMonth: 2,
    endMonth: 10,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't1b',
    name: 'Salidas grupales con el objetivo de afianzar el sentido de pertenencia',
    status: 'Pendiente',
    startMonth: 5,
    endMonth: 5,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't1c',
    name: 'Salidas grupales con el objetivo de afianzar el sentido de pertenencia',
    status: 'Pendiente',
    startMonth: 8,
    endMonth: 10,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't2a',
    name: 'Mini Turismo',
    status: 'Ocasional',
    startMonth: 3,
    endMonth: 4,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't2b',
    name: 'Mini Turismo',
    status: 'Ocasional',
    startMonth: 8,
    endMonth: 9,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't3a',
    name: 'Feriados largos y recreación',
    status: 'En curso',
    startMonth: 1,
    endMonth: 7,
    category: 'TURISMO SOCIAL',
    note: 'Múltiples períodos',
  },
  {
    id: 't3b',
    name: 'Feriados largos y recreación',
    status: 'En curso',
    startMonth: 9,
    endMonth: 11,
    category: 'TURISMO SOCIAL',
    note: 'Múltiples períodos',
  },
  {
    id: 't4',
    name: 'Trabajar sobre la información para el Balance',
    status: 'Pendiente',
    startMonth: 6,
    endMonth: 6,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't5',
    name: 'Ajustar información según C.D. para el verano 2027',
    status: 'Pendiente',
    startMonth: 8,
    endMonth: 9,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't6',
    name: 'Venta de Hoteles convenio 2026',
    status: 'Pendiente',
    startMonth: 0,
    endMonth: 11,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't7',
    name: 'Publicidad para la venta de hoteles con plazas contratadas',
    status: 'Pendiente',
    startMonth: 0,
    endMonth: 11,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't8',
    name: 'Encuesta sobre calidad y servicios de hoteles convenio 2026',
    status: 'Pendiente',
    startMonth: 0,
    endMonth: 11,
    category: 'TURISMO SOCIAL',
  },
  {
    id: 't9',
    name: 'Control de plazas vendidas',
    status: 'Pendiente',
    startMonth: 0,
    endMonth: 11,
    category: 'TURISMO SOCIAL',
  },

  // LIMA 265-ACARA
  {
    id: 't10',
    name: 'Recepción de reservas, confirmación y venta',
    status: 'Ocasional',
    startMonth: 0,
    endMonth: 11,
    category: 'LIMA 265-ACARA',
  },
  {
    id: 't11',
    name: 'Arreglos varios, reposición de vajilla y ropa de cama, WiFi y TV',
    status: 'Ocasional',
    startMonth: 0,
    endMonth: 11,
    category: 'LIMA 265-ACARA',
  },

  // AGENCIA AMEPORT
  {
    id: 't12',
    name: 'Análisis crediticio p/ cierre de ventas',
    status: 'Ocasional',
    startMonth: 0,
    endMonth: 11,
    category: 'AGENCIA AMEPORT',
  },
  {
    id: 't13',
    name: 'Cobranza y facturación',
    status: 'Ocasional',
    startMonth: 0,
    endMonth: 11,
    category: 'AGENCIA AMEPORT',
  },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'TURISMO SOCIAL': '#F97316',
  'LIMA 265-ACARA': '#60A5FA',
  'AGENCIA AMEPORT': '#FACC15',
}; */

/**
 * Determines traffic-light status for a turismo task.
 * @param {object} task
 * @param {number} currentMonth 0-based
 * @returns {'green' | 'yellow' | 'red'}
 */
/* export function getTurismoStatus(task, currentMonth) {
  if (task.status === 'En curso') {
    if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) return 'green';
    if (currentMonth > task.endMonth) return 'red';
    return 'yellow';
  }
  if (task.status === 'Pendiente') {
    if (currentMonth < task.startMonth) return 'green';
    if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) return 'yellow';
    return 'red';
  }
  // Ocasional
  return 'green';
}

export const statusLabels = {
  green: 'A tiempo',
  yellow: 'Próximo / En curso',
  red: 'Atrasado',
};

export const semaforoColors = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
}; */
