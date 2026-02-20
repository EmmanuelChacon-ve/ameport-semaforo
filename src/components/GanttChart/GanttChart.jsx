import { useState, useMemo, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import useObservationRead from '../../hooks/useObservationRead';
import { FiFilter, FiX, FiPlus, FiTrash2, FiFolder, FiMessageSquare, FiEye, FiPrinter, FiDownload } from 'react-icons/fi';
import printTable from '../../utils/printTable';
import exportCSV from '../../utils/exportCSV';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import ActivityDetailModal from '../ActivityDetailModal/ActivityDetailModal';
import CreateCategoryModal from '../CreateCategoryModal/CreateCategoryModal';
import ObservationIndicator from '../ObservationIndicator/ObservationIndicator';
import StatusRequestButton from '../StatusRequestButton/StatusRequestButton';
import ObservationPrompt from '../ObservationPrompt/ObservationPrompt';
import AdminDeptTable from '../AdminDeptTable/AdminDeptTable';
import './GanttChart.css';

const statusColors = semaforoColors;
const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Sistemas';

export default function GanttChart() {
    const navigate = useNavigate();
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [unreadFilter, setUnreadFilter] = useState(false);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [detailTask, setDetailTask] = useState(null);
    const [showCatModal, setShowCatModal] = useState(false);
    const { getDeptStatus, cycleDeptStatus, isCoordinator, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS, pendingObservation, confirmObservation, cancelObservation } = useTasks();
    const { hasUnread } = useObservationRead();
    const tableRef = useRef(null);
    const { tasks: tasksRaw, categories, categoryColors, departments, loading, refetch } = useGanttData(DEPT_NAME);
    const {
        isAdmin, canCreate,
        showCreateModal, setShowCreateModal,
        deleteTarget, deleteLoading,
        handleCreate, handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    } = useGanttCRUD(refetch);

    const tasksWithStatus = useMemo(
        () => tasksRaw.map((t) => ({ ...t, status: getDeptStatus(t.id, t.semaforo) })),
        [tasksRaw, getDeptStatus]
    );

    const semaforoCounts = useMemo(() => {
        const c = { green: 0, yellow: 0, red: 0 };
        tasksWithStatus.forEach((t) => c[t.status]++);
        return c;
    }, [tasksWithStatus]);

    const unreadCount = useMemo(() => {
        return tasksWithStatus.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length)).length;
    }, [tasksWithStatus, hasUnread]);

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
        if (unreadFilter) r = r.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length));
        return r;
    }, [tasksWithStatus, semaforoFilter, categoryFilter, unreadFilter, hasUnread]);

    const grouped = useMemo(() => {
        const g = {};
        categories.forEach((c) => (g[c] = []));
        filtered.forEach((t) => { if (g[t.category]) g[t.category].push(t); });
        return g;
    }, [filtered, categories]);

    const hasFilters = semaforoFilter || categoryFilter || unreadFilter;

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
                        <button
                            className={`gantt__filter-btn gantt__filter-btn--unread ${unreadFilter ? 'gantt__filter-btn--active' : ''}`}
                            style={{ '--filter-color': '#ef4444', '--filter-bg': '#ef444418' }}
                            onClick={() => setUnreadFilter((v) => !v)}
                        >
                            <FiMessageSquare size={12} />
                            <span>No leídas</span>
                            <span className="gantt__filter-count">{unreadCount}</span>
                        </button>
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
                    <button className="gantt__clear-all" onClick={() => { setSemaforoFilter(null); setCategoryFilter(null); setUnreadFilter(false); }}>
                        <FiX /> Limpiar filtros
                    </button>
                )}
            </div>

            {/* Toolbar */}
            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                <div className="gantt__toolbar-actions">
                    {isAdmin && (
                        <button className="grid-print-btn" onClick={() => printTable(tableRef.current, 'Sistemas')}>
                            <FiPrinter size={14} /> Imprimir
                        </button>
                    )}
                    {isAdmin && (
                        <button className="grid-print-btn" onClick={() => exportCSV(filtered, 'Sistemas', getDeptStatus)}>
                            <FiDownload size={14} /> Exportar
                        </button>
                    )}
                    {canCreate && (
                        <button className="gantt__create-btn" onClick={() => setShowCatModal(true)}>
                            <FiFolder /> Nueva Categoría
                        </button>
                    )}
                    {canCreate && (
                        <button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}>
                            <FiPlus /> Nueva Tarea
                        </button>
                    )}
                </div>
            </div>

            {/* Gantt table */}
            <div ref={tableRef}>
                {isAdmin ? (
                    <AdminDeptTable
                        tasks={filtered}
                        departmentName={DEPT_NAME}
                        categoryColors={categoryColors}
                        onDeleteClick={handleDeleteClick}
                    />
                ) : (
                    <>
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
                                        <th className="gantt__th gantt__th--actions"></th>
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
                                                        <td colSpan={15} className="gantt__cat-header-cell" style={{ '--cat-color': cc }}>
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
                                                                    <span className="gantt__task-name" style={{ cursor: 'pointer' }} onClick={() => setDetailTask(task)} title="Ver detalle">
                                                                        {task.name}
                                                                        {(task.observations?.length > 0) && <ObservationIndicator activityId={task.id} count={task.observations.length} />}
                                                                    </span>
                                                                </td>
                                                                <td className="gantt__td gantt__td--status">
                                                                    <span
                                                                        className="gantt__status-pill"
                                                                        style={{
                                                                            '--pill-color': pillColor,
                                                                            '--pill-bg': `${pillColor}18`,
                                                                            cursor: 'default',
                                                                        }}
                                                                    >
                                                                        <span className="gantt__status-dot" />
                                                                        {pillLabel}
                                                                    </span>
                                                                    {isCoordinator && <StatusRequestButton activity={task} />}
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
                                                                <td className="gantt__td gantt__td--actions"><button className="gantt__detail-btn" onClick={() => navigate(`/actividad/${task.id}`)} title="Ver hitos"><FiEye size={13} /></button></td>
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
                                                        <span className="gantt__task-name" style={{ cursor: 'pointer' }} onClick={() => setDetailTask(task)} title="Ver detalle">
                                                            {task.name}
                                                            {(task.observations?.length > 0) && <ObservationIndicator activityId={task.id} count={task.observations.length} />}
                                                        </span>
                                                    </td>
                                                    <td className="gantt__td gantt__td--status">
                                                        <span
                                                            className="gantt__status-pill"
                                                            style={{
                                                                '--pill-color': pillColor,
                                                                '--pill-bg': `${pillColor}18`,
                                                                cursor: 'default',
                                                            }}
                                                        >
                                                            <span className="gantt__status-dot" />
                                                            {pillLabel}
                                                        </span>
                                                        {isCoordinator && <StatusRequestButton activity={task} />}
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
                                                    <td className="gantt__td gantt__td--actions"><button className="gantt__detail-btn" onClick={() => navigate(`/actividad/${task.id}`)} title="Ver hitos"><FiEye size={13} /></button></td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={15} className="gantt__empty">
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
                    </>)
                }
            </div>

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} fixedDepartment={DEPT_NAME} />
            {deleteTarget && <DeleteConfirmDialog taskName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} loading={deleteLoading} />}
            {detailTask && <ActivityDetailModal activity={detailTask} onClose={() => setDetailTask(null)} />}
            <CreateCategoryModal isOpen={showCatModal} onClose={() => setShowCatModal(false)} departmentName={DEPT_NAME} departments={departments} onCategoryCreated={refetch} />
            {pendingObservation && (
                <ObservationPrompt
                    currentStatus={pendingObservation.currentStatus}
                    activityName={pendingObservation.taskName}
                    onConfirm={confirmObservation}
                    onCancel={cancelObservation}
                />
            )}
        </div>
    );
}
