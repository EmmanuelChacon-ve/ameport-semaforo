/* export const finCategories = [
  'Planificación Táctica',
  'Planificación Operativa - Área Contable',
  'Planificación Operativa - Área Tesorería',
  'Planificación Operativa - Área Altas y Cobranzas',
];

export const finTasks = [
  // PLANIFICACIÓN TÁCTICA
  { id: 'fin1', name: 'PRUEBAS e IMPLEMENTACIÓN NUEVO SISTEMA OPERATIVO MUTUAL - EVOL', startMonth: 0, endMonth: 4, category: 'Planificación Táctica' },
  { id: 'fin2', name: 'RELEVAMIENTO e IMPLEMENTACIÓN PRESUPUESTO FINANCIERO INTEGRAL - CONTINGENCIAS', startMonth: 1, endMonth: 4, category: 'Planificación Táctica' },
  { id: 'fin3', name: 'SEGUIMIENTO PRESUPUESTO FINANCIERO INTEGRAL', startMonth: 5, endMonth: 11, category: 'Planificación Táctica' },
  { id: 'fin4', name: 'ANÁLISIS VIABILIDAD SERVICIO GESTIÓN DE PRÉSTAMOS (Montos, Tasas, Plazos) AVANCE CONTRATO + PUESTA A LA FIRMA', startMonth: 1, endMonth: 3, category: 'Planificación Táctica' },
  { id: 'fin5', name: 'VIABILIDAD SERVICIO SCORES y MOTOR DE DECISIONES EMPRESA SISSA - AVANCE CONTRATO - PUESTA A LA FIRMA', startMonth: 0, endMonth: 0, category: 'Planificación Táctica' },
  { id: 'fin6', name: 'IMPLEMENTACIÓN TRANSFERENCIA POR CVU', startMonth: 0, endMonth: 3, category: 'Planificación Táctica' },
  { id: 'fin7', name: 'PROGRAMA DE AHORRO PLANIFICADO', startMonth: 2, endMonth: 4, category: 'Planificación Táctica' },
  { id: 'fin8', name: 'IMPLEMENTACIÓN ASESORAMIENTO IMPOSITIVOS A EMPRENDEDORES', startMonth: 3, endMonth: 4, category: 'Planificación Táctica' },
  { id: 'fin9', name: 'ASESORAMIENTO IMPOSITIVOS A EMPRENDEDORES', startMonth: 5, endMonth: 11, category: 'Planificación Táctica' },
  { id: 'fin10', name: 'ANÁLISIS DISPONIBILIDAD DE FONDOS PARA PROYECTO OBRA', startMonth: 3, endMonth: 11, category: 'Planificación Táctica' },

  // PLANIFICACIÓN OPERATIVA - ÁREA CONTABLE
  { id: 'fin11', name: 'Proceso Contable: recepción y control facturación, validez de la documentación. Registración de la factura', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin12', name: 'Conciliación bancaria', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin13', name: 'Generación de Órdenes de Pago', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin14', name: 'Control asientos diarios y cierre diario (cupones, caja, facturas)', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin15', name: 'Diversos reportes a AFCA (F8300, F744, F931)', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin16', name: 'Reportes al INAES: Art 9: Resolución 1418', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin17', name: 'Reportes Mensuales a la UIF', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin18', name: 'Asistencia y preparación papeles de trabajo y diversos requerimientos de Auditoría, Revisores de Cuenta y Tesorero', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin19', name: 'BALANCE ANUAL', startMonth: 5, endMonth: 9, category: 'Planificación Operativa - Área Contable' },
  { id: 'fin20', name: 'CUMPLIMIENTO NORMATIVAS UIF - anuales', startMonth: 2, endMonth: 7, category: 'Planificación Operativa - Área Contable' },

  // PLANIFICACIÓN OPERATIVA - ÁREA TESORERÍA
  { id: 'fin21', name: 'Cobranzas de servicios a los socios (cuotas social, Omint, S.A.E.)', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },
  { id: 'fin22', name: 'Cobranzas de Organismos y su posterior Conciliación con Área de Cobranzas y Contaduría', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },
  { id: 'fin23', name: 'Envío para aprobación de los lotes de los S.A.E. dinerarias', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },
  { id: 'fin24', name: 'Procesamiento de devoluciones', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },
  { id: 'fin25', name: 'Constitución, renovación y cancelación de Ahorros a Término', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },
  { id: 'fin26', name: 'Pago a Proveedores, Impuestos, y Servicio', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },
  { id: 'fin27', name: 'Generación Libro de Caja Entradas y Salidas', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Tesorería' },

  // PLANIFICACIÓN OPERATIVA - ÁREA ALTAS Y COBRANZAS
  { id: 'fin28', name: 'Envío de descuentos (por Planilla y Automáticos)', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Altas y Cobranzas' },
  { id: 'fin29', name: 'Cobranza - Carga de descuentos realizados (por organismos y débitos automáticos. Rapipago, pagosmiscuentas y link)', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Altas y Cobranzas' },
  { id: 'fin30', name: 'Impagas - Comunicación con los socios', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Altas y Cobranzas' },
  { id: 'fin31', name: 'Tareas varias; consultas de los socios (a través del BOT, correos electrónicos, llamados telefónicos); pruebas en el sistema EVOL', startMonth: 0, endMonth: 11, category: 'Planificación Operativa - Área Altas y Cobranzas' },
];

export const monthNames = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export const categoryColors = {
  'Planificación Táctica': '#60A5FA',
  'Planificación Operativa - Área Contable': '#34D399',
  'Planificación Operativa - Área Tesorería': '#FBBF24',
  'Planificación Operativa - Área Altas y Cobranzas': '#F472B6',
};

export function getFinStatus(task, currentMonth) {
  if (currentMonth < task.startMonth) return 'green';
  if (currentMonth >= task.startMonth && currentMonth <= task.endMonth) return 'green';
  if (currentMonth === task.endMonth + 1) return 'yellow';
  if (currentMonth > task.endMonth + 1) return 'red';
  return 'green';
}

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
 */