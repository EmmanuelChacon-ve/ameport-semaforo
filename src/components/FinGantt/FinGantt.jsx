import { useState, useMemo, Fragment } from 'react';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import { FiFilter, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import './FinGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Finanzas';

export default function FinGantt() {
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const { getDeptStatus, cycleDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS } = useTasks();
    const { tasks: tasksWithStatus, categories: finCategories, categoryColors, loading, refetch } = useGanttData(DEPT_NAME);
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
        finCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, finCategories]);

    const filtered = useMemo(() => {
        let r = tasksWithStatus;
        if (semaforoFilter) r = r.filter((t) => t.semaforo === semaforoFilter);
        if (categoryFilter) r = r.filter((t) => t.category === categoryFilter);
        return r;
    }, [tasksWithStatus, semaforoFilter, categoryFilter]);

    const grouped = useMemo(() => {
        const g = {};
        finCategories.forEach((c) => (g[c] = []));
        filtered.forEach((t) => { if (g[t.category]) g[t.category].push(t); });
        return g;
    }, [filtered, finCategories]);

    const hasFilters = semaforoFilter || categoryFilter;

    if (loading) {
        return (<div className="fgantt fgantt--loading"><div className="fgantt__spinner" /><p>Cargando actividades...</p></div>);
    }

    return (
        <div className="fgantt">
            <div className="fgantt__filters">
                <div className="fgantt__filters-row">
                    <div className="fgantt__filters-left"><FiFilter className="fgantt__filter-icon" /><span className="fgantt__filter-label">Semáforo:</span></div>
                    <div className="fgantt__filter-buttons">
                        {['green', 'yellow', 'red'].map((s) => (
                            <button key={s} className={`fgantt__filter-btn ${semaforoFilter === s ? 'fgantt__filter-btn--active' : ''}`}
                                style={{ '--f-color': semaforoColors[s], '--f-bg': `${semaforoColors[s]}18` }}
                                onClick={() => setSemaforoFilter(semaforoFilter === s ? null : s)}>
                                <span className="fgantt__filter-dot" /><span>{statusLabels[s]}</span>
                                <span className="fgantt__filter-count">{semaforoCounts[s]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="fgantt__filters-row">
                    <div className="fgantt__filters-left"><span className="fgantt__filter-label">Área:</span></div>
                    <div className="fgantt__filter-buttons">
                        {finCategories.map((cat) => (
                            <button key={cat} className={`fgantt__cat-btn ${categoryFilter === cat ? 'fgantt__cat-btn--active' : ''}`}
                                style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)} title={cat}>
                                <span className="fgantt__cat-dot" /><span className="fgantt__cat-text">{cat.length > 30 ? cat.slice(0, 27) + '…' : cat}</span>
                                <span className="fgantt__cat-count">{categoryCounts[cat]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {hasFilters && (<button className="fgantt__clear-all" onClick={() => { setSemaforoFilter(null); setCategoryFilter(null); }}><FiX /> Limpiar filtros</button>)}
            </div>

            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                {canCreate && (<button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}><FiPlus /> Nueva Tarea</button>)}
            </div>

            <div className="fgantt__wrapper">
                <table className="fgantt__table">
                    <thead><tr>
                        <th className="fgantt__th fgantt__th--task">Actividad</th>
                        <th className="fgantt__th fgantt__th--sem">Semáforo</th>
                        {monthNames.map((m, i) => (<th key={m} className={`fgantt__th fgantt__th--month ${i === CURRENT_MONTH ? 'fgantt__th--current' : ''}`}>{m}</th>))}
                        {isAdmin && <th className="fgantt__th gantt__th--actions"></th>}
                    </tr></thead>
                    <tbody>
                        {finCategories.map((cat) => {
                            const catTasks = grouped[cat];
                            if (!catTasks || catTasks.length === 0) return null;
                            const cc = categoryColors[cat];
                            return (
                                <Fragment key={cat}>
                                    <tr className="fgantt__cat-header"><td colSpan={isAdmin ? 15 : 14} className="fgantt__cat-header-cell" style={{ '--cat-color': cc }}>
                                        <span className="fgantt__cat-header-dot" /><span>{cat}</span><span className="fgantt__cat-header-count">{catTasks.length}</span>
                                    </td></tr>
                                    {catTasks.map((task, idx) => (
                                        <tr key={task.id} className={`fgantt__row ${hoveredTask === task.id ? 'fgantt__row--hover' : ''}`}
                                            style={{ animationDelay: `${idx * 0.04}s` }}
                                            onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)}>
                                            <td className="fgantt__td fgantt__td--task"><span className="fgantt__task-name">{task.name}</span></td>
                                            <td className="fgantt__td fgantt__td--sem">
                                                {(() => {
                                                    const eff = getDeptStatus(task.id, task.semaforo);
                                                    const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                    const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                    return (<span className="fgantt__sem-pill" style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: isAdmin ? 'pointer' : 'default' }}
                                                        onClick={isAdmin ? () => cycleDeptStatus(task.id, task.semaforo) : undefined}
                                                        title={isAdmin ? 'Click para cambiar estado' : undefined}>
                                                        <span className="fgantt__sem-dot" />{el}</span>);
                                                })()}
                                            </td>
                                            {monthNames.map((_, mi) => {
                                                const inRange = mi >= task.startMonth && mi <= task.endMonth;
                                                const isStart = mi === task.startMonth;
                                                const isEnd = mi === task.endMonth;
                                                return (<td key={mi} className={`fgantt__td fgantt__td--cell ${mi === CURRENT_MONTH ? 'fgantt__td--current-col' : ''}`}>
                                                    {inRange && (<div className="fgantt__bar" style={{
                                                        background: `linear-gradient(135deg, ${cc}, ${cc}cc)`,
                                                        borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                        boxShadow: hoveredTask === task.id ? `0 2px 12px ${cc}40` : 'none',
                                                    }} />)}
                                                </td>);
                                            })}
                                            {isAdmin && (<td className="fgantt__td gantt__td--actions"><button className="gantt__delete-btn" onClick={() => handleDeleteClick(task)} title="Eliminar tarea"><FiTrash2 /></button></td>)}
                                        </tr>
                                    ))}
                                </Fragment>
                            );
                        })}
                        {filtered.length === 0 && (<tr><td colSpan={isAdmin ? 15 : 14} className="fgantt__empty"><span className="fgantt__empty-icon">🔍</span><p>No hay actividades con estos filtros</p></td></tr>)}
                    </tbody>
                </table>
            </div>
            <div className="fgantt__current-info"><span className="fgantt__current-dot" />Mes actual: <strong>{monthNames[CURRENT_MONTH]} 2026</strong></div>

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} fixedDepartment={DEPT_NAME} />
            {deleteTarget && <DeleteConfirmDialog taskName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} loading={deleteLoading} />}
        </div>
    );
}
