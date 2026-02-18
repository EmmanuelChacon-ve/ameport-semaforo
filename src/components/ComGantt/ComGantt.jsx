import { useState, useMemo, Fragment } from 'react';
import { monthNames, statusLabels, semaforoColors } from '../../utils/semaforoUtils';
import useGanttData from '../../hooks/useGanttData';
import useGanttCRUD from '../../hooks/useGanttCRUD';
import { useTasks } from '../../context/TaskContext';
import { FiFilter, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import DeleteConfirmDialog from '../DeleteConfirmDialog/DeleteConfirmDialog';
import './ComGantt.css';

const CURRENT_MONTH = new Date().getMonth();
const DEPT_NAME = 'Comunicación y Marketing';

export default function ComGantt() {
    const [semaforoFilter, setSemaforoFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const { getDeptStatus, cycleDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS } = useTasks();
    const { tasks: tasksWithStatus, categories: comCategories, categoryColors, loading, refetch } = useGanttData(DEPT_NAME);
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
        comCategories.forEach((cat) => (c[cat] = 0));
        tasksWithStatus.forEach((t) => c[t.category]++);
        return c;
    }, [tasksWithStatus, comCategories]);

    const filtered = useMemo(() => {
        let r = tasksWithStatus;
        if (semaforoFilter) r = r.filter((t) => t.semaforo === semaforoFilter);
        if (categoryFilter) r = r.filter((t) => t.category === categoryFilter);
        return r;
    }, [tasksWithStatus, semaforoFilter, categoryFilter]);

    const grouped = useMemo(() => {
        const g = {};
        comCategories.forEach((c) => (g[c] = []));
        filtered.forEach((t) => { if (g[t.category]) g[t.category].push(t); });
        return g;
    }, [filtered, comCategories]);

    const hasFilters = semaforoFilter || categoryFilter;

    if (loading) {
        return (<div className="cgantt cgantt--loading"><div className="cgantt__spinner" /><p>Cargando actividades...</p></div>);
    }

    return (
        <div className="cgantt">
            <div className="cgantt__filters">
                <div className="cgantt__filters-row">
                    <div className="cgantt__filters-left"><FiFilter className="cgantt__filter-icon" /><span className="cgantt__filter-label">Semáforo:</span></div>
                    <div className="cgantt__filter-buttons">
                        {['green', 'yellow', 'red'].map((s) => (
                            <button key={s} className={`cgantt__filter-btn ${semaforoFilter === s ? 'cgantt__filter-btn--active' : ''}`}
                                style={{ '--f-color': semaforoColors[s], '--f-bg': `${semaforoColors[s]}18` }}
                                onClick={() => setSemaforoFilter(semaforoFilter === s ? null : s)}>
                                <span className="cgantt__filter-dot" /><span>{statusLabels[s]}</span>
                                <span className="cgantt__filter-count">{semaforoCounts[s]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="cgantt__filters-row">
                    <div className="cgantt__filters-left"><span className="cgantt__filter-label">Área:</span></div>
                    <div className="cgantt__filter-buttons">
                        {comCategories.map((cat) => (
                            <button key={cat} className={`cgantt__cat-btn ${categoryFilter === cat ? 'cgantt__cat-btn--active' : ''}`}
                                style={{ '--c-color': categoryColors[cat], '--c-bg': `${categoryColors[cat]}25` }}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)} title={cat}>
                                <span className="cgantt__cat-dot" /><span className="cgantt__cat-text">{cat.length > 25 ? cat.slice(0, 22) + '…' : cat}</span>
                                <span className="cgantt__cat-count">{categoryCounts[cat]}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {hasFilters && (<button className="cgantt__clear-all" onClick={() => { setSemaforoFilter(null); setCategoryFilter(null); }}><FiX /> Limpiar filtros</button>)}
            </div>

            <div className="gantt__toolbar">
                <span className="gantt__toolbar-total">{filtered.length} de {tasksWithStatus.length} actividades</span>
                {canCreate && (<button className="gantt__create-btn" onClick={() => setShowCreateModal(true)}><FiPlus /> Nueva Tarea</button>)}
            </div>

            <div className="cgantt__wrapper">
                <table className="cgantt__table">
                    <thead><tr>
                        <th className="cgantt__th cgantt__th--task">Actividad</th>
                        <th className="cgantt__th cgantt__th--sem">Semáforo</th>
                        {monthNames.map((m, i) => (<th key={m} className={`cgantt__th cgantt__th--month ${i === CURRENT_MONTH ? 'cgantt__th--current' : ''}`}>{m}</th>))}
                        {isAdmin && <th className="cgantt__th gantt__th--actions"></th>}
                    </tr></thead>
                    <tbody>
                        {comCategories.map((cat) => {
                            const tasks = grouped[cat];
                            if (!tasks || tasks.length === 0) return null;
                            const cc = categoryColors[cat];
                            return (
                                <Fragment key={cat}>
                                    <tr className="cgantt__cat-header"><td colSpan={isAdmin ? 15 : 14} className="cgantt__cat-header-cell" style={{ '--cat-color': cc }}>
                                        <span className="cgantt__cat-header-dot" /><span>{cat}</span><span className="cgantt__cat-header-count">{tasks.length}</span>
                                    </td></tr>
                                    {tasks.map((task, idx) => (
                                        <tr key={task.id} className={`cgantt__row ${hoveredTask === task.id ? 'cgantt__row--hover' : ''}`}
                                            style={{ animationDelay: `${idx * 0.03}s` }}
                                            onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)}>
                                            <td className="cgantt__td cgantt__td--task"><span className="cgantt__task-name">{task.name}</span>{task.note && <span className="cgantt__task-note">{task.note}</span>}</td>
                                            <td className="cgantt__td cgantt__td--sem">
                                                {(() => {
                                                    const eff = getDeptStatus(task.id, task.semaforo);
                                                    const ec = DEPT_SEMAFORO_COLORS[eff] || semaforoColors[eff];
                                                    const el = DEPT_SEMAFORO_LABELS[eff] || statusLabels[eff];
                                                    return (<span className="cgantt__sem-pill" style={{ '--s-color': ec, '--s-bg': `${ec}18`, cursor: isAdmin ? 'pointer' : 'default' }}
                                                        onClick={isAdmin ? () => cycleDeptStatus(task.id, task.semaforo) : undefined}
                                                        title={isAdmin ? 'Click para cambiar estado' : undefined}>
                                                        <span className="cgantt__sem-dot" />{el}</span>);
                                                })()}
                                            </td>
                                            {monthNames.map((_, mi) => {
                                                const inRange = mi >= task.startMonth && mi <= task.endMonth;
                                                const isStart = mi === task.startMonth;
                                                const isEnd = mi === task.endMonth;
                                                return (<td key={mi} className={`cgantt__td cgantt__td--cell ${mi === CURRENT_MONTH ? 'cgantt__td--current-col' : ''}`}>
                                                    {inRange && (<div className="cgantt__bar" style={{
                                                        background: `linear-gradient(135deg, ${cc}, ${cc}cc)`,
                                                        borderRadius: `${isStart ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isEnd ? '6px' : '0'} ${isStart ? '6px' : '0'}`,
                                                        boxShadow: hoveredTask === task.id ? `0 2px 12px ${cc}40` : 'none',
                                                    }} />)}
                                                </td>);
                                            })}
                                            {isAdmin && (<td className="cgantt__td gantt__td--actions"><button className="gantt__delete-btn" onClick={() => handleDeleteClick(task)} title="Eliminar tarea"><FiTrash2 /></button></td>)}
                                        </tr>
                                    ))}
                                </Fragment>
                            );
                        })}
                        {filtered.length === 0 && (<tr><td colSpan={isAdmin ? 15 : 14} className="cgantt__empty"><span className="cgantt__empty-icon">🔍</span><p>No hay actividades con estos filtros</p></td></tr>)}
                    </tbody>
                </table>
            </div>

            <div className="cgantt__current-info"><span className="cgantt__current-dot" />Mes actual: <strong>{monthNames[CURRENT_MONTH]} 2026</strong></div>

            <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} fixedDepartment={DEPT_NAME} />
            {deleteTarget && <DeleteConfirmDialog taskName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} loading={deleteLoading} />}
        </div>
    );
}
