import { useState, useMemo, Fragment } from 'react';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import { FiFilter, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import './TurismoGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Turismo';

export default function TurismoGantt() {
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const { getDeptStatus, cycleDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS } = useTasks();
    const { tasks: tasksWithStatus, categories: turismoCategories, categoryColors, loading, refetch } = useGanttData(DEPT_NAME);
    const {
        isAdmin, canCreate,
        showCreateModal, setShowCreateModal,
        deleteTarget, deleteLoading,
        handleCreate, handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    } = useGanttCRUD(refetch);

    const semaforoCounts = useMemo(() => {
        const c = { green: 0, yellow: 0, red: 0 };
        tasksWithStatus.forEach((t) => c[t.semaforo]++);
        return c;
    }, [tasksWithStatus]);

    const categoryCounts = useMemo(() => {
        const c = {};
        turismoCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, turismoCategories]);

    const filtered = useMemo(() => {
        let result = tasksWithStatus;
        if (semaforoFilter) result = result.filter((t) => t.semaforo === semaforoFilter);
        if (categoryFilter) result = result.filter((t) => t.category === categoryFilter);
        return result;
    }, [tasksWithStatus, semaforoFilter, categoryFilter]);

    const groupedTasks = useMemo(() => {
        const groups = {};
        turismoCategories.forEach((cat) => (groups[cat] = []));
        filtered.forEach((t) => {
            if (groups[t.category]) groups[t.category].push(t);
        });
        return groups;
    }, [filtered, turismoCategories]);

    const hasFilters = semaforoFilter || categoryFilter;
    const clearFilters = () => { setSemaforoFilter(null); setCategoryFilter(null); };

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
                {canCreate && (
                    <button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}>
                        <FiPlus /> Nueva Tarea
                    </button>
                )}
            </div>

            <div className="tgantt__wrapper">
                <table className="tgantt__table">
                    <thead>
                        <tr>
                            <th className="tgantt__th tgantt__th--task">Actividad</th>
                            <th className="tgantt__th tgantt__th--sem">Semáforo</th>
                            {monthNames.map((m, i) => (
                                <th key={m} className={`tgantt__th tgantt__th--month ${i === CURRENT_MONTH ? 'tgantt__th--current' : ''}`}>{m}</th>
                            ))}
                            {isAdmin && <th className="tgantt__th tgantt__th--actions"></th>}
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
                                        <td colSpan={isAdmin ? 15 : 14} className="tgantt__cat-header-cell" style={{ '--cat-color': catColor }}>
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
                                                    <span className="tgantt__task-name">{task.name}</span>
                                                    {task.note && (<span className="tgantt__task-note">{task.note}</span>)}
                                                </td>
                                                <td className="tgantt__td tgantt__td--sem">
                                                    {(() => {
                                                        const eff = getDeptStatus(task.id, task.semaforo);
                                                        const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                        const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                        return (
                                                            <span className="tgantt__sem-pill"
                                                                style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: isAdmin ? 'pointer' : 'default' }}
                                                                onClick={isAdmin ? () => cycleDeptStatus(task.id, task.semaforo) : undefined}
                                                                title={isAdmin ? 'Click para cambiar estado' : undefined}>
                                                                <span className="tgantt__sem-dot" />
                                                                {el}
                                                            </span>
                                                        );
                                                    })()}
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
                                                {isAdmin && (
                                                    <td className="tgantt__td tgantt__td--actions">
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
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 15 : 14} className="tgantt__empty">
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

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} fixedDepartment={DEPT_NAME} />
            {deleteTarget && <DeleteConfirmDialog taskName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} loading={deleteLoading} />}
        </div>
    );
}
