/* import { sistemasTasks, getSistemasStatus } from './sistemasData';
import { turismoTasks, getTurismoStatus } from './turismoData';
import { comTasks, getComStatus } from './comunicacionData';
import { finTasks, getFinStatus } from './finanzasData';
import { mantTasks, getMantStatus } from './mantenimientoData';
import { saludTasks, getSaludStatus } from './saludData';
import { crecTasks, getCrecStatus } from './crecimientoData';
import { consumoTasks, getConsumoStatus } from './consumoData';
import { gestionTasks, getGestionStatus } from './gestionData';

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

const CURRENT_MONTH = new Date().getMonth();

const monthLabels = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const currentMonthLabel = monthLabels[CURRENT_MONTH]; */

/* ── Map semáforo color → dashboard status ── */
/* function semaforoToStatus(sem) {
  switch (sem) {
    case 'green': return STATUS.REALIZADO;
    case 'yellow': return STATUS.EN_CURSO;
    case 'red': return STATUS.ATRASADO;
    default: return STATUS.PENDIENTE;
  }
}
 */
/* ── Check if a task is active in the current month ── */
/* function isActiveThisMonth(task) {
  if (Array.isArray(task.months)) {
    return task.months.includes(CURRENT_MONTH);
  }
  if (task.startMonth !== undefined && task.endMonth !== undefined) {
    return CURRENT_MONTH >= task.startMonth && CURRENT_MONTH <= task.endMonth;
  }
  return false;
} */

/* ── Department definitions ── */
/* const DEPARTMENTS_RAW = [
  { name: 'Sistemas',                 coordinator: 'Daniel',  color: '#3B82F6', icon: '💻', tasks: sistemasTasks,  getStatus: getSistemasStatus },
  { name: 'Turismo',                  coordinator: 'Pablo',   color: '#F97316', icon: '✈️', tasks: turismoTasks,   getStatus: getTurismoStatus },
  { name: 'Comunicación y Marketing', coordinator: 'Lucas',   color: '#EC4899', icon: '📢', tasks: comTasks,       getStatus: getComStatus },
  { name: 'Finanzas',                 coordinator: 'Miguel',  color: '#10B981', icon: '💰', tasks: finTasks,       getStatus: getFinStatus },
  { name: 'Mantenimiento',            coordinator: 'Felix',   color: '#8B5CF6', icon: '🔧', tasks: mantTasks,      getStatus: getMantStatus },
  { name: 'Salud y Recreación',       coordinator: 'Cristian', color: '#14B8A6', icon: '🏥', tasks: saludTasks,     getStatus: getSaludStatus },
  { name: 'Gestión de Asociados',     coordinator: 'Cristian', color: '#0EA5E9', icon: '👥', tasks: gestionTasks,   getStatus: getGestionStatus },
  { name: 'Crecimiento',              coordinator: 'Cristian', color: '#F59E0B', icon: '📈', tasks: crecTasks,      getStatus: getCrecStatus },
  { name: 'Consumo',                  coordinator: 'Ignacio', color: '#A855F7', icon: '🛒', tasks: consumoTasks,   getStatus: getConsumoStatus },
]; */

/* ── Build per-department data for Dashboard ── */
/* export const departmentSections = DEPARTMENTS_RAW.map((dept) => {
  const activeTasks = dept.tasks
    .filter(isActiveThisMonth)
    .map((task) => ({
      id: task.id,
      name: task.name,
      semaforo: dept.getStatus(task, CURRENT_MONTH),
      status: semaforoToStatus(dept.getStatus(task, CURRENT_MONTH)),
      category: task.category || '',
    }));

  return {
    name: dept.name,
    coordinator: dept.coordinator,
    color: dept.color,
    icon: dept.icon,
    tasks: activeTasks,
    totalTasks: dept.tasks.length,
  };
}); */

/* ── Flat list kept for TaskContext compatibility ── */
/* let _id = 1;
export const initialTasks = departmentSections.flatMap((dept) =>
  dept.tasks.map((t) => ({
    id: _id++,
    actividad: t.name,
    responsable: dept.coordinator,
    departamento: dept.name,
    deptColor: dept.color,
    fechaInicio: `2026-${String(CURRENT_MONTH + 1).padStart(2, '0')}-01`,
    fechaFin: `2026-${String(CURRENT_MONTH + 1).padStart(2, '0')}-28`,
    estado: t.status,
    originalId: t.id,
  }))
); */
