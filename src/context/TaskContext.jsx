import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAllActivities, fetchDepartmentsMetadata, updateActivityStatus, createNewActivity, deleteActivityById } from '../services/api';
import { useAuth } from './AuthContext';
import { STATUS, STATUS_CONFIG, calculateSemaforo, semaforoToStatus, isActiveThisMonth } from '../utils/semaforoUtils';

const TaskContext = createContext(null);

const STORAGE_KEY = 'semaforo-tasks';
const DEPT_OVERRIDES_KEY = 'semaforo-dept-overrides';

/* ── Status cycle order for department Gantt clicks ── */
const DEPT_STATUS_ORDER = [
    STATUS.REALIZADO,
    STATUS.EN_CURSO,
    STATUS.PENDIENTE,
    STATUS.ATRASADO,
    STATUS.NO_REALIZADO,
];

/* ── Map manual status → semáforo color key ── */
const STATUS_TO_SEMAFORO = {
    [STATUS.REALIZADO]: 'green',
    [STATUS.EN_CURSO]: 'yellow',
    [STATUS.PENDIENTE]: 'yellow',
    [STATUS.ATRASADO]: 'red',
    [STATUS.NO_REALIZADO]: 'red',
};

const DEPT_SEMAFORO_COLORS = {
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
};

const DEPT_SEMAFORO_LABELS = {
    green: 'Realizado',
    yellow: 'A tiempo',
    red: 'Atrasado',
};

/**
 * Build initialTasks from API data (departments + activities).
 * Mirrors the old static export from tasksData.js.
 * Also returns initial dept overrides from manualStatus in the API data.
 */
function buildInitialTasks(departments, activities) {
    const CURRENT_MONTH = new Date().getMonth();

    // Group activities by department
    const activitiesByDept = {};
    activities.forEach((act) => {
        if (!activitiesByDept[act.department]) {
            activitiesByDept[act.department] = [];
        }
        activitiesByDept[act.department].push(act);
    });

    let _id = 1;
    const tasks = [];
    const apiOverrides = {};

    departments.forEach((dept) => {
        const deptActivities = activitiesByDept[dept.name] || [];
        const activeTasks = deptActivities.filter(isActiveThisMonth);

        activeTasks.forEach((t) => {
            const semaforo = calculateSemaforo(t, CURRENT_MONTH);
            const estado = t.manualStatus || semaforoToStatus(semaforo);
            tasks.push({
                id: _id++,
                actividad: t.name,
                responsable: dept.coordinator,
                departamento: dept.name,
                deptColor: dept.color,
                fechaInicio: `2026-${String(CURRENT_MONTH + 1).padStart(2, '0')}-01`,
                fechaFin: `2026-${String(CURRENT_MONTH + 1).padStart(2, '0')}-28`,
                estado,
                originalId: t.id,
            });

            // Build overrides map from manualStatus
            if (t.manualStatus) {
                apiOverrides[t.id] = t.manualStatus;
            }
        });
    });

    return { tasks, apiOverrides };
}

function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        /* ignore parse errors */
    }
    return [];  // Start empty, will be populated from API
}

function loadDeptOverrides() {
    try {
        const stored = localStorage.getItem(DEPT_OVERRIDES_KEY);
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return {};
}

export function TaskProvider({ children }) {
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isCoordinator = user?.role === 'coordinator';
    const canCreate = isAdmin || isCoordinator;
    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [deptOverrides, setDeptOverrides] = useState(loadDeptOverrides);

    // Reusable function to load tasks from API
    const refreshTasks = useCallback(async () => {
        try {
            const [departments, activities] = await Promise.all([
                fetchDepartmentsMetadata(),
                fetchAllActivities(),
            ]);
            const { tasks: apiTasks, apiOverrides } = buildInitialTasks(departments, activities);
            setTasks(apiTasks);
            // Build overrides from ALL activities (not just isActiveThisMonth)
            // so every dept task's manualStatus is up-to-date from the API.
            const allOverrides = {};
            activities.forEach((act) => {
                if (act.manualStatus) {
                    allOverrides[act.id] = act.manualStatus;
                }
            });
            setDeptOverrides(allOverrides);
        } catch (err) {
            console.error('Error cargando tareas desde el API:', err);
            const cached = loadTasks();
            if (cached.length > 0) setTasks(cached);
        }
    }, []);

    // Always load tasks from API on mount
    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    // Persist dashboard tasks
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks]);

    // Persist department overrides
    useEffect(() => {
        localStorage.setItem(DEPT_OVERRIDES_KEY, JSON.stringify(deptOverrides));
    }, [deptOverrides]);

    // Helper to persist status to Firestore (admin only, fire-and-forget)
    const persistStatus = useCallback((originalId, manualStatus, observation) => {
        if (!isAdmin || !token) return;
        updateActivityStatus(originalId, manualStatus, token, observation).catch((err) =>
            console.error('Error persistiendo estado:', err)
        );
    }, [isAdmin, token]);

    /* ── Observation prompt state for status changes ── */
    const [pendingObservation, setPendingObservation] = useState(null);
    // pendingObservation = { type: 'dashboard'|'dept', taskId, taskName, currentStatus }

    const confirmObservation = useCallback((selectedStatus, observationText) => {
        if (!pendingObservation) return;
        const { type, taskId } = pendingObservation;

        if (type === 'dashboard') {
            const task = tasks.find((t) => t.id === taskId);
            if (task?.originalId) {
                persistStatus(task.originalId, selectedStatus, observationText);
            }
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, estado: selectedStatus } : t))
            );
        } else if (type === 'dept') {
            persistStatus(taskId, selectedStatus, observationText);
            setDeptOverrides((prev) => ({ ...prev, [taskId]: selectedStatus }));
        }

        setPendingObservation(null);
    }, [pendingObservation, persistStatus, tasks]);

    const cancelObservation = useCallback(() => {
        setPendingObservation(null);
    }, []);

    const updateTaskStatus = useCallback((taskId, newStatus) => {
        if (!isAdmin) return;  // Coordinators cannot change status

        // If changing to Atrasado or No Realizado, require observation
        if (newStatus === 'Atrasado' || newStatus === 'No Realizado') {
            const task = tasks.find((t) => t.id === taskId);
            setPendingObservation({ type: 'dashboard', taskId, status: newStatus, taskName: task?.actividad || '' });
            return;
        }

        setTasks((prev) => {
            const task = prev.find((t) => t.id === taskId);
            if (task?.originalId) {
                persistStatus(task.originalId, newStatus);
            }
            return prev.map((t) => (t.id === taskId ? { ...t, estado: newStatus } : t));
        });
    }, [persistStatus, isAdmin, tasks]);

    const cycleStatus = useCallback((taskId) => {
        if (!isAdmin) return;
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        setPendingObservation({ type: 'dashboard', taskId, taskName: task.actividad || '', currentStatus: task.estado });
    }, [isAdmin, tasks]);

    /* ── Department Gantt override functions ── */

    // Get effective semáforo for a dept task (override wins over auto)
    // AUTO-ATRASADO: if auto-calc says 'red' (overdue) and manual status
    // is NOT 'Realizado', force red — so overdue tasks can't stay green/yellow.
    const getDeptStatus = useCallback((taskId, autoSemaforo) => {
        const override = deptOverrides[taskId];
        if (override) {
            if (autoSemaforo === 'red' && override !== 'Realizado') {
                return 'red';
            }
            return STATUS_TO_SEMAFORO[override];
        }
        return autoSemaforo;
    }, [deptOverrides]);

    // Set a specific manual status for a dept task
    const setDeptTaskStatus = useCallback((taskId, newStatus) => {
        if (!isAdmin) return;  // Coordinators cannot change status
        setDeptOverrides((prev) => ({ ...prev, [taskId]: newStatus }));
        persistStatus(taskId, newStatus);
    }, [persistStatus, isAdmin]);

    // Open status change modal on click (no more auto-cycling)
    const cycleDeptStatus = useCallback((taskId, currentAutoSemaforo, taskName) => {
        if (!isAdmin) return;
        const currentOverride = deptOverrides[taskId];
        let currentStatus;
        if (currentOverride) {
            currentStatus = currentOverride;
        } else {
            const semToStatus = { green: STATUS.REALIZADO, blue: STATUS.EN_CURSO, yellow: STATUS.PENDIENTE, red: STATUS.ATRASADO, gray: STATUS.NO_REALIZADO };
            currentStatus = semToStatus[currentAutoSemaforo] || STATUS.PENDIENTE;
        }
        setPendingObservation({ type: 'dept', taskId, taskName: taskName || '', currentStatus });
    }, [isAdmin, deptOverrides]);

    // Clear override (revert to auto)
    const clearDeptOverride = useCallback((taskId) => {
        setDeptOverrides((prev) => {
            const next = { ...prev };
            delete next[taskId];
            return next;
        });
    }, []);

    // Create a new task (admin + coordinator)
    const createTask = useCallback(async (activityData) => {
        if (!canCreate || !token) throw new Error('No tienes permisos para crear tareas');
        const result = await createNewActivity(activityData, token);
        await refreshTasks();
        return result;
    }, [canCreate, token, refreshTasks]);

    // Delete a task (admin only)
    const deleteTask = useCallback(async (activityId) => {
        if (!isAdmin || !token) throw new Error('Solo el admin puede eliminar tareas');
        const result = await deleteActivityById(activityId, token);
        await refreshTasks();
        return result;
    }, [isAdmin, token, refreshTasks]);

    const clearFilters = useCallback(() => {
        setActiveFilter(null);
        setSearchQuery('');
    }, []);

    const handleSort = useCallback((key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    // Computed: filtered & sorted tasks
    const filteredTasks = (() => {
        let result = [...tasks];

        if (activeFilter) {
            result = result.filter((t) => t.estado === activeFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.actividad.toLowerCase().includes(q) ||
                    t.responsable.toLowerCase().includes(q) ||
                    (t.departamento && t.departamento.toLowerCase().includes(q))
            );
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    })();

    // Status counts
    const statusCounts = tasks.reduce((acc, t) => {
        acc[t.estado] = (acc[t.estado] || 0) + 1;
        return acc;
    }, {});

    const value = {
        tasks,
        filteredTasks,
        statusCounts,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        sortConfig,
        handleSort,
        updateTaskStatus,
        cycleStatus,
        clearFilters,
        isAdmin,
        isCoordinator,
        canCreate,
        createTask,
        deleteTask,
        refreshTasks,
        // Department overrides
        getDeptStatus,
        setDeptTaskStatus,
        cycleDeptStatus,
        clearDeptOverride,
        deptOverrides,
        DEPT_SEMAFORO_COLORS,
        DEPT_SEMAFORO_LABELS,
        // Observation prompt
        pendingObservation,
        confirmObservation,
        cancelObservation,
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTasks must be used within TaskProvider');
    return ctx;
}

// Re-export for convenience
export { DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS };
