import { useState, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { monthNames } from '../../utils/semaforoUtils';
import { useTasks } from '../../context/TaskContext';
import useObservationRead from '../../hooks/useObservationRead';
import ObservationIndicator from '../ObservationIndicator/ObservationIndicator';
import ObservationPrompt from '../ObservationPrompt/ObservationPrompt';
import { FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import './AdminDeptTable.css';

const CURRENT_MONTH = new Date().getMonth();

/**
 * AdminDeptTable — Executive table view replacing Gantt bars for admin users.
 *
 * Props:
 *   tasks           — array from useGanttData (with semaforo)
 *   departmentName  — e.g. 'Finanzas'
 *   categoryColors  — { [catName]: '#hex' }
 *   onDeleteClick   — (task) => void
 */
export default function AdminDeptTable({ tasks, departmentName, categoryColors = {}, onDeleteClick }) {
    const {
        getDeptStatus, cycleDeptStatus,
        DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS,
        pendingObservation, confirmObservation, cancelObservation,
    } = useTasks();
    const { hasUnread } = useObservationRead();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');

    /* ── Filter by search ── */
    const filtered = useMemo(() => {
        if (!search.trim()) return tasks;
        const q = search.toLowerCase();
        return tasks.filter((t) => t.name.toLowerCase().includes(q));
    }, [tasks, search]);

    /* ── Group by category ── */
    const { categories, grouped } = useMemo(() => {
        const catSet = new Map();
        filtered.forEach((t) => {
            const cat = t.category || 'Sin categoría';
            if (!catSet.has(cat)) catSet.set(cat, []);
            catSet.get(cat).push(t);
        });
        return { categories: [...catSet.keys()], grouped: Object.fromEntries(catSet) };
    }, [filtered]);

    /* ── Helpers ── */
    const formatMonth = (monthIdx) => {
        if (monthIdx === null || monthIdx === undefined) return '—';
        return monthNames[monthIdx] || '—';
    };

    const calcDesvio = (endMonth) => {
        if (endMonth === null || endMonth === undefined) return null;
        const diff = endMonth - CURRENT_MONTH;
        return diff;
    };

    /* ── Global row counter ── */
    let rowNum = 0;

    return (
        <>
            {/* ── Search bar ── */}
            <div className="adm-table__search-bar">
                <div className="adm-table__search-wrap">
                    <FiSearch className="adm-table__search-icon" />
                    <input
                        className="adm-table__search-input"
                        type="text"
                        placeholder="Buscar actividad..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <span className="adm-table__count">
                    {filtered.length} de {tasks.length} actividades
                </span>
            </div>

            {/* ── Table ── */}
            <div className="adm-table__wrapper">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th className="adm-table__th adm-table__th--num">#</th>
                            <th className="adm-table__th adm-table__th--name">Actividad</th>
                            <th className="adm-table__th adm-table__th--date">Inicio</th>
                            <th className="adm-table__th adm-table__th--date">Compromiso</th>
                            <th className="adm-table__th adm-table__th--progress">Avance</th>
                            <th className="adm-table__th adm-table__th--status">Estado</th>
                            <th className="adm-table__th adm-table__th--deviation">Desvío</th>
                            <th className="adm-table__th adm-table__th--milestone">Próximo Hito</th>
                            <th className="adm-table__th adm-table__th--actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => {
                            const catTasks = grouped[cat];
                            const catColor = categoryColors[cat] || '#6366f1';
                            return (
                                <Fragment key={cat}>
                                    {/* ── Category header row ── */}
                                    <tr className="adm-table__cat-header">
                                        <td colSpan={9} className="adm-table__cat-header-cell" style={{ '--cat-color': catColor }}>
                                            <span className="adm-table__cat-header-dot" />
                                            <span className="adm-table__cat-header-name">{cat}</span>
                                            <span className="adm-table__cat-header-count">{catTasks.length} actividades</span>
                                        </td>
                                    </tr>
                                    {/* ── Tasks in category ── */}
                                    {catTasks.map((task) => {
                                        rowNum++;
                                        const eff = getDeptStatus(task.id, task.semaforo);
                                        const statusColor = DEPT_SEMAFORO_COLORS[eff];
                                        const statusLabel = DEPT_SEMAFORO_LABELS[eff];
                                        const desvio = calcDesvio(task.endMonth);

                                        return (
                                            <tr
                                                key={task.id}
                                                className="adm-table__row"
                                                style={{ animationDelay: `${rowNum * 0.03}s` }}
                                            >
                                                <td className="adm-table__td adm-table__td--num">{rowNum}</td>
                                                <td className="adm-table__td adm-table__td--name">
                                                    <span className="adm-table__task-main">{task.name}</span>
                                                    {(task.observations?.length > 0) && (
                                                        <ObservationIndicator activityId={task.id} count={task.observations.length} />
                                                    )}
                                                </td>
                                                <td className="adm-table__td adm-table__td--date">{formatMonth(task.startMonth)}</td>
                                                <td className="adm-table__td adm-table__td--date">{formatMonth(task.endMonth)}</td>
                                                <td className="adm-table__td adm-table__td--progress">
                                                    <div className="adm-table__progress-wrap">
                                                        <div className="adm-table__progress-bar">
                                                            <div
                                                                className="adm-table__progress-fill"
                                                                style={{
                                                                    width: `${task.progress ?? 0}%`,
                                                                    background: (task.progress ?? 0) >= 100 ? '#22c55e' : '#6366f1',
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="adm-table__progress-text" style={{ color: (task.progress ?? 0) >= 100 ? '#22c55e' : '#6366f1' }}>
                                                            {task.progress ?? 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="adm-table__td adm-table__td--status">
                                                    <span
                                                        className="adm-table__status-pill"
                                                        style={{ '--s-color': statusColor, '--s-bg': `${statusColor}18` }}
                                                        onClick={() => cycleDeptStatus(task.id, task.semaforo, task.name)}
                                                        title="Click para cambiar estado"
                                                    >
                                                        <span className="adm-table__status-dot" />
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td className="adm-table__td adm-table__td--deviation">
                                                    {desvio !== null && (
                                                        <span className={`adm-table__desvio ${desvio < 0 ? 'adm-table__desvio--late' : desvio === 0 ? 'adm-table__desvio--now' : 'adm-table__desvio--ok'}`}>
                                                            {desvio > 0 ? `+${desvio}` : desvio} {Math.abs(desvio) === 1 ? 'mes' : 'meses'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="adm-table__td adm-table__td--milestone">
                                                    {task.nextMilestoneTitle ? (
                                                        <div className="adm-table__next-milestone">
                                                            <span className="adm-table__next-milestone-title">{task.nextMilestoneTitle}</span>
                                                            {task.nextMilestoneDate && (
                                                                <span className="adm-table__next-milestone-date">
                                                                    {new Date(task.nextMilestoneDate + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="adm-table__next-milestone--empty">—</span>
                                                    )}
                                                </td>
                                                <td className="adm-table__td adm-table__td--actions">
                                                    <div className="adm-table__actions-row">
                                                        <button
                                                            className="adm-table__action-btn adm-table__action-btn--view"
                                                            onClick={() => navigate(`/actividad/${task.id}`)}
                                                            title="Ver detalle"
                                                        >
                                                            <FiEye />
                                                        </button>
                                                        {onDeleteClick && (
                                                            <button
                                                                className="adm-table__action-btn adm-table__action-btn--delete"
                                                                onClick={() => onDeleteClick(task)}
                                                                title="Eliminar"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </Fragment>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={9} className="adm-table__empty">
                                    <span className="adm-table__empty-icon">🔍</span>
                                    <p>No hay actividades{search ? ' con esta búsqueda' : ''}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Modals ── */}
            {pendingObservation && (
                <ObservationPrompt
                    currentStatus={pendingObservation.currentStatus}
                    activityName={pendingObservation.taskName}
                    onConfirm={confirmObservation}
                    onCancel={cancelObservation}
                />
            )}
        </>
    );
}
