import { useState, useMemo, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { monthNames, statusLabels, semaforoColors, STATUS_CONFIG, DETAILED_STATUS_FILTERS } from '../../utils/semaforoUtils';
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
import './SaludGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Salud y Recreación';

export default function SaludGantt() {
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
    const { tasks: tasksWithStatus, categories: saludCategories, categoryColors, departments, loading, refetch } = useGanttData(DEPT_NAME);
    const {
        isAdmin, canCreate, showCreateModal, setShowCreateModal,
        deleteTarget, deleteLoading,
        handleCreate, handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    } = useGanttCRUD(refetch);

    const semaforoCounts = useMemo(() => {
        const c = {};
        DETAILED_STATUS_FILTERS.forEach((s) => (c[s] = 0));
        tasksWithStatus.forEach((t) => { const s = getDeptDetailedStatus(t.id, t.semaforo); if (c[s] !== undefined) c[s]++; });
        return c;
    }, [tasksWithStatus, getDeptDetailedStatus]);

    const categoryCounts = useMemo(() => {
        const c = {};
        saludCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, saludCategories]);

    const unreadCount = useMemo(() => {
        return tasksWithStatus.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length)).length;
    }, [tasksWithStatus, hasUnread]);

    const filtered = useMemo(() => {
        let result = tasksWithStatus;
        if (semaforoFilter) result = result.filter((t) => getDeptDetailedStatus(t.id, t.semaforo) === semaforoFilter);
        if (categoryFilter) result = result.filter((t) => t.category === categoryFilter);
        if (unreadFilter) result = result.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length));
        return result;
    }, [tasksWithStatus, semaforoFilter, categoryFilter, unreadFilter, hasUnread]);

    const groupedTasks = useMemo(() => {
        const groups = {};
        saludCategories.forEach((cat) => (groups[cat] = []));
        filtered.forEach((t) => { if (groups[t.category]) groups[t.category].push(t); });
        return groups;
    }, [filtered, saludCategories]);

    const hasFilters = semaforoFilter || categoryFilter || unreadFilter;
    const clearFilters = () => { setSemaforoFilter(null); setCategoryFilter(null); setUnreadFilter(false); };
    const totalCols = 14;

    if (loading) {
        return (<div className="sgantt sgantt--loading"><div className="sgantt__spinner" /><p>Cargando actividades...</p></div>);
    }

    return (
        <div className="sgantt">
            <div className="sgantt__filters">
                <div className="sgantt__filters-row">
                    <div className="sgantt__filters-left"><FiFilter className="sgantt__filter-icon" /><span className="sgantt__filter-label">Semáforo:</span></div>
                    <div className="sgantt__filter-buttons">
                        {DETAILED_STATUS_FILTERS.map((s) => (
                            <button key={s} className={`sgantt__filter-btn ${semaforoFilter === s ? 'sgantt__filter-btn--active' : ''}`}
                                style={{ '--f-color': STATUS_CONFIG[s].color, '--f-bg': `${STATUS_CONFIG[s].color}18` }}
                                onClick={() => setSemaforoFilter(semaforoFilter === s ? null : s)}>
                                <span className="sgantt__filter-dot" /><span>{STATUS_CONFIG[s].label}</span>
                                <span className="sgantt__filter-count">{semaforoCounts[s]}</span>
                            </button>
                        ))}
                    </div>
                    <button className={`sgantt__filter-btn ${unreadFilter ? 'sgantt__filter-btn--active' : ''}`}
                        style={{ '--f-color': '#ef4444', '--f-bg': '#ef444418' }}
                        onClick={() => setUnreadFilter((v) => !v)}>
                        <FiMessageSquare size={12} /><span>No leídas</span>
                        <span className="sgantt__filter-count">{unreadCount}</span>
                    </button>
                </div>
                <div className="sgantt__filters-row">
                    <div className="sgantt__filters-left"><span className="sgantt__filter-label">Área:</span></div>
                    <div className="sgantt__filter-buttons">
                        {saludCategories.map((cat) => (
                            <button key={cat} className={`sgantt__cat-btn ${categoryFilter === cat ? 'sgantt__cat-btn--active' : ''}`}
                                style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}>
                                <span className="sgantt__cat-dot" /><span>{cat}</span>
                                <span className="sgantt__cat-count">{categoryCounts[cat]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {hasFilters && (<button className="sgantt__clear-all" onClick={clearFilters}><FiX /> Limpiar filtros</button>)}
            </div>

            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                <div className="gantt__toolbar-actions">
                    {isAdmin && (
                        <button className="grid-print-btn" onClick={() => printTable(tableRef.current, 'Salud y Recreación')}>
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
                        <div className="sgantt__wrapper">
                            <table className="sgantt__table">
                                <thead><tr>
                                    <th className="sgantt__th sgantt__th--task">Actividad</th>
                                    <th className="sgantt__th sgantt__th--sem">Semáforo</th>
                                    {monthNames.map((m, i) => (<th key={m} className={`sgantt__th sgantt__th--month ${i === CURRENT_MONTH ? 'sgantt__th--current' : ''}`}>{m}</th>))}
                                    <th className="sgantt__th sgantt__th--actions"></th>
                                </tr></thead>
                                <tbody>
                                    {saludCategories.map((cat) => {
                                        const catTasks = groupedTasks[cat];
                                        if (!catTasks || catTasks.length === 0) return null;
                                        const catColor = categoryColors[cat];
                                        return (
                                            <Fragment key={cat}>
                                                <tr className="sgantt__cat-header"><td colSpan={totalCols} className="sgantt__cat-header-cell" style={{ '--cat-color': catColor }}>
                                                    <span className="sgantt__cat-header-dot" /><span>{cat}</span><span className="sgantt__cat-header-count">{catTasks.length} actividades</span>
                                                </td></tr>
                                                {catTasks.map((task, idx) => (
                                                    <tr key={task.id} className={`sgantt__row ${hoveredTask === task.id ? 'sgantt__row--hover' : ''}`}
                                                        style={{ animationDelay: `${idx * 0.04}s` }}
                                                        onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)}>
                                                        <td className="sgantt__td sgantt__td--task"><span className="sgantt__task-name" style={{ cursor: 'pointer' }} onClick={() => setDetailTask(task)} title="Ver detalle">{task.name}{(task.observations?.length > 0) && <ObservationIndicator activityId={task.id} count={task.observations.length} />}</span>{task.note && <span className="sgantt__task-note">{task.note}</span>}</td>
                                                        <td className="sgantt__td sgantt__td--sem">
                                                            {(() => {
                                                                const eff = getDeptDetailedStatus(task.id, task.semaforo);
                                                                const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                                const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                                return (<span className="sgantt__sem-pill" style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: 'default' }}>
                                                                    <span className="sgantt__sem-dot" />{el}</span>);
                                                            })()}
                                                            {isCoordinator && <StatusRequestButton activity={task} />}
                                                        </td>
                                                        {monthNames.map((_, mi) => {
                                                            const inRange = mi >= task.startMonth && mi <= task.endMonth;
                                                            const isStart = mi === task.startMonth;
                                                            const isEnd = mi === task.endMonth;
                                                            return (<td key={mi} className={`sgantt__td sgantt__td--cell ${mi === CURRENT_MONTH ? 'sgantt__td--current-col' : ''}`}>
                                                                {inRange && (<div className="sgantt__bar" style={{
                                                                    background: `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
                                                                    borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                                    boxShadow: hoveredTask === task.id ? `0 2px 12px ${catColor}40` : 'none',
                                                                }} />)}
                                                            </td>);
                                                        })}
                                                        <td className="gantt__td gantt__td--actions"><button className="gantt__detail-btn" onClick={() => navigate(`/actividad/${task.id}`)} title="Ver hitos"><FiEye size={13} /></button></td>
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        );
                                    })}
                                    {filtered.length === 0 && (<tr><td colSpan={totalCols} className="sgantt__empty"><span className="sgantt__empty-icon">🔍</span><p>No hay actividades con estos filtros</p></td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div className="sgantt__current-info"><span className="sgantt__current-dot" />Mes actual: <strong>{monthNames[CURRENT_MONTH]} 2026</strong></div>
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
