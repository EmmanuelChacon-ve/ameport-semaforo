/* export const gestionCategories = [
  'AYUDA ESCOLAR Y UNIVERSITARIA',
  'SISTEMA EVOL',
  'DESARROLLO WEB-APP',
  'CAMBIO DE SUPERVISORA',
  'SISTEMA Y MOTOR DE DECISIÓN SISSA',
  'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA',
  'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
];

export const gestionTasks = [
  // AYUDA ESCOLAR Y UNIVERSITARIA
  { id: 'g1', name: 'Análisis de montos, tasas, presupuesto o cupo, recursos implementación', status: 'En curso', startMonth: 1, endMonth: 1, category: 'AYUDA ESCOLAR Y UNIVERSITARIA' },
  { id: 'g2', name: 'Implementación', status: 'Pendiente', startMonth: 2, endMonth: 3, category: 'AYUDA ESCOLAR Y UNIVERSITARIA' },

  // SISTEMA EVOL
  { id: 'g3', name: 'Pruebas de Gestión sistema Evol', status: 'En curso', startMonth: 0, endMonth: 2, category: 'SISTEMA EVOL' },
  { id: 'g4', name: 'Pruebas en paralelo Evol', status: 'Pendiente', startMonth: 3, endMonth: 5, category: 'SISTEMA EVOL' },
  { id: 'g5', name: 'Implementación del Sistema Evol', status: 'Pendiente', startMonth: 6, endMonth: 8, category: 'SISTEMA EVOL' },

  // DESARROLLO WEB-APP
  { id: 'g6', name: 'Apoyo desarrollo web-app', status: 'En curso', startMonth: 0, endMonth: 2, category: 'DESARROLLO WEB-APP' },
  { id: 'g7', name: 'Implementación Legajo con digital c/firma electrónica', status: 'En curso', startMonth: 2, endMonth: 3, category: 'DESARROLLO WEB-APP' },
  { id: 'g8', name: 'Implementación Asociación Online', status: 'Pendiente', startMonth: 3, endMonth: 3, category: 'DESARROLLO WEB-APP' },
  { id: 'g9', name: 'Implementación Firma Digital Interna para Aprobación', status: 'En curso', startMonth: 4, endMonth: 4, category: 'DESARROLLO WEB-APP' },

  // CAMBIO DE SUPERVISORA
  { id: 'g10', name: 'Capacitación del área', status: 'En curso', startMonth: 0, endMonth: 2, category: 'CAMBIO DE SUPERVISORA' },
  { id: 'g11', name: 'Implementación del Cambio', status: 'Pendiente', startMonth: 3, endMonth: 6, category: 'CAMBIO DE SUPERVISORA' },

  // SISTEMA Y MOTOR DE DECISIÓN SISSA
  { id: 'g12', name: 'Relevamiento de variables y política de mercado abierto', status: 'En curso', startMonth: 0, endMonth: 1, category: 'SISTEMA Y MOTOR DE DECISIÓN SISSA' },
  { id: 'g13', name: 'Parametrización de sistema', status: 'Pendiente', startMonth: 2, endMonth: 3, category: 'SISTEMA Y MOTOR DE DECISIÓN SISSA' },
  { id: 'g14', name: 'Implementación y Ajustes', status: 'Pendiente', startMonth: 4, endMonth: 5, category: 'SISTEMA Y MOTOR DE DECISIÓN SISSA' },

  // ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA
  { id: 'g15', name: 'Presupuesto semestral de estimación de demanda', status: 'En curso', startMonth: 1, endMonth: 1, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g16', name: 'Presupuesto semestral de estimación de demanda (2do)', status: 'En curso', startMonth: 7, endMonth: 7, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g17', name: 'Información de gestión balance 2026', status: 'Pendiente', startMonth: 6, endMonth: 6, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g18', name: 'Revisión Montos y Ayudas (1er semestre)', status: 'Pendiente', startMonth: 5, endMonth: 5, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g19', name: 'Revisión Montos y Ayudas (2do semestre)', status: 'Pendiente', startMonth: 11, endMonth: 11, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g20', name: 'Evaluación bienestar/Oferta devolución 25, evaluación 26', status: 'Pendiente', startMonth: 2, endMonth: 2, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g21', name: 'Implementación nueva solicitud ayuda económica', status: 'En curso', startMonth: 2, endMonth: 2, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },
  { id: 'g22', name: 'Implementación Línea de financiación de Motos', status: 'En curso', startMonth: 1, endMonth: 2, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },

  // PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL
  { id: 'g23', name: 'Seguimiento gestión de Altas - Bajas - Subsidios', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'g24', name: 'Seguimiento gestión de Ayudas Económicas', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'g25', name: 'Control de Tasas BNA y otras', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'g26', name: 'Informes de estadísticas mensuales ayudas y asociados', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'g27', name: 'Control de productividad equipo de GDA', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'AYUDA ESCOLAR Y UNIVERSITARIA': '#93C5FD',
  'SISTEMA EVOL': '#C4B5FD',
  'DESARROLLO WEB-APP': '#67E8F9',
  'CAMBIO DE SUPERVISORA': '#FDBA74',
  'SISTEMA Y MOTOR DE DECISIÓN SISSA': '#60A5FA',
  'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA': '#7DD3FC',
  'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL': '#FED7AA',
};

export function getGestionStatus(task, currentMonth) {
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