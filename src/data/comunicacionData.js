/* export const comCategories = [
  'Rebranding',
  'Captación Nuevos Asociados (MERCADO ABIERTO)',
  'Sitio Web',
  'Servicios de salud (Hola René)',
  'Descuentos (Viví Ameport)',
  'Programa de Fidelización - PUNTOS',
  'Comunicación, Fidelización & engagement - ASOCIADOS (parte 1)',
  'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT',
  'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)',
  'Otras Acciones',
  'Medición y toma de decisiones (Interacción de Asociados con Sitio WEB)',
  'Sorteos',
  'Centro de Atención Telefónica',
];

export const comTasks = [
  // Rebranding
  { id: 'c1', name: 'Rediseño de un Brief (análisis, objetivos, investigación de mercado)', status: 'En curso', startMonth: 0, endMonth: 1, category: 'Rebranding' },
  { id: 'c2', name: 'Desarrollo y presentación de nueva identidad', status: 'En curso', startMonth: 0, endMonth: 1, category: 'Rebranding' },
  { id: 'c3', name: 'Aprobación', status: 'Pendiente', startMonth: 0, endMonth: 1, category: 'Rebranding' },
  { id: 'c4', name: 'Implementación en Gráfica Institucional', status: 'Pendiente', startMonth: 2, endMonth: 3, category: 'Rebranding' },
  { id: 'c5', name: 'Lanzamiento y Comunicación', status: 'Pendiente', startMonth: 3, endMonth: 3, category: 'Rebranding' },

  // Captación Nuevos Asociados
  { id: 'c6', name: 'Campañas referidos SOCIO + SOCIO', status: 'Pendiente', startMonth: 2, endMonth: 11, category: 'Captación Nuevos Asociados (MERCADO ABIERTO)' },
  { id: 'c7', name: 'Anuncios en Meta: ayudas eco, turismo, art. del hogar, salud', status: 'Pendiente', startMonth: 2, endMonth: 11, category: 'Captación Nuevos Asociados (MERCADO ABIERTO)' },
  { id: 'c8', name: 'Comunicación: evaluar medios para llegar a mercado abierto', status: 'Pendiente', startMonth: 1, endMonth: 1, category: 'Captación Nuevos Asociados (MERCADO ABIERTO)' },

  // Sitio Web
  { id: 'c9', name: 'E-commerce Artículos del Hogar', status: 'En curso', startMonth: 1, endMonth: 2, category: 'Sitio Web' },
  { id: 'c10', name: 'Actualizaciones del sitio WEB', status: 'En curso', startMonth: 2, endMonth: 11, category: 'Sitio Web' },
  { id: 'c11', name: 'Rediseño de secciones del sitio', status: 'Pendiente', startMonth: 1, endMonth: 10, category: 'Sitio Web', note: 'NUEVO SITIO' },
  { id: 'c12', name: 'Incorporación de Sección "Experiencias"', status: 'Pendiente', startMonth: 3, endMonth: 3, category: 'Sitio Web' },
  { id: 'c13', name: 'Incorporación de Sección "Charlas TED"', status: 'Pendiente', startMonth: 4, endMonth: 4, category: 'Sitio Web' },
  { id: 'c14', name: 'Incorporación de Sección "Socios que Transforman"', status: 'Pendiente', startMonth: 2, endMonth: 2, category: 'Sitio Web' },
  { id: 'c15', name: 'Rediseño Web (Desarrollo Propio)', status: 'En curso', startMonth: 2, endMonth: 11, category: 'Sitio Web', note: 'LANZAMIENTO' },
  { id: 'c16', name: 'Plataforma Digital del Asociado (Desarrollo e Implementación)', status: 'En curso', startMonth: 2, endMonth: 11, category: 'Sitio Web', note: 'LANZAMIENTO' },

  // Servicios de salud (Hola René)
  { id: 'c19', name: 'Extender a toda la cartera - por etapas (Iniciamos OMINT)', status: 'En curso', startMonth: 0, endMonth: 1, category: 'Servicios de salud (Hola René)' },
  { id: 'c20', name: 'Evaluación de Comportamiento', status: 'Pendiente', startMonth: 2, endMonth: 2, category: 'Servicios de salud (Hola René)' },
  { id: 'c21', name: 'Actualización de plan de acción', status: 'Pendiente', startMonth: 3, endMonth: 11, category: 'Servicios de salud (Hola René)' },
  { id: 'c22', name: 'Actualización de Altas y Bajas', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Servicios de salud (Hola René)' },

  // Descuentos (Viví Ameport)
  { id: 'c23', name: 'Ampliar el servicio incorporando cupones en primeras marcas (Bonda)', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Descuentos (Viví Ameport)' },
  { id: 'c24', name: 'Beneficios especiales personalizados para socios', status: 'Pendiente', startMonth: 2, endMonth: 11, category: 'Descuentos (Viví Ameport)' },

  // Programa de Fidelización - PUNTOS
  { id: 'c26', name: 'Desarrollar un ecosistema de recompensas integrando todos los servicios', status: 'Pendiente', startMonth: 8, endMonth: 8, category: 'Programa de Fidelización - PUNTOS' },

  // Comunicación parte 1
  { id: 'c27', name: 'Comunicación: evaluar medios para llegar mejor a los socios', status: 'Pendiente', startMonth: 1, endMonth: 1, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 1)' },
  { id: 'c28', name: 'Personalizar la comunicación / segmentación por comportamiento', status: 'Pendiente', startMonth: 1, endMonth: 1, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 1)' },
  { id: 'c29', name: 'Publicación de Anuncios personalizados', status: 'Pendiente', startMonth: 2, endMonth: 11, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 1)' },

  // Redes Sociales / WhatsApp / Email / PUSH
  { id: 'c30', name: 'Posicionamiento y generación de contenidos por todos los medios', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c31', name: 'Ofertas Semanales', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c32', name: 'Campañas de Turismo (Nacional e Internacional)', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c33', name: 'Campañas de Turismo de Temporada y Fines Largos', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c34', name: 'Ayudas Escolar Web (Implementación y Publicidad)', status: 'Pendiente', startMonth: 1, endMonth: 2, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c35', name: 'Promoción Charlas TED', status: 'Pendiente', startMonth: 8, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c36', name: 'Canal de Youtube (Implementación + Web)', status: 'Pendiente', startMonth: 2, endMonth: 2, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c37', name: 'Acciones promocionales en viajes (Área de Crecimiento)', status: 'Ocasional', startMonth: 0, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },
  { id: 'c38', name: 'Campañas de Convocatoria Papá Noel AMEPORT', status: 'Pendiente', startMonth: 11, endMonth: 11, category: 'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT' },

  // Comunicación parte 2
  { id: 'c39', name: 'Rebranding: Imposición de la nueva marca', status: 'Pendiente', startMonth: 3, endMonth: 5, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },
  { id: 'c40', name: 'MUNDIAL: Precalentá para el Mundial', status: 'Pendiente', startMonth: 4, endMonth: 4, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },
  { id: 'c41', name: 'MUNDIAL: Prode del Mundial', status: 'Pendiente', startMonth: 5, endMonth: 6, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },
  { id: 'c42', name: 'VIVIAMEPORT: Mes de comienzo de Clases (Vuelta al cole)', status: 'Pendiente', startMonth: 1, endMonth: 1, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },
  { id: 'c43', name: 'VIVIAMEPORT: Mes de la Madre (Madres que inspiran)', status: 'Pendiente', startMonth: 9, endMonth: 9, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },
  { id: 'c44', name: 'VIVIAMEPORT: Mes de Fiestas (Felices Fiestas)', status: 'Pendiente', startMonth: 11, endMonth: 11, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },
  { id: 'c45', name: 'Campaña de Actualización de Datos', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)' },

  // Otras Acciones
  { id: 'c46', name: 'Acciones Lúdicas (a cerrar con FULL)', status: 'Pendiente', startMonth: 5, endMonth: 5, category: 'Otras Acciones' },
  { id: 'c47', name: 'Incorporación de Inteligencia Artificial al CRM', status: 'Pendiente', startMonth: 4, endMonth: 4, category: 'Otras Acciones' },
  { id: 'c48', name: 'Capacitaciones (Introducción de Nuevos Empleados)', status: 'Ocasional', startMonth: 0, endMonth: 11, category: 'Otras Acciones' },
  { id: 'c49', name: 'Cambio de Roles (Capacitación)', status: 'En curso', startMonth: 0, endMonth: 2, category: 'Otras Acciones' },
  { id: 'c50', name: 'Cambio de Roles (Implementación)', status: 'Pendiente', startMonth: 3, endMonth: 6, category: 'Otras Acciones' },
  { id: 'c51', name: 'Comunicaciones Internas', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Otras Acciones' },
  { id: 'c52', name: 'Comunicaciones con Referentes', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Otras Acciones' },
  { id: 'c53', name: 'Capacitación de Referentes', status: 'Pendiente', startMonth: 5, endMonth: 6, category: 'Otras Acciones' },
  { id: 'c54', name: 'Diseño de Balance y Memoria (Manual y Vídeo)', status: 'Pendiente', startMonth: 7, endMonth: 8, category: 'Otras Acciones' },

  // Medición y toma de decisiones
  { id: 'c55', name: 'Ampliación tablero de métricas: Art. Del Hogar', status: 'En curso', startMonth: 0, endMonth: 1, category: 'Medición y toma de decisiones (Interacción de Asociados con Sitio WEB)' },
  { id: 'c56', name: 'Ampliación tablero de métricas: Turismo', status: 'En curso', startMonth: 1, endMonth: 1, category: 'Medición y toma de decisiones (Interacción de Asociados con Sitio WEB)' },
  { id: 'c57', name: 'Análisis y segmentación de la cartera por comportamiento - acciones', status: 'Pendiente', startMonth: 6, endMonth: 6, category: 'Medición y toma de decisiones (Interacción de Asociados con Sitio WEB)' },

  // Sorteos
  { id: 'c58', name: 'Sorteo Mensual', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Sorteos' },
  { id: 'c59', name: 'Sorteo Anual', status: 'Pendiente', startMonth: 11, endMonth: 11, category: 'Sorteos' },
  { id: 'c60', name: 'Sorteo Día del Niño (Promoción, realización y entrega de premios)', status: 'Pendiente', startMonth: 6, endMonth: 7, category: 'Sorteos' },

  // Centro de Atención Telefónica
  { id: 'c61', name: 'Actualización de información para Operadores', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Centro de Atención Telefónica' },
  { id: 'c62', name: 'Actualización del ChatBot', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Centro de Atención Telefónica' },
  { id: 'c63', name: 'Presentación de Informe de Consultas (Telefónicas y WhatsApp)', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Centro de Atención Telefónica' },
  { id: 'c64', name: 'Escucha Activa de Llamados', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Centro de Atención Telefónica' },
  { id: 'c65', name: 'Rotación de Actividades', status: 'En curso', startMonth: 0, endMonth: 11, category: 'Centro de Atención Telefónica' },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'Rebranding': '#C084FC',
  'Captación Nuevos Asociados (MERCADO ABIERTO)': '#93C5FD',
  'Sitio Web': '#4ADE80',
  'Servicios de salud (Hola René)': '#FCA5A5',
  'Descuentos (Viví Ameport)': '#FBBF24',
  'Programa de Fidelización - PUNTOS': '#A78BFA',
  'Comunicación, Fidelización & engagement - ASOCIADOS (parte 1)': '#F472B6',
  'Redes Sociales / Canal de WhatsApp / Email MKT / PUSH MKT': '#60A5FA',
  'Comunicación, Fidelización & engagement - ASOCIADOS (parte 2)': '#FB923C',
  'Otras Acciones': '#2DD4BF',
  'Medición y toma de decisiones (Interacción de Asociados con Sitio WEB)': '#818CF8',
  'Sorteos': '#F87171',
  'Centro de Atención Telefónica': '#34D399',
};

export function getComStatus(task, currentMonth) {
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