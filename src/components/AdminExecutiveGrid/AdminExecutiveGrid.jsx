import { Fragment, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { monthNames } from '../../utils/semaforoUtils';
import { useTasks } from '../../context/TaskContext';
import ObservationIndicator from '../ObservationIndicator/ObservationIndicator';
import { FiEye, FiPrinter } from 'react-icons/fi';
import printTable from '../../utils/printTable';

import './AdminExecutiveGrid.css';

const CURRENT_MONTH = new Date().getMonth();

/**
 * AdminExecutiveGrid — Executive summary grid for the admin Dashboard.
 *
 * Shows all departments with their activities in a single table,
 * grouped by department with colored header rows.
 *
 * Props:
 *   sections — array of { name, coordinator, color, icon, tasks[] }
 *              (already filtered by dashboard semáforo / dept / search filters)
 */
export default function AdminExecutiveGrid({ sections }) {
    const navigate = useNavigate();
    const {
        getDeptStatus, getDeptDetailedStatus, cycleDeptStatus,
        DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS,
    } = useTasks();
    const tableRef = useRef(null);

    /* ── Format helpers ── */
    const formatMonth = (monthIdx) => {
        if (monthIdx === null || monthIdx === undefined) return '—';
        return monthNames[monthIdx] || '—';
    };

    const calcDesvio = (endMonth) => {
        if (endMonth === null || endMonth === undefined) return null;
        return endMonth - CURRENT_MONTH;
    };

    /* ── Global row counter ── */
    let rowNum = 0;

    /* ── Total tasks count ── */
    const totalTasks = useMemo(() => sections.reduce((s, d) => s + d.tasks.length, 0), [sections]);

    return (
        <div className="aeg__wrapper">
            <div className="aeg__toolbar">
                <span className="aeg__toolbar-total">{totalTasks} actividades totales</span>
                <button className="grid-print-btn" onClick={() => printTable(tableRef.current, 'Dashboard Ejecutivo')}>
                    <FiPrinter size={14} /> Imprimir
                </button>

            </div>
            <div ref={tableRef}>
                <table className="aeg__table">
                    <thead>
                        <tr>
                            <th className="aeg__th aeg__th--num">#</th>
                            <th className="aeg__th aeg__th--name">Actividad</th>
                            <th className="aeg__th aeg__th--date">Inicio</th>
                            <th className="aeg__th aeg__th--date">Compromiso</th>
                            <th className="aeg__th aeg__th--progress">Avance</th>
                            <th className="aeg__th aeg__th--status">Estado</th>
                            <th className="aeg__th aeg__th--deviation">Desvío</th>
                            <th className="aeg__th aeg__th--milestone">Próximo Hito</th>
                            <th className="aeg__th aeg__th--actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((dept) => {
                            if (!dept.tasks || dept.tasks.length === 0) return null;
                            return (
                                <Fragment key={dept.name}>
                                    {/* ── Department header ── */}
                                    <tr className="aeg__dept-header">
                                        <td colSpan={9} className="aeg__dept-header-cell" style={{ '--dept-color': dept.color || '#6366f1' }}>
                                            <span className="aeg__dept-header-icon">{dept.icon}</span>
                                            <span className="aeg__dept-header-name">{dept.name}</span>
                                            {dept.coordinator && (
                                                <span className="aeg__dept-header-coord">— {dept.coordinator}</span>
                                            )}
                                            <span className="aeg__dept-header-count">{dept.tasks.length} actividades</span>
                                        </td>
                                    </tr>

                                    {/* ── Tasks ── */}
                                    {dept.tasks.map((task) => {
                                        rowNum++;
                                        const eff = getDeptDetailedStatus(task.id, task.semaforo);
                                        const statusColor = DEPT_SEMAFORO_COLORS[eff];
                                        const statusLabel = DEPT_SEMAFORO_LABELS[eff];
                                        const desvio = calcDesvio(task.endMonth);

                                        return (
                                            <tr
                                                key={task.id}
                                                className="aeg__row"
                                                style={{ animationDelay: `${rowNum * 0.025}s` }}
                                            >
                                                <td className="aeg__td aeg__td--num">{rowNum}</td>
                                                <td className="aeg__td aeg__td--name">
                                                    <span className="aeg__task-name">{task.name}</span>
                                                    {(task.observations?.length > 0) && (
                                                        <ObservationIndicator activityId={task.id} count={task.observations.length} />
                                                    )}
                                                </td>
                                                <td className="aeg__td aeg__td--date">{formatMonth(task.startMonth)}</td>
                                                <td className="aeg__td aeg__td--date">{formatMonth(task.endMonth)}</td>
                                                <td className="aeg__td aeg__td--progress">
                                                    <div className="aeg__progress-wrap">
                                                        <div className="aeg__progress-bar">
                                                            <div
                                                                className="aeg__progress-fill"
                                                                style={{
                                                                    width: `${task.progress ?? 0}%`,
                                                                    background: (task.progress ?? 0) >= 100 ? '#22c55e' : '#6366f1',
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="aeg__progress-text" style={{ color: (task.progress ?? 0) >= 100 ? '#22c55e' : '#6366f1' }}>
                                                            {task.progress ?? 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="aeg__td aeg__td--status">
                                                    <span
                                                        className="aeg__status-pill"
                                                        style={{ '--s-color': statusColor, '--s-bg': `${statusColor}18` }}
                                                        onClick={() => cycleDeptStatus(task.id, task.semaforo, task.name)}
                                                        title="Click para cambiar estado"
                                                    >
                                                        <span className="aeg__status-dot" />
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td className="aeg__td aeg__td--deviation">
                                                    {desvio !== null && (
                                                        <span className={`aeg__desvio ${desvio < 0 ? 'aeg__desvio--late' : desvio === 0 ? 'aeg__desvio--now' : 'aeg__desvio--ok'}`}>
                                                            {desvio > 0 ? `+${desvio}` : desvio} {Math.abs(desvio) === 1 ? 'mes' : 'meses'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="aeg__td aeg__td--milestone">
                                                    {task.nextMilestoneTitle ? (
                                                        <div className="aeg__milestone">
                                                            <span className="aeg__milestone-title">{task.nextMilestoneTitle}</span>
                                                            {task.nextMilestoneDate && (
                                                                <span className="aeg__milestone-date">
                                                                    {new Date(task.nextMilestoneDate + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="aeg__milestone--empty">—</span>
                                                    )}
                                                </td>
                                                <td className="aeg__td aeg__td--actions">
                                                    <button
                                                        className="aeg__action-btn"
                                                        onClick={() => navigate(`/actividad/${task.id}`)}
                                                        title="Ver hitos"
                                                    >
                                                        <FiEye />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </Fragment>
                            );
                        })}
                        {totalTasks === 0 && (
                            <tr>
                                <td colSpan={9} className="aeg__empty">
                                    <span className="aeg__empty-icon">🔍</span>
                                    <p>No hay actividades con estos filtros</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
