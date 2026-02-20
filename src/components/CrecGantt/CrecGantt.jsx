import { useState, useMemo, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import useObservationRead from '../../hooks/useObservationRead';
import { FiFilter, FiX, FiPlus, FiTrash2, FiFolder, FiMessageSquare, FiEye, FiPrinter } from 'react-icons/fi';
import printTable from '../../utils/printTable';

import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import ActivityDetailModal from '../ActivityDetailModal/ActivityDetailModal';
import CreateCategoryModal from '../CreateCategoryModal/CreateCategoryModal';
import ObservationIndicator from '../ObservationIndicator/ObservationIndicator';
import StatusRequestButton from '../StatusRequestButton/StatusRequestButton';
import ObservationPrompt from '../ObservationPrompt/ObservationPrompt';
import AdminDeptTable from '../AdminDeptTable/AdminDeptTable';
import './CrecGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Crecimiento';

export default function CrecGantt() {
    const navigate = useNavigate();
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [unreadFilter, setUnreadFilter] = useState(false);
    const [hoveredTask, setHoveredTask] = useState(null);
    const [detailTask, setDetailTask] = useState(null);
    const [showCatModal, setShowCatModal] = useState(false);
    const { getDeptStatus, getDeptDetailedStatus, cycleDeptStatus, isCoordinator, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS, pendingObservation, confirmObservation, cancelObservation } = useTasks();
    const { hasUnread } = useObservationRead();
    const tableRef = useRef(null);
    const { tasks: tasksWithStatus, categories: crecCategories, categoryColors, departments, loading, refetch } = useGanttData(DEPT_NAME);
    const {
        isAdmin, canCreate,
        showCreateModal, setShowCreateModal,
        deleteTarget, deleteLoading,
        handleCreate, handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    } = useGanttCRUD(refetch);

    const semaforoCounts = useMemo(() => {
        const c = { green: 0, yellow: 0, red: 0 };
        tasksWithStatus.forEach((t) => { const s = getDeptStatus(t.id, t.semaforo); if (c[s] !== undefined) c[s]++; });
        return c;
    }, [tasksWithStatus, getDeptStatus]);

    const categoryCounts = useMemo(() => {
        const c = {};
        crecCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, crecCategories]);

    const unreadCount = useMemo(() => {
        return tasksWithStatus.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length)).length;
    }, [tasksWithStatus, hasUnread]);

    const filtered = useMemo(() => {
        let r = tasksWithStatus;
        if (semaforoFilter) r = r.filter((t) => getDeptStatus(t.id, t.semaforo) === semaforoFilter);
        if (categoryFilter) r = r.filter((t) => t.category === categoryFilter);
        if (unreadFilter) r = r.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length));
        return r;
    }, [tasksWithStatus, semaforoFilter, categoryFilter, unreadFilter, hasUnread]);

    const grouped = useMemo(() => {
        const g = {};
        crecCategories.forEach((c) => (g[c] = []));
        filtered.forEach((t) => { if (g[t.category]) g[t.category].push(t); });
        return g;
    }, [filtered, crecCategories]);

    const hasFilters = semaforoFilter || categoryFilter || unreadFilter;

    if (loading) {
        return (<div className="crgantt crgantt--loading"><div className="crgantt__spinner" /><p>Cargando actividades...</p></div>);
    }

    return (
        <div className="crgantt">
            <div className="crgantt__filters">
                <div className="crgantt__filters-row">
                    <div className="crgantt__filters-left"><FiFilter className="crgantt__filter-icon" /><span className="crgantt__filter-label">Semáforo:</span></div>
                    <div className="crgantt__filter-buttons">
                        {['green', 'yellow', 'red'].map((s) => (
                            <button key={s} className={`crgantt__filter-btn ${semaforoFilter === s ? 'crgantt__filter-btn--active' : ''}`}
                                style={{ '--f-color': semaforoColors[s], '--f-bg': `${semaforoColors[s]}18` }}
                                onClick={() => setSemaforoFilter(semaforoFilter === s ? null : s)}>
                                <span className="crgantt__filter-dot" /><span>{statusLabels[s]}</span>
                                <span className="crgantt__filter-count">{semaforoCounts[s]}</span>
                            </button>
                        ))}
                    </div>
                    <button className={`crgantt__filter-btn ${unreadFilter ? 'crgantt__filter-btn--active' : ''}`}
                        style={{ '--f-color': '#ef4444', '--f-bg': '#ef444418' }}
                        onClick={() => setUnreadFilter((v) => !v)}>
                        <FiMessageSquare size={12} /><span>No leídas</span>
                        <span className="crgantt__filter-count">{unreadCount}</span>
                    </button>
                </div>
                <div className="crgantt__filters-row">
                    <div className="crgantt__filters-left"><span className="crgantt__filter-label">Área:</span></div>
                    <div className="crgantt__filter-buttons">
                        {crecCategories.map((cat) => (
                            <button key={cat} className={`crgantt__cat-btn ${categoryFilter === cat ? 'crgantt__cat-btn--active' : ''}`}
                                style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)} title={cat}>
                                <span className="crgantt__cat-dot" /><span className="crgantt__cat-text">{cat.length > 28 ? cat.slice(0, 25) + '…' : cat}</span>
                                <span className="crgantt__cat-count">{categoryCounts[cat]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {hasFilters && (<button className="crgantt__clear-all" onClick={() => { setSemaforoFilter(null); setCategoryFilter(null); setUnreadFilter(false); }}><FiX /> Limpiar filtros</button>)}
            </div>

            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                <div className="gantt__toolbar-actions">
                    {isAdmin && (
                        <button className="grid-print-btn" onClick={() => printTable(tableRef.current, 'Crecimiento')}>
                            <FiPrinter size={14} /> Imprimir
                        </button>
                    )}

                    {canCreate && (<button className="gantt__create-btn" onClick={() => setShowCatModal(true)}><FiFolder /> Nueva Categoría</button>)}
                    {canCreate && (<button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}><FiPlus /> Nueva Tarea</button>)}
                </div>
            </div>

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
                        <div className="crgantt__wrapper">
                            <table className="crgantt__table">
                                <thead><tr>
                                    <th className="crgantt__th crgantt__th--task">Actividad</th>
                                    <th className="crgantt__th crgantt__th--sem">Semáforo</th>
                                    {monthNames.map((m, i) => (<th key={m} className={`crgantt__th crgantt__th--month ${i === CURRENT_MONTH ? 'crgantt__th--current' : ''}`}>{m}</th>))}
                                    <th className="crgantt__th crgantt__th--actions"></th>
                                </tr></thead>
                                <tbody>
                                    {crecCategories.map((cat) => {
                                        const tasks = grouped[cat];
                                        if (!tasks || tasks.length === 0) return null;
                                        const cc = categoryColors[cat];
                                        return (
                                            <Fragment key={cat}>
                                                <tr className="crgantt__cat-header"><td colSpan={15} className="crgantt__cat-header-cell" style={{ '--cat-color': cc }}>
                                                    <span className="crgantt__cat-header-dot" /><span>{cat}</span><span className="crgantt__cat-header-count">{tasks.length}</span>
                                                </td></tr>
                                                {tasks.map((task, idx) => (
                                                    <tr key={task.id} className={`crgantt__row ${hoveredTask === task.id ? 'crgantt__row--hover' : ''}`}
                                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                                        onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)}>
                                                        <td className="crgantt__td crgantt__td--task">
                                                            <span className="crgantt__task-name" style={{ cursor: 'pointer' }} onClick={() => setDetailTask(task)} title="Ver detalle">{task.name}{(task.observations?.length > 0) && <ObservationIndicator activityId={task.id} count={task.observations.length} />}</span>
                                                            {task.note && <span className="crgantt__task-note">{task.note}</span>}
                                                        </td>
                                                        <td className="crgantt__td crgantt__td--sem">
                                                            {(() => {
                                                                const eff = getDeptDetailedStatus(task.id, task.semaforo);
                                                                const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                                const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                                return (<span className="crgantt__sem-pill" style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: 'default' }}>
                                                                    <span className="crgantt__sem-dot" />{el}</span>);
                                                            })()}
                                                            {isCoordinator && <StatusRequestButton activity={task} />}
                                                        </td>
                                                        {monthNames.map((_, mi) => {
                                                            const inRange = mi >= task.startMonth && mi <= task.endMonth;
                                                            const isStart = mi === task.startMonth;
                                                            const isEnd = mi === task.endMonth;
                                                            return (<td key={mi} className={`crgantt__td crgantt__td--cell ${mi === CURRENT_MONTH ? 'crgantt__td--current-col' : ''}`}>
                                                                {inRange && (<div className="crgantt__bar" style={{
                                                                    background: `linear-gradient(135deg, ${cc}, ${cc}cc)`,
                                                                    borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                                    boxShadow: hoveredTask === task.id ? `0 2px 12px ${cc}40` : 'none',
                                                                }} />)}
                                                            </td>);
                                                        })}
                                                        <td className="gantt__td gantt__td--actions"><button className="gantt__detail-btn" onClick={() => navigate(`/actividad/${task.id}`)} title="Ver hitos"><FiEye size={13} /></button></td>
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        );
                                    })}
                                    {filtered.length === 0 && (<tr><td colSpan={15} className="crgantt__empty"><span className="crgantt__empty-icon">🔍</span><p>No hay actividades con estos filtros</p></td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div className="crgantt__current-info"><span className="crgantt__current-dot" />Mes actual: <strong>{monthNames[CURRENT_MONTH]} 2026</strong></div>
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
