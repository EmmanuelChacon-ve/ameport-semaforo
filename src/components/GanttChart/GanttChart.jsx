import { useState, useMemo, Fragment } from 'react';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import { FiFilter, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import './GanttChart.css';

const statusColors = semaforoColors;
const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Sistemas';

export default function GanttChart() {
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const { getDeptStatus, cycleDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS } = useTasks();
    const { tasks: tasksRaw, categories, categoryColors, loading, refetch } = useGanttData(DEPT_NAME);
    const {
        isAdmin, canCreate,
        showCreateModal, setShowCreateModal,
        deleteTarget, deleteLoading,
        handleCreate, handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    } = useGanttCRUD(refetch);

    const tasksWithStatus = useMemo(
        () => tasksRaw.map((t) => ({ ...t, status: t.semaforo })),
        [tasksRaw]
    );

    const semaforoCounts = useMemo(() => {
        const c = { green: 0, yellow: 0, red: 0 };
        tasksWithStatus.forEach((t) => c[t.status]++);
        return c;
    }, [tasksWithStatus]);

    const categoryCounts = useMemo(() => {
        const c = {};
        categories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => { if (c[t.category] !== undefined) c[t.category]++; });
        return c;
    }, [tasksWithStatus, categories]);

    const filtered = useMemo(() => {
        let r = tasksWithStatus;
        if (semaforoFilter) r = r.filter((t) => t.status === semaforoFilter);
        if (categoryFilter) r = r.filter((t) => t.category === categoryFilter);
        return r;
    }, [tasksWithStatus, semaforoFilter, categoryFilter]);

    const grouped = useMemo(() => {
        const g = {};
        categories.forEach((c) => (g[c] = []));
        filtered.forEach((t) => { if (g[t.category]) g[t.category].push(t); });
        return g;
    }, [filtered, categories]);

    const hasFilters = semaforoFilter || categoryFilter;

    const toggleSemaforo = (status) => setSemaforoFilter((prev) => (prev === status ? null : status));

    if (loading) {
        return (
            <div className="gantt gantt--loading">
                <div className="gantt__spinner" />
                <p>Cargando actividades...</p>
            </div>
        );
    }

    return (
        <div className="gantt">
            {/* Filter bar */}
            <div className="gantt__filters">
                <div className="gantt__filters-row">
                    <div className="gantt__filters-left">
                        <FiFilter className="gantt__filter-icon" />
                        <span className="gantt__filter-label">Semáforo:</span>
                    </div>
                    <div className="gantt__filter-buttons">
                        {['green', 'yellow', 'red'].map((status) => (
                            <button
                                key={status}
                                className={`gantt__filter-btn ${semaforoFilter === status ? 'gantt__filter-btn--active' : ''}`}
                                style={{
                                    '--filter-color': statusColors[status],
                                    '--filter-bg': `${statusColors[status]}18`,
                                }}
                                onClick={() => toggleSemaforo(status)}
                            >
                                <span className="gantt__filter-dot" />
                                <span>{statusLabels[status]}</span>
                                <span className="gantt__filter-count">{semaforoCounts[status]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {categories.length > 0 && (
                    <div className="gantt__filters-row">
                        <div className="gantt__filters-left">
                            <span className="gantt__filter-label">Área:</span>
                        </div>
                        <div className="gantt__filter-buttons">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`gantt__cat-btn ${categoryFilter === cat ? 'gantt__cat-btn--active' : ''}`}
                                    style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                                    title={cat}
                                >
                                    <span className="gantt__cat-dot" />
                                    <span className="gantt__cat-text">{cat.length > 25 ? cat.slice(0, 22) + '…' : cat}</span>
                                    <span className="gantt__cat-count">{categoryCounts[cat]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {hasFilters && (
                    <button className="gantt__clear-all" onClick={() => { setSemaforoFilter(null); setCategoryFilter(null); }}>
                        <FiX /> Limpiar filtros
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                {canCreate && (
                    <button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}>
                        <FiPlus /> Nueva Tarea
                    </button>
                )}
            </div>

            {/* Gantt table */}
            <div className="gantt__wrapper">
                <table className="gantt__table">
                    <thead>
                        <tr>
                            <th className="gantt__th gantt__th--task">Actividad</th>
                            <th className="gantt__th gantt__th--status">Estado</th>
                            {monthNames.map((m, i) => (
                                <th key={m} className={`gantt__th gantt__th--month ${i === CURRENT_MONTH ? 'gantt__th--current' : ''}`}>
                                    {m}
                                </th>
                            ))}
                            {isAdmin && <th className="gantt__th gantt__th--actions"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            /* ── Grouped by category ── */
                            categories.map((cat) => {
                                const tasks = grouped[cat];
                                if (!tasks || tasks.length === 0) return null;
                                const cc = categoryColors[cat] || '#64748b';
                                return (
                                    <Fragment key={cat}>
                                        <tr className="gantt__cat-header">
                                            <td colSpan={isAdmin ? 15 : 14} className="gantt__cat-header-cell" style={{ '--cat-color': cc }}>
                                                <span className="gantt__cat-header-dot" />
                                                <span>{cat}</span>
                                                <span className="gantt__cat-header-count">{tasks.length}</span>
                                            </td>
                                        </tr>
                                        {tasks.map((task, idx) => {
                                            const effectiveStatus = getDeptStatus(task.id, task.status);
                                            const pillColor = DEPT_SEMAFORO_COLORS[effectiveStatus] || statusColors[effectiveStatus] || statusColors[task.status];
                                            const pillLabel = DEPT_SEMAFORO_LABELS[effectiveStatus] || statusLabels[effectiveStatus] || statusLabels[task.status];
                                            return (
                                                <tr
                                                    key={task.id}
                                                    className={`gantt__row ${hoveredTask === task.id ? 'gantt__row--hover' : ''}`}
                                                    style={{ animationDelay: `${idx * 0.04}s` }}
                                                    onMouseEnter={() => setHoveredTask(task.id)}
                                                    onMouseLeave={() => setHoveredTask(null)}
                                                >
                                                    <td className="gantt__td gantt__td--task">
                                                        <span className="gantt__task-name">{task.name}</span>
                                                    </td>
                                                    <td className="gantt__td gantt__td--status">
                                                        <span
                                                            className="gantt__status-pill"
                                                            style={{
                                                                '--pill-color': pillColor,
                                                                '--pill-bg': `${pillColor}18`,
                                                                cursor: isAdmin ? 'pointer' : 'default',
                                                            }}
                                                            onClick={isAdmin ? () => cycleDeptStatus(task.id, task.status) : undefined}
                                                            title={isAdmin ? 'Click para cambiar estado' : undefined}
                                                        >
                                                            <span className="gantt__status-dot" />
                                                            {pillLabel}
                                                        </span>
                                                    </td>
                                                    {monthNames.map((_, monthIdx) => {
                                                        const isInRange = monthIdx >= task.startMonth && monthIdx <= task.endMonth;
                                                        const isStart = monthIdx === task.startMonth;
                                                        const isEnd = monthIdx === task.endMonth;
                                                        const isCurrent = monthIdx === CURRENT_MONTH;
                                                        return (
                                                            <td key={monthIdx} className={`gantt__td gantt__td--cell ${isCurrent ? 'gantt__td--current-col' : ''}`}>
                                                                {isInRange && (
                                                                    <div
                                                                        className="gantt__bar"
                                                                        style={{
                                                                            background: `linear-gradient(135deg, ${cc}, ${cc}cc)`,
                                                                            borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                                            boxShadow: hoveredTask === task.id ? `0 2px 12px ${cc}40` : 'none',
                                                                        }}
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    {isAdmin && (
                                                        <td className="gantt__td gantt__td--actions">
                                                            <button className="gantt__delete-btn" onClick={() => handleDeleteClick(task)} title="Eliminar tarea">
                                                                <FiTrash2 />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </Fragment>
                                );
                            })
                        ) : (
                            /* ── Flat list fallback (no categories) ── */
                            filtered.map((task, idx) => {
                                const effectiveStatus = getDeptStatus(task.id, task.status);
                                const pillColor = DEPT_SEMAFORO_COLORS[effectiveStatus] || statusColors[effectiveStatus] || statusColors[task.status];
                                const pillLabel = DEPT_SEMAFORO_LABELS[effectiveStatus] || statusLabels[effectiveStatus] || statusLabels[task.status];
                                const barColor = statusColors[task.status];
                                return (
                                    <tr
                                        key={task.id}
                                        className={`gantt__row ${hoveredTask === task.id ? 'gantt__row--hover' : ''}`}
                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                        onMouseEnter={() => setHoveredTask(task.id)}
                                        onMouseLeave={() => setHoveredTask(null)}
                                    >
                                        <td className="gantt__td gantt__td--task">
                                            <span className="gantt__task-name">{task.name}</span>
                                        </td>
                                        <td className="gantt__td gantt__td--status">
                                            <span
                                                className="gantt__status-pill"
                                                style={{
                                                    '--pill-color': pillColor,
                                                    '--pill-bg': `${pillColor}18`,
                                                    cursor: isAdmin ? 'pointer' : 'default',
                                                }}
                                                onClick={isAdmin ? () => cycleDeptStatus(task.id, task.status) : undefined}
                                                title={isAdmin ? 'Click para cambiar estado' : undefined}
                                            >
                                                <span className="gantt__status-dot" />
                                                {pillLabel}
                                            </span>
                                        </td>
                                        {monthNames.map((_, monthIdx) => {
                                            const isInRange = monthIdx >= task.startMonth && monthIdx <= task.endMonth;
                                            const isStart = monthIdx === task.startMonth;
                                            const isEnd = monthIdx === task.endMonth;
                                            const isCurrent = monthIdx === CURRENT_MONTH;
                                            return (
                                                <td key={monthIdx} className={`gantt__td gantt__td--cell ${isCurrent ? 'gantt__td--current-col' : ''}`}>
                                                    {isInRange && (
                                                        <div
                                                            className="gantt__bar"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${barColor}, ${barColor}cc)`,
                                                                borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                                boxShadow: hoveredTask === task.id ? `0 2px 12px ${barColor}40` : 'none',
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {isAdmin && (
                                            <td className="gantt__td gantt__td--actions">
                                                <button className="gantt__delete-btn" onClick={() => handleDeleteClick(task)} title="Eliminar tarea">
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 15 : 14} className="gantt__empty">
                                    <span className="gantt__empty-icon">🔍</span>
                                    <p>No hay actividades con estos filtros</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="gantt__current-month-info">
                <span className="gantt__current-dot" />
                Mes actual: <strong>{monthNames[CURRENT_MONTH]} 2026</strong>
            </div>

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} fixedDepartment={DEPT_NAME} />
            {deleteTarget && <DeleteConfirmDialog taskName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} loading={deleteLoading} />}
        </div>
    );
}
