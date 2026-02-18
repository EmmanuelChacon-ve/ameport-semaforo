/* export const consumoCategories = ['Especial', 'Proyecto', 'Temporada'];

export const consumoTasks = [
  { id: 'co1', name: 'Especial Bajo el Sol', months: [0], category: 'Especial' },
  { id: 'co2', name: 'Especial Favoritos del mes', months: [0], category: 'Especial' },
  { id: 'co3', name: 'Aires acondicionados Tecnología INVERTER', months: [1], category: 'Temporada' },
  { id: 'co4', name: 'Vuelta al cole', months: [1], category: 'Especial' },
  { id: 'co5', name: 'Proyecto Herramientas para Emprender', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], category: 'Proyecto' },
  { id: 'co6', name: 'Vuelta a la Rutina', months: [2], category: 'Especial' },
  { id: 'co7', name: 'Tecnología para el día a día', months: [2], category: 'Especial' },
  { id: 'co8', name: 'Descanso y Hogar', months: [3], category: 'Especial' },
  { id: 'co9', name: 'Anticípate el frío', months: [3], category: 'Temporada' },
  { id: 'co10', name: 'Mes del Trabajador', months: [4], category: 'Especial' },
  { id: 'co11', name: 'Se viene el Mundial', months: [4, 5], category: 'Especial' },
  { id: 'co12', name: 'Especial Invierno', months: [5], category: 'Especial' },
  { id: 'co13', name: 'Para papá, el mundial se vive mejor', months: [5], category: 'Especial' },
  { id: 'co14', name: 'El mundial se vive en casa', months: [6], category: 'Especial' },
  { id: 'co15', name: 'Mundial de Invierno', months: [6], category: 'Especial' },
  { id: 'co16', name: 'Mes de la Niñez', months: [7], category: 'Especial' },
  { id: 'co17', name: 'Día de la Niñez', months: [7], category: 'Especial' },
  { id: 'co18', name: 'Proyecto Crecer en Familia', months: [7, 8, 9, 10, 11], category: 'Proyecto' },
  { id: 'co19', name: 'Primavera en casa', months: [8], category: 'Especial' },
  { id: 'co20', name: 'Cocina para el día a día', months: [8], category: 'Especial' },
  { id: 'co21', name: 'Mes de Mamá: Bienestar y estilo', months: [9], category: 'Especial' },
  { id: 'co22', name: 'Mes de Mamá: Para disfrutar en casa', months: [9], category: 'Especial' },
  { id: 'co23', name: 'Temporada ventilación y refrigeración', months: [10], category: 'Temporada' },
  { id: 'co24', name: 'Pre-Verano', months: [10], category: 'Temporada' },
  { id: 'co25', name: 'Navidad: Empieza a elegir', months: [11], category: 'Especial' },
  { id: 'co26', name: 'Navidad: El regalo perfecto', months: [11], category: 'Especial' },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'Especial': '#93C5FD',
  'Proyecto': '#FCA5A5',
  'Temporada': '#4ADE80',
};

export function getConsumoStatus(task, currentMonth) {
  const hasCurrentMonth = task.months.includes(currentMonth);
  const hasPassedMonths = task.months.some((m) => m < currentMonth);
  const hasFutureMonths = task.months.some((m) => m > currentMonth);

  if (hasCurrentMonth) return 'yellow';
  if (hasPassedMonths && !hasFutureMonths) return 'green';
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
 */