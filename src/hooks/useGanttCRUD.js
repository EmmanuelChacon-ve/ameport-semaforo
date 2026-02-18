import { useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';

/**
 * Shared hook for Gantt CRUD operations (create + delete).
 * Handles modal/dialog state and calls TaskContext + refetch.
 *
 * @param {function} refetch — refetch function from useGanttData
 * @returns CRUD state & handlers
 */
export default function useGanttCRUD(refetch) {
    const { isAdmin, canCreate, createTask, deleteTask } = useTasks();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleCreate = useCallback(async (activityData) => {
        await createTask(activityData);
        await refetch();
    }, [createTask, refetch]);

    const handleDeleteClick = useCallback((task) => {
        setDeleteTarget({ id: task.id, name: task.name });
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteTask(deleteTarget.id);
            setDeleteTarget(null);
            await refetch();
        } catch (err) {
            console.error('Error al eliminar:', err);
            alert(err.message || 'Error al eliminar la actividad');
        } finally {
            setDeleteLoading(false);
        }
    }, [deleteTarget, deleteTask, refetch]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteTarget(null);
    }, []);

    return {
        isAdmin,
        canCreate,
        showCreateModal,
        setShowCreateModal,
        deleteTarget,
        deleteLoading,
        handleCreate,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
    };
}
