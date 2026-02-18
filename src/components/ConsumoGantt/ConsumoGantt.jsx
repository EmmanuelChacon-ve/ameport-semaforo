import { useState, useMemo, Fragment } from 'react';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import { FiFilter, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import './ConsumoGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Consumo';

export default function ConsumoGantt() {
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const { getDeptStatus, cycleDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS } = useTasks();
    const { tasks: tasksWithStatus, categories: consumoCategories, categoryColors, loading, refetch } = useGanttData(DEPT_NAME);
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
        consumoCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, consumoCategories]);

    const filtered = useMemo(() => {
        let r = tasksWithStatus;
        if (semaforoFilter) r = r.filter((t) => t.semaforo === semaforoFilter);
        if (categoryFilter) r = r.filter((t) => t.category === categoryFilter);
        return r;
    }, [tasksWithStatus, semaforoFilter, categoryFilter]);

    const grouped = useMemo(() => {
        const g = {};
        consumoCategories.forEach((c) => (g[c] = []));
        filtered.forEach((t) => { if (g[t.category]) g[t.category].push(t); });
        return g;
    }, [filtered, consumoCategories]);

    const hasFilters = semaforoFilter || categoryFilter;

    if (loading) {
        return (<div className="cogantt cogantt--loading"><div className="cogantt__spinner" /><p>Cargando actividades...</p></div>);
    }

    return (
        <div className="cogantt">
            <div className="cogantt__filters">
                <div className="cogantt__filters-row">
                    <div className="cogantt__filters-left"><FiFilter className="cogantt__filter-icon" /><span className="cogantt__filter-label">Semáforo:</span></div>
                    <div className="cogantt__filter-buttons">
                        {['green', 'yellow', 'red'].map((s) => (
                            <button key={s} className={`cogantt__filter-btn ${semaforoFilter === s ? 'cogantt__filter-btn--active' : ''}`}
                                style={{ '--f-color': semaforoColors[s], '--f-bg': `${semaforoColors[s]}18` }}
                                onClick={() => setSemaforoFilter(semaforoFilter === s ? null : s)}>
                                <span className="cogantt__filter-dot" /><span>{statusLabels[s]}</span>
                                <span className="cogantt__filter-count">{semaforoCounts[s]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="cogantt__filters-row">
                    <div className="cogantt__filters-left"><span className="cogantt__filter-label">Categoría:</span></div>
                    <div className="cogantt__filter-buttons">
                        {consumoCategories.map((cat) => (
                            <button key={cat} className={`cogantt__cat-btn ${categoryFilter === cat ? 'cogantt__cat-btn--active' : ''}`}
                                style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}>
                                <span className="cogantt__cat-dot" /><span>{cat}</span>
                                <span className="cogantt__cat-count">{categoryCounts[cat]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {hasFilters && (<button className="cogantt__clear-all" onClick={() => { setSemaforoFilter(null); setCategoryFilter(null); }}><FiX /> Limpiar filtros</button>)}
            </div>

            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                {canCreate && (<button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}><FiPlus /> Nueva Tarea</button>)}
            </div>

            <div className="cogantt__wrapper">
                <table className="cogantt__table">
                    <thead><tr>
                        <th className="cogantt__th cogantt__th--task">Actividad</th>
                        <th className="cogantt__th cogantt__th--sem">Semáforo</th>
                        {monthNames.map((m, i) => (<th key={m} className={`cogantt__th cogantt__th--month ${i === CURRENT_MONTH ? 'cogantt__th--current' : ''}`}>{m}</th>))}
                        {isAdmin && <th className="cogantt__th gantt__th--actions"></th>}
                    </tr></thead>
                    <tbody>
                        {consumoCategories.map((cat) => {
                            const tasks = grouped[cat];
                            if (!tasks || tasks.length === 0) return null;
                            const cc = categoryColors[cat];
                            return (
                                <Fragment key={cat}>
                                    <tr className="cogantt__cat-header"><td colSpan={isAdmin ? 15 : 14} className="cogantt__cat-header-cell" style={{ '--cat-color': cc }}>
                                        <span className="cogantt__cat-header-dot" /><span>{cat}</span><span className="cogantt__cat-header-count">{tasks.length}</span>
                                    </td></tr>
                                    {tasks.map((task, idx) => (
                                        <tr key={task.id} className={`cogantt__row ${hoveredTask === task.id ? 'cogantt__row--hover' : ''}`}
                                            style={{ animationDelay: `${idx * 0.03}s` }}
                                            onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)}>
                                            <td className="cogantt__td cogantt__td--task"><span className="cogantt__task-name">{task.name}</span>{task.note && <span className="cogantt__task-note">{task.note}</span>}</td>
                                            <td className="cogantt__td cogantt__td--sem">
                                                {(() => {
                                                    const eff = getDeptStatus(task.id, task.semaforo);
                                                    const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                    const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                    return (<span className="cogantt__sem-pill" style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: isAdmin ? 'pointer' : 'default' }}
                                                        onClick={isAdmin ? () => cycleDeptStatus(task.id, task.semaforo) : undefined}
                                                        title={isAdmin ? 'Click para cambiar estado' : undefined}>
                                                        <span className="cogantt__sem-dot" />{el}</span>);
                                                })()}
                                            </td>
                                            {monthNames.map((_, mi) => {
                                                const active = Array.isArray(task.months) && task.months.includes(mi);
                                                const isCurrent = mi === CURRENT_MONTH;
                                                return (<td key={mi} className={`cogantt__td cogantt__td--cell ${isCurrent ? 'cogantt__td--current-col' : ''}`}>
                                                    {active && (<div className="cogantt__block" style={{
                                                        background: `linear-gradient(135deg, ${cc}, ${cc}cc)`,
                                                        boxShadow: hoveredTask === task.id ? `0 2px 12px ${cc}40` : 'none',
                                                    }} />)}
                                                </td>);
                                            })}
                                            {isAdmin && (<td className="cogantt__td gantt__td--actions"><button className="gantt__delete-btn" onClick={() => handleDeleteClick(task)} title="Eliminar tarea"><FiTrash2 /></button></td>)}
                                        </tr>
                                    ))}
                                </Fragment>
                            );
                        })}
                        {filtered.length === 0 && (<tr><td colSpan={isAdmin ? 15 : 14} className="cogantt__empty"><span className="cogantt__empty-icon">🔍</span><p>No hay actividades con estos filtros</p></td></tr>)}
                    </tbody>
                </table>
            </div>

            <div className="cogantt__current-info"><span className="cogantt__current-dot" />Mes actual: <strong>{monthNames[CURRENT_MONTH]} 2026</strong></div>

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} fixedDepartment={DEPT_NAME} />
            {deleteTarget && <DeleteConfirmDialog taskName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} loading={deleteLoading} />}
        </div>
    );
}
