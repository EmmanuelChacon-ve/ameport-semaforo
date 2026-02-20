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
import './TurismoGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Turismo';

export default function TurismoGantt() {
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
    const { tasks: tasksWithStatus, categories: turismoCategories, categoryColors, departments, loading, refetch } = useGanttData(DEPT_NAME);
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
        turismoCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, turismoCategories]);

    const unreadCount = useMemo(() => {
        return tasksWithStatus.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length)).length;
    }, [tasksWithStatus, hasUnread]);

    const filtered = useMemo(() => {
        let result = tasksWithStatus;
        if (semaforoFilter) result = result.filter((t) => getDeptStatus(t.id, t.semaforo) === semaforoFilter);
        if (categoryFilter) result = result.filter((t) => t.category === categoryFilter);
        if (unreadFilter) result = result.filter((t) => (t.observations?.length || 0) > 0 && hasUnread(t.id, t.observations.length));
        return result;
    }, [tasksWithStatus, semaforoFilter, categoryFilter, unreadFilter, hasUnread]);

    const groupedTasks = useMemo(() => {
        const groups = {};
        turismoCategories.forEach((cat) => (groups[cat] = []));
        filtered.forEach((t) => {
            if (groups[t.category]) groups[t.category].push(t);
        });
        return groups;
    }, [filtered, turismoCategories]);

    const hasFilters = semaforoFilter || categoryFilter || unreadFilter;
    const clearFilters = () => { setSemaforoFilter(null); setCategoryFilter(null); setUnreadFilter(false); };

    if (loading) {
        return (
            <div className="tgantt tgantt--loading">
                <div className="tgantt__spinner" />
                <p>Cargando actividades...</p>
            </div>
        );
    }

    return (
        <div className="tgantt">
            <div className="tgantt__filters">
                <div className="tgantt__filters-row">
                    <div className="tgantt__filters-left">
                        <FiFilter className="tgantt__filter-icon" />
                        <span className="tgantt__filter-label">Semáforo:</span>
                    </div>
                    <div className="tgantt__filter-buttons">
                        {['green', 'yellow', 'red'].map((s) => (
                            <button key={s}
                                className={`tgantt__filter-btn ${semaforoFilter === s ? 'tgantt__filter-btn--active' : ''}`}
                                style={{ '--f-color': semaforoColors[s], '--f-bg': `${semaforoColors[s]}18` }}
                                onClick={() => setSemaforoFilter(semaforoFilter === s ? null : s)}>
                                <span className="tgantt__filter-dot" />
                                <span>{statusLabels[s]}</span>
                                <span className="tgantt__filter-count">{semaforoCounts[s]}</span>
                            </button>
                        ))}
                    </div>
                    <button className={`tgantt__filter-btn ${unreadFilter ? 'tgantt__filter-btn--active' : ''}`}
                        style={{ '--f-color': '#ef4444', '--f-bg': '#ef444418' }}
                        onClick={() => setUnreadFilter((v) => !v)}>
                        <FiMessageSquare size={12} /><span>No leídas</span>
                        <span className="tgantt__filter-count">{unreadCount}</span>
                    </button>
                </div>
                <div className="tgantt__filters-row">
                    <div className="tgantt__filters-left">
                        <span className="tgantt__filter-label">Área:</span>
                    </div>
                    <div className="tgantt__filter-buttons">
                        {turismoCategories.map((cat) => (
                            <button key={cat}
                                className={`tgantt__cat-btn ${categoryFilter === cat ? 'tgantt__cat-btn--active' : ''}`}
                                style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}>
                                <span className="tgantt__cat-dot" />
                                <span>{cat}</span>
                                <span className="tgantt__cat-count">{categoryCounts[cat]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {hasFilters && (
                    <button className="tgantt__clear-all" onClick={clearFilters}>
                        <FiX /> Limpiar filtros
                    </button>
                )}
            </div>

            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                <div className="gantt__toolbar-actions">
                    {isAdmin && (
                        <button className="grid-print-btn" onClick={() => printTable(tableRef.current, 'Turismo')}>
                            <FiPrinter size={14} /> Imprimir
                        </button>
                    )}
                    {isAdmin && (
                        <button className="grid-print-btn" onClick={() => exportCSV(filtered, 'Turismo', getDeptStatus)}>
                            <FiDownload size={14} /> Exportar
                        </button>
                    )}
                    {canCreate && (<button className="gantt__create-btn" onClick={() => setShowCatModal(true)}><FiFolder /> Nueva Categoría</button>)}
                    {canCreate && (
                        <button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}>
                            <FiPlus /> Nueva Tarea
                        </button>
                    )}
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
                        <div className="tgantt__wrapper">
                            <table className="tgantt__table">
                                <thead>
                                    <tr>
                                        <th className="tgantt__th tgantt__th--task">Actividad</th>
                                        <th className="tgantt__th tgantt__th--sem">Semáforo</th>
                                        {monthNames.map((m, i) => (
                                            <th key={m} className={`tgantt__th tgantt__th--month ${i === CURRENT_MONTH ? 'tgantt__th--current' : ''}`}>{m}</th>
                                        ))}
                                        <th className="tgantt__th tgantt__th--actions"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {turismoCategories.map((cat) => {
                                        const catTasks = groupedTasks[cat];
                                        if (!catTasks || catTasks.length === 0) return null;
                                        const catColor = categoryColors[cat];
                                        return (
                                            <Fragment key={cat}>
                                                <tr className="tgantt__cat-header">
                                                    <td colSpan={15} className="tgantt__cat-header-cell" style={{ '--cat-color': catColor }}>
                                                        <span className="tgantt__cat-header-dot" />
                                                        <span>{cat}</span>
                                                        <span className="tgantt__cat-header-count">{catTasks.length} actividades</span>
                                                    </td>
                                                </tr>
                                                {catTasks.map((task, idx) => {
                                                    const barColor = catColor;
                                                    return (
                                                        <tr key={task.id}
                                                            className={`tgantt__row ${hoveredTask === task.id ? 'tgantt__row--hover' : ''}`}
                                                            style={{ animationDelay: `${idx * 0.04}s` }}
                                                            onMouseEnter={() => setHoveredTask(task.id)}
                                                            onMouseLeave={() => setHoveredTask(null)}>
                                                            <td className="tgantt__td tgantt__td--task">
                                                                <span className="tgantt__task-name" style={{ cursor: 'pointer' }} onClick={() => setDetailTask(task)} title="Ver detalle">{task.name}{(task.observations?.length > 0) && <ObservationIndicator activityId={task.id} count={task.observations.length} />}</span>
                                                                {task.note && (<span className="tgantt__task-note">{task.note}</span>)}
                                                            </td>
                                                            <td className="tgantt__td tgantt__td--sem">
                                                                {(() => {
                                                                    const eff = getDeptStatus(task.id, task.semaforo);
                                                                    const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                                    const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                                    return (
                                                                        <span className="tgantt__sem-pill"
                                                                            style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: 'default' }}>
                                                                            <span className="tgantt__sem-dot" />
                                                                            {el}
                                                                        </span>
                                                                    );
                                                                })()}
                                                                {isCoordinator && <StatusRequestButton activity={task} />}
                                                            </td>
                                                            {monthNames.map((_, mi) => {
                                                                const inRange = mi >= task.startMonth && mi <= task.endMonth;
                                                                const isStart = mi === task.startMonth;
                                                                const isEnd = mi === task.endMonth;
                                                                const isCurrent = mi === CURRENT_MONTH;
                                                                return (
                                                                    <td key={mi} className={`tgantt__td tgantt__td--cell ${isCurrent ? 'tgantt__td--current-col' : ''}`}>
                                                                        {inRange && (
                                                                            <div className="tgantt__bar" style={{
                                                                                background: `linear-gradient(135deg, ${barColor}, ${barColor}cc)`,
                                                                                borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                                                boxShadow: hoveredTask === task.id ? `0 2px 12px ${barColor}40` : 'none',
                                                                            }} />
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
                                    })}
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={15} className="tgantt__empty">
                                                <span className="tgantt__empty-icon">🔍</span>
                                                <p>No hay actividades con estos filtros</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="tgantt__current-info">
                            <span className="tgantt__current-dot" />
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
