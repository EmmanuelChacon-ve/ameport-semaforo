/* export const crecCategories = [
  'NUEVOS CONVENIOS INSTITUCIONALES',
  'PROVINCIAS A TRABAJAR PRIMER SEMESTRE',
  'RED DE REFERENTES Y COLABORADORES',
  'DESARROLLO EQUIPO DE TRABAJO Y TAREAS',
  'FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS',
  'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA',
  'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL',
];

export const crecTasks = [
  // NUEVOS CONVENIOS INSTITUCIONALES
  { id: 'cr1', name: 'Contactos de referencia', status: 'En curso', startMonth: 0, endMonth: 11, category: 'NUEVOS CONVENIOS INSTITUCIONALES' },
  { id: 'cr2', name: 'Presentación institucional', status: 'En curso', startMonth: 0, endMonth: 11, category: 'NUEVOS CONVENIOS INSTITUCIONALES' },
  { id: 'cr3', name: 'Cierre de convenio', status: 'En curso', startMonth: 1, endMonth: 11, category: 'NUEVOS CONVENIOS INSTITUCIONALES' },
  { id: 'cr4', name: 'Lanzamiento', status: 'Pendiente', startMonth: 2, endMonth: 11, category: 'NUEVOS CONVENIOS INSTITUCIONALES' },

  // PROVINCIAS A TRABAJAR PRIMER SEMESTRE
  { id: 'cr5', name: 'Neuquén', status: 'En curso', startMonth: 1, endMonth: 3, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr6', name: 'CABA y GBA', status: 'Pendiente', startMonth: 2, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr7', name: 'Tucumán', status: 'Pendiente', startMonth: 3, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr8', name: 'Corrientes', status: 'Pendiente', startMonth: 2, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr9', name: 'Buenos Aires (interior)', status: 'En curso', startMonth: 1, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr10', name: 'Santa Cruz', status: 'Pendiente', startMonth: 4, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr11', name: 'Mendoza', status: 'Pendiente', startMonth: 4, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },
  { id: 'cr12', name: 'San Juan', status: 'Pendiente', startMonth: 4, endMonth: 5, category: 'PROVINCIAS A TRABAJAR PRIMER SEMESTRE' },

  // RED DE REFERENTES Y COLABORADORES
  { id: 'cr13', name: 'Análisis, relevamiento, investigación: posibles colab.', status: 'En curso', startMonth: 0, endMonth: 5, category: 'RED DE REFERENTES Y COLABORADORES' },
  { id: 'cr14', name: 'Comunicación, capacitación y líneas de trabajo', status: 'Pendiente', startMonth: 2, endMonth: 5, category: 'RED DE REFERENTES Y COLABORADORES' },
  { id: 'cr15', name: 'Análisis de nuevo programa de incentivos', status: 'Pendiente', startMonth: 4, endMonth: 6, category: 'RED DE REFERENTES Y COLABORADORES' },
  { id: 'cr16', name: 'Trabajo en red, seguimiento de acciones', status: 'Pendiente', startMonth: 4, endMonth: 11, category: 'RED DE REFERENTES Y COLABORADORES' },

  // DESARROLLO EQUIPO DE TRABAJO Y TAREAS
  { id: 'cr17', name: 'Trabajo con personal colaborativo y parcial', status: 'En curso', startMonth: 0, endMonth: 3, category: 'DESARROLLO EQUIPO DE TRABAJO Y TAREAS' },
  { id: 'cr18', name: 'Equipo definido Capacitación y Asignación roles y tareas', status: 'Pendiente', startMonth: 4, endMonth: 6, category: 'DESARROLLO EQUIPO DE TRABAJO Y TAREAS' },

  // FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS
  { id: 'cr19', name: 'Relevamiento de segmentos e índices a analizar', status: 'En curso', startMonth: 0, endMonth: 1, category: 'FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS' },
  { id: 'cr20', name: 'Análisis de uso y permanencia por segmento', status: 'Pendiente', startMonth: 2, endMonth: 3, category: 'FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS' },
  { id: 'cr21', name: 'Informe de conclusiones y propuestas de servicios', status: 'Pendiente', startMonth: 4, endMonth: 4, category: 'FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS' },
  { id: 'cr22', name: 'Propuestas de comunicación y acciones de fidelización', status: 'Pendiente', startMonth: 5, endMonth: 5, category: 'FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS' },

  // ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA
  { id: 'cr23', name: 'Análisis de renuncias, por motivos, y otros segmentos', status: 'En curso', startMonth: 1, endMonth: 11, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA', note: 'Bimestral' },
  { id: 'cr24', name: 'Informe trimestral de resultados crecimiento', status: 'Pendiente', startMonth: 2, endMonth: 11, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA', note: 'Trimestral' },
  { id: 'cr25', name: 'Desarrollo de presentación institucional virtual', status: 'En curso', startMonth: 1, endMonth: 11, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA', note: 'Cuatrimestre' },
  { id: 'cr26', name: 'Evaluación desempeño 2026', status: 'Pendiente', startMonth: 11, endMonth: 11, category: 'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA' },

  // PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL
  { id: 'cr27', name: 'Visitas promocionales a institucionales CABA y PBA', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'cr28', name: 'Viajes Interior del país', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'cr29', name: 'Realización de nuevos convenios', status: 'En curso', startMonth: 1, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'cr30', name: 'Informes mensuales de acciones, avances, y resultados', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
  { id: 'cr31', name: 'Contactos referentes y colaboradores', status: 'En curso', startMonth: 0, endMonth: 11, category: 'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL' },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'NUEVOS CONVENIOS INSTITUCIONALES': '#FDBA74',
  'PROVINCIAS A TRABAJAR PRIMER SEMESTRE': '#93C5FD',
  'RED DE REFERENTES Y COLABORADORES': '#FED7AA',
  'DESARROLLO EQUIPO DE TRABAJO Y TAREAS': '#7DD3FC',
  'FIDELIZACIÓN Y ANÁLISIS DE BASE DE DATOS': '#FDBA74',
  'ANÁLISIS Y PROYECTOS DE EJECUCIÓN DIRECTA': '#93C5FD',
  'PLANIFICACIÓN OPERATIVA GENERAL - MENSUAL': '#FED7AA',
};

export function getCrecStatus(task, currentMonth) {
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