import { useState, useRef, useEffect } from 'react';
import { FiChevronUp, FiChevronDown, FiMoreVertical, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTasks } from '../../context/TaskContext';
import { STATUS, STATUS_CONFIG } from '../../utils/semaforoUtils';
import StatusBadge from '../StatusBadge/StatusBadge';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import './TaskTable.css';

function StatusDropdown({ taskId, currentStatus, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const { updateTaskStatus } = useTasks();

    return (
        <div className="status-dropdown" ref={ref}>
            {Object.values(STATUS).map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                    <button
                        key={status}
                        className={`status-dropdown__item ${status === currentStatus ? 'status-dropdown__item--current' : ''}`}
                        onClick={() => {
                            updateTaskStatus(taskId, status);
                            onClose();
                        }}
                    >
                        <span
                            className="status-dropdown__dot"
                            style={{ background: config.color }}
                        />
                        <span>{config.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

/* ── Delete confirmation dialog ── */
function DeleteConfirmDialog({ taskName, onConfirm, onCancel, loading }) {
    return (
        <div className="delete-confirm-overlay" onClick={onCancel}>
            <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
                <div className="delete-confirm__icon">🗑️</div>
                <h3 className="delete-confirm__title">¿Eliminar actividad?</h3>
                <p className="delete-confirm__text">
                    Estás a punto de eliminar <strong>"{taskName}"</strong>.
                    Esta acción no se puede deshacer.
                </p>
                <div className="delete-confirm__actions">
                    <button
                        className="delete-confirm__btn delete-confirm__btn--cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="delete-confirm__btn delete-confirm__btn--delete"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const columns = [
    { key: 'id', label: '#', sortable: true },
    { key: 'departamento', label: 'Departamento', sortable: true },
    { key: 'actividad', label: 'Actividad', sortable: true },
    { key: 'responsable', label: 'Coordinador', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true },
    { key: 'accion', label: 'Acción', sortable: false },
];

export default function TaskTable() {
    const { filteredTasks, sortConfig, handleSort, isAdmin, canCreate, createTask, deleteTask } = useTasks();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { originalId, name }
    const [deleteLoading, setDeleteLoading] = useState(false);

    const showActionsColumn = isAdmin || canCreate;

    const visibleColumns = showActionsColumn
        ? columns
        : columns.filter((c) => c.key !== 'accion');

    const handleCreate = async (activityData) => {
        await createTask(activityData);
    };

    const handleDeleteClick = (task) => {
        setDeleteTarget({ originalId: task.originalId, name: task.actividad });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteTask(deleteTarget.originalId);
            setDeleteTarget(null);
        } catch (err) {
            console.error('Error al eliminar:', err);
            alert(err.message || 'Error al eliminar la actividad');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            {/* Header with create button */}
            {canCreate && (
                <div className="task-table-header">
                    <button
                        className="task-table-header__create-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FiPlus /> Nueva Tarea
                    </button>
                </div>
            )}

            <div className="task-table-wrapper">
                <table className="task-table">
                    <thead>
                        <tr>
                            {visibleColumns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`task-table__th ${col.sortable ? 'task-table__th--sortable' : ''}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <span className="task-table__th-content">
                                        {col.label}
                                        {col.sortable && sortConfig.key === col.key && (
                                            <span className="task-table__sort-icon">
                                                {sortConfig.direction === 'asc' ? (
                                                    <FiChevronUp />
                                                ) : (
                                                    <FiChevronDown />
                                                )}
                                            </span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={visibleColumns.length} className="task-table__empty">
                                    <div className="task-table__empty-content">
                                        <span className="task-table__empty-icon">🔍</span>
                                        <p>No se encontraron actividades</p>
                                        <p className="task-table__empty-hint">Intenta ajustar los filtros</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map((task, index) => (
                                <tr
                                    key={task.id}
                                    className="task-table__row"
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <td className="task-table__td task-table__td--id">
                                        {task.id}
                                    </td>
                                    <td className="task-table__td task-table__td--dept">
                                        <span
                                            className="task-table__dept-dot"
                                            style={{ background: task.deptColor || '#64748b' }}
                                        />
                                        <span className="task-table__dept-name">{task.departamento}</span>
                                    </td>
                                    <td className="task-table__td task-table__td--actividad">
                                        {task.actividad}
                                    </td>
                                    <td className="task-table__td task-table__td--responsable">
                                        <div className="task-table__avatar">
                                            {task.responsable
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .slice(0, 2)}
                                        </div>
                                        <span>{task.responsable}</span>
                                    </td>
                                    <td className="task-table__td">
                                        <StatusBadge status={task.estado} />
                                    </td>
                                    {showActionsColumn && (
                                        <td className="task-table__td task-table__td--action">
                                            <div className="task-table__action-wrapper">
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            className="task-table__action-btn"
                                                            onClick={() =>
                                                                setOpenDropdown(openDropdown === task.id ? null : task.id)
                                                            }
                                                            aria-label="Cambiar estado"
                                                        >
                                                            <FiMoreVertical />
                                                        </button>
                                                        <button
                                                            className="task-table__action-btn task-table__action-btn--delete"
                                                            onClick={() => handleDeleteClick(task)}
                                                            aria-label="Eliminar tarea"
                                                            title="Eliminar tarea"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </>
                                                )}
                                                {openDropdown === task.id && (
                                                    <StatusDropdown
                                                        taskId={task.id}
                                                        currentStatus={task.estado}
                                                        onClose={() => setOpenDropdown(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create modal */}
            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreate}
            />

            {/* Delete confirmation */}
            {deleteTarget && (
                <DeleteConfirmDialog
                    taskName={deleteTarget.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}
        </>
    );
}
