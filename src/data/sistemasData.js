/* export const sistemasCategories = [
  'Planificación del área de Sistemas 2026',
];

export const sistemasTasks = [
  {
    id: 'sis-1',
    name: 'Actualización de la Sala de Cómputos',
    startMonth: 0,
    endMonth: 6,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-2',
    name: 'Prueba Sistema EVOL',
    startMonth: 0,
    endMonth: 2,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-3',
    name: 'Implementación Sistema EVOL',
    startMonth: 2,
    endMonth: 4,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-4',
    name: 'Soporte a Usuarios tras migración a EVOL',
    startMonth: 0,
    endMonth: 5,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-5',
    name: 'Desarrollo y despliegue de Web Ameport',
    startMonth: 0,
    endMonth: 11,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-6',
    name: 'Implementación de la App Mobile',
    startMonth: 0,
    endMonth: 2,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-7',
    name: 'Implementación del Turnero Web',
    startMonth: 0,
    endMonth: 5,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-8',
    name: 'Instalación Equipamiento Videoconferencia 3er piso',
    startMonth: 0,
    endMonth: 2,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-9',
    name: 'Cambio de proveedor para ancho de banda en CONSULTORIOS (1gb)',
    startMonth: 0,
    endMonth: 2,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-10',
    name: 'Cambio de proveedor para Correo Electrónicos',
    startMonth: 2,
    endMonth: 4,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-11',
    name: 'Actualización de Firmware y SO de todas las PC',
    startMonth: 4,
    endMonth: 7,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-12',
    name: 'Migración del Data Center a Nube',
    startMonth: 2,
    endMonth: 5,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-13',
    name: 'Actualización de equipamiento y PC',
    startMonth: 0,
    endMonth: 7,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-14',
    name: 'Agregado de cámaras de video en zona de pasillos de baños',
    startMonth: 2,
    endMonth: 4,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-15',
    name: 'Agregado de una Central Sistema con Consuela para la oficina de Consumo',
    startMonth: 2,
    endMonth: 5,
    category: 'Planificación del área de Sistemas 2026',
  },
  {
    id: 'sis-16',
    name: 'Agregar un tercer proveedor de Internet para un servicio estable y aumento de velocidad',
    startMonth: 1,
    endMonth: 2,
    category: 'Planificación del área de Sistemas 2026',
  },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'Planificación del área de Sistemas 2026': '#3B82F6',
}; */

/**
 * Determines the semáforo (traffic light) status for a task.
 * @param {object} task — a task with startMonth and endMonth
 * @param {number} currentMonth — 0-based (0=Ene, 11=Dic)
 * @returns {'green' | 'yellow' | 'red'}
 */
/* export function getSistemasStatus(task, currentMonth) {
  // Future task — hasn't started yet
  if (currentMonth < task.startMonth) {
    return 'green';
  }
  // Currently in range
  if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) {
    return 'green';
  }
  // Just past the deadline (1-month tolerance)
  if (currentMonth === task.endMonth + 1) {
    return 'yellow';
  }
  // Overdue
  if (currentMonth > task.endMonth + 1) {
    return 'red';
  }
  return 'green';
}

export const statusLabels = {
  green: 'A tiempo',
  yellow: 'En cierre',
  red: 'Atrasado',
};

export const statusColors = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
};
 */