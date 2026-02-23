import { useState, useEffect } from 'react';
import { fetchAllActivities, fetchDepartmentsMetadata } from '../services/api';
import { calculateSemaforo, semaforoToStatus, isActiveThisMonth } from '../utils/semaforoUtils';

/* ── Map manualStatus → semáforo color ── */
const MANUAL_STATUS_TO_SEM = {
  'Realizado': 'green',
  'En Curso': 'yellow',
  'Pendiente': 'green',
  'Atrasado': 'red',
  'No Realizado': 'red',
};

/**
 * Hook that builds `departmentSections` from the backend API,
 * mirroring the structure that was previously built statically
 * in tasksData.js from local data files.
 *
 * Returns:
 *   - departmentSections: array identical in shape to the old static export
 *   - allDeptNames: convenience array of department names
 *   - loading: boolean
 *   - error: string | null
 */
export default function useDashboardData() {
  const [departmentSections, setDepartmentSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Fetch departments and activities in parallel
        const [departments, activities] = await Promise.all([
          fetchDepartmentsMetadata(),
          fetchAllActivities(),
        ]);

        if (cancelled) return;

        // Build global manualStatus overrides map from ALL activities
        // so every task's effective semaforo is correct from the start,
        // without waiting for TaskContext to load from localStorage.
        const manualOverrides = {};
        activities.forEach((act) => {
          if (act.manualStatus) {
            manualOverrides[act.id] = act.manualStatus;
          }
        });

        // Group activities by department name
        const activitiesByDept = {};
        activities.forEach((act) => {
          if (!activitiesByDept[act.department]) {
            activitiesByDept[act.department] = [];
          }
          activitiesByDept[act.department].push(act);
        });

        // Build departmentSections (same shape as the old static export)
        const CURRENT_MONTH = new Date().getMonth();

        const sections = departments.map((dept) => {
          const deptActivities = activitiesByDept[dept.name] || [];

          const activeTasks = deptActivities
            .filter((t) => {
              // Include tasks active this month
              if (isActiveThisMonth(t)) return true;
              // Also include overdue tasks (past endMonth, not realized)
              // so "Atrasadas" count is accurate on Dashboard & Reportes
              const end = Array.isArray(t.months) && t.months.length > 0
                ? Math.max(...t.months)
                : t.endMonth;
              if (end != null && end < CURRENT_MONTH && t.manualStatus !== 'Realizado') {
                return true;
              }
              return false;
            })
            .map((task) => {
              const autoSemaforo = calculateSemaforo(task, CURRENT_MONTH);

              // Apply manualStatus override directly from API data
              // This mirrors getDeptStatus logic from TaskContext, but
              // doesn't depend on localStorage/deptOverrides being ready.
              let semaforo = autoSemaforo;
              const override = manualOverrides[task.id];
              if (override) {
                if (autoSemaforo === 'red' && override !== 'Realizado') {
                  semaforo = 'red'; // Keep red if overdue and not completed
                } else {
                  semaforo = MANUAL_STATUS_TO_SEM[override] || autoSemaforo;
                }
              }
              // Derive startMonth/endMonth from months[] for Mantenimiento/Consumo
              let { startMonth, endMonth } = task;
              if ((startMonth == null || endMonth == null) && Array.isArray(task.months) && task.months.length > 0) {
                startMonth = Math.min(...task.months);
                endMonth = Math.max(...task.months);
              }
              return {
                ...task,
                startMonth,
                endMonth,
                semaforo,
                status: semaforoToStatus(semaforo),
                category: task.category || '',
              };
            });

          return {
            name: dept.name,
            coordinator: dept.coordinator,
            color: dept.color,
            icon: dept.icon,
            tasks: activeTasks,
            totalTasks: deptActivities.length,
          };
        });

        setDepartmentSections(sections);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error('Error cargando datos del dashboard:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const allDeptNames = departmentSections.map((d) => d.name);

  return { departmentSections, allDeptNames, loading, error };
}
