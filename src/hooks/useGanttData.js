import { useState, useEffect, useCallback } from 'react';
import { fetchActivities, fetchDepartmentsMetadata } from '../services/api';
import { calculateSemaforo } from '../utils/semaforoUtils';

/**
 * Hook that fetches activities + department metadata for a single department's Gantt chart.
 *
 * @param {string} departmentName — exact department name as stored in Firestore
 * @returns {{ tasks, categories, categoryColors, loading, error, refetch }}
 */
export default function useGanttData(departmentName) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryColors, setCategoryColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);

      const [activities, departments] = await Promise.all([
        fetchActivities(departmentName),
        fetchDepartmentsMetadata(),
      ]);

      // Find this department's metadata
      const dept = departments.find((d) => d.name === departmentName);

      if (dept) {
        setCategories(dept.categories || []);
        setCategoryColors(dept.categoryColors || {});
      }

      // Apply semaforo calculation
      const CURRENT_MONTH = new Date().getMonth();
      const withSemaforo = activities.map((t) => ({
        ...t,
        semaforo: calculateSemaforo(t, CURRENT_MONTH),
      }));

      setTasks(withSemaforo);
      setError(null);
    } catch (err) {
      console.error(`Error cargando datos de ${departmentName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [departmentName]);

  useEffect(() => {
    let cancelled = false;

    load(true).then(() => {
      if (cancelled) return;
    });

    return () => { cancelled = true; };
  }, [load]);

  // refetch without showing loading spinner
  const refetch = useCallback(() => load(false), [load]);

  return { tasks, categories, categoryColors, loading, error, refetch };
}
