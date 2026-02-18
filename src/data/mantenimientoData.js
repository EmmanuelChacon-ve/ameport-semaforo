/* export const mantCategories = [
  'Estratégico',
  'Táctico',
  'Operativo / Continuo',
];

export const mantTasks = [
  // Estratégico
  { id: 'm1', name: 'Paneles Solares', category: 'Estratégico', frequency: 'Único', months: [4] },
  { id: 'm2', name: 'Cambio Vehículo', category: 'Estratégico', frequency: 'Único', months: [2] },
  { id: 'm3', name: 'Reestructuración Física / Redes', category: 'Estratégico', frequency: 'Único', months: [3] },

  // Táctico
  { id: 'm4', name: 'Arreglo de Aire Acondicionado de 2 sedes y Apart Lima 263', category: 'Táctico', frequency: 'Único', months: [2] },
  { id: 'm5', name: 'Limpieza Subsuelo y Depósito de Edif. Lima 263', category: 'Táctico', frequency: 'Único', months: [3, 4, 5, 6] },
  { id: 'm6', name: 'Pintura Escalera y Oficinas 4 piso', category: 'Táctico', frequency: 'Único', months: [3], notes: 'Retoques Terciarizado' },
  { id: 'm7', name: 'Colocación TV / Videoconferencia', category: 'Táctico', frequency: 'Único', months: [1] },
  { id: 'm8', name: 'Hospital Posadas - Armado espacio Referente', category: 'Táctico', frequency: 'Único', months: [3] },

  // Operativo / Continuo
  { id: 'm9', name: 'Elaboración de Listado de Compras para Refrigerio', category: 'Operativo / Continuo', frequency: 'Mensual', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'm10', name: 'Limpieza de 2 sedes y Apart Lima 263', category: 'Operativo / Continuo', frequency: 'Semanal', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'm11', name: 'Limpieza de Tanque de Agua', category: 'Operativo / Continuo', frequency: 'Semestral', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'm12', name: 'Cambios Matafuegos', category: 'Operativo / Continuo', frequency: 'Único', months: [2] },
  { id: 'm13', name: 'Ascensores', category: 'Operativo / Continuo', frequency: 'Mensual', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'm14', name: 'Aire Acondicionado', category: 'Operativo / Continuo', frequency: 'Mensual', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'm15', name: 'Aire Acondicionado Apart Lima 263 - Terciarizado', category: 'Operativo / Continuo', frequency: 'Bimestral', months: [0, 2, 4, 6, 8, 10] },
  { id: 'm16', name: 'Caja Comando de manejo a través de la Web para Resetear el Router por Servicio Internet En Apart Lima 263', category: 'Operativo / Continuo', frequency: 'Único', months: [4] },
  { id: 'm17', name: 'Mantenimiento preventivo', category: 'Operativo / Continuo', frequency: 'Mensual', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'Estratégico': '#FCA5A5',
  'Táctico': '#93C5FD',
  'Operativo / Continuo': '#4ADE80',
};

export function getMantStatus(task, currentMonth) {
  const hasCurrentMonth = task.months.includes(currentMonth);
  const hasPassedMonths = task.months.some((m) => m < currentMonth);
  const hasFutureMonths = task.months.some((m) => m > currentMonth);

  if (hasCurrentMonth) return 'yellow';

  if (task.frequency === 'Único' && hasPassedMonths && !hasFutureMonths) {
    const maxMonth = Math.max(...task.months);
    if (currentMonth - maxMonth > 2) return 'red';
    return 'green';
  }

  if (hasFutureMonths && !hasPassedMonths) return 'green';
  if (hasPassedMonths && hasFutureMonths) return 'green';

  return 'green';
}

export const statusLabels = {
  green: 'A tiempo',
  yellow: 'En ejecución',
  red: 'Atrasado',
};

export const semaforoColors = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
};

export const frequencyColors = {
  'Único': '#8B5CF6',
  'Mensual': '#3B82F6',
  'Semanal': '#10B981',
  'Semestral': '#F59E0B',
  'Bimestral': '#EC4899',
  'Trimestral': '#F97316',
};
 */