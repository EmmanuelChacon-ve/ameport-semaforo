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
            .filter(isActiveThisMonth)
            .map((task) => {
              const semaforo = calculateSemaforo(task, CURRENT_MONTH);
              return {
                ...task,
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
