/* export const saludCategories = [
  'LANZAMIENTO GENERAL HOLA RENE',
  'Sistema Evol',
  'YMCA',
  'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA',
  'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
];

export const saludTasks = [
  // LANZAMIENTO GENERAL HOLA RENE
  {
    id: 's1',
    name: 'Comunicación, atención de asociados por novedad',
    status: 'En curso',
    startMonth: 0,
    endMonth: 1,
    category: 'LANZAMIENTO GENERAL HOLA RENE',
  },
  {
    id: 's2',
    name: 'Implementación y automatización de novedades (ABMs)',
    status: 'En curso',
    startMonth: 2,
    endMonth: 3,
    category: 'LANZAMIENTO GENERAL HOLA RENE',
  },

  // Sistema Evol
  {
    id: 's3',
    name: 'Pruebas de Gestión sistema Evol',
    status: 'En curso',
    startMonth: 0,
    endMonth: 2,
    category: 'Sistema Evol',
  },
  {
    id: 's4',
    name: 'Pruebas en paralelo a Evol',
    status: 'En curso',
    startMonth: 3,
    endMonth: 4,
    category: 'Sistema Evol',
  },
  {
    id: 's5',
    name: 'Implementación Sistema Evol',
    status: 'En curso',
    startMonth: 5,
    endMonth: 7,
    category: 'Sistema Evol',
  },

  // YMCA
  {
    id: 's6',
    name: 'Creación de planilla compartida con admin YMCA',
    status: 'En curso',
    startMonth: 1,
    endMonth: 1,
    category: 'YMCA',
  },
  {
    id: 's7',
    name: 'Implementación y control de padrón',
    status: 'En curso',
    startMonth: 2,
    endMonth: 2,
    category: 'YMCA',
  },

  // ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA
  {
    id: 's8',
    name: 'Promoción servicios YMCA',
    status: 'En curso',
    startMonth: 2,
    endMonth: 9,
    category: 'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA',
    note: '3 presentaciones',
  },
  {
    id: 's9',
    name: 'Información de gestión balance 2026',
    status: 'En curso',
    startMonth: 6,
    endMonth: 6,
    category: 'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA',
  },
  {
    id: 's10',
    name: 'Evaluación Desempeño devolución 25, evaluación 26',
    status: 'Pendiente',
    startMonth: 2,
    endMonth: 11,
    category: 'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA',
    note: '2 presentaciones',
  },
  {
    id: 's11',
    name: 'Acuerdos convenios Clubes',
    status: 'En curso',
    startMonth: 2,
    endMonth: 10,
    category: 'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA',
    note: '2 presentaciones',
  },
  {
    id: 's12',
    name: 'Promoción convenio Clubes',
    status: 'Pendiente',
    startMonth: 2,
    endMonth: 11,
    category: 'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA',
    note: '2 presentaciones',
  },

  // PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL
  {
    id: 's13',
    name: 'Seguimiento gestión de atención asociados Omint',
    status: 'En curso',
    startMonth: 0,
    endMonth: 11,
    category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
  },
  {
    id: 's14',
    name: 'Generación de cuota mensual Omint',
    status: 'En curso',
    startMonth: 0,
    endMonth: 11,
    category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
  },
  {
    id: 's15',
    name: 'Envío de cupones de pago Omint',
    status: 'En curso',
    startMonth: 0,
    endMonth: 11,
    category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
  },
  {
    id: 's16',
    name: 'Seguimiento de impaga Omint',
    status: 'En curso',
    startMonth: 0,
    endMonth: 11,
    category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
  },
  {
    id: 's17',
    name: 'Control de Facturación y precios YMCA',
    status: 'En curso',
    startMonth: 0,
    endMonth: 11,
    category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
  },
  {
    id: 's18',
    name: 'Gestión de renovaciones y membresías YMCA',
    status: 'En curso',
    startMonth: 0,
    endMonth: 11,
    category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
  },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'LANZAMIENTO GENERAL HOLA RENE': '#60A5FA',
  'Sistema Evol': '#34D399',
  'YMCA': '#A78BFA',
  'ANÁLISIS Y PROMOCIONES DE EJECUCIÓN DIRECTA': '#93C5FD',
  'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL': '#FDBA74',
};

export function getSaludStatus(task, currentMonth) {
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
};
 */