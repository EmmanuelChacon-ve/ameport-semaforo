import { useState, useEffect } from 'react';
import { fetchAllActivities, fetchDepartmentsMetadata } from '../services/api';
import { calculateSemaforo, semaforoToStatus, isActiveThisMonth } from '../utils/semaforoUtils';

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
              const semaforo = calculateSemaforo(task, CURRENT_MONTH);
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
