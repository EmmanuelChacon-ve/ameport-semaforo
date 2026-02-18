import { useTasks } from '../../context/TaskContext';
import { STATUS_CONFIG } from '../../utils/semaforoUtils';
import './DeptSection.css';

export default function DeptSection({ department }) {
    const { getDeptStatus, cycleDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS, isAdmin } = useTasks();

    return (
        <div className="dept-section" style={{ '--dept-color': department.color }}>
            {/* ── Header ── */}
            <div className="dept-section__header">
                <div className="dept-section__title-row">
                    <span className="dept-section__icon">{department.icon}</span>
                    <h3 className="dept-section__name">{department.name}</h3>
                    <span className="dept-section__badge">
                        {department.tasks.length} actividad{department.tasks.length !== 1 ? 'es' : ''}
                    </span>
                </div>
                <div className="dept-section__coordinator">
                    <span className="dept-section__coord-label">Coordinador</span>
                    <div className="dept-section__coord-info">
                        <div className="dept-section__coord-avatar">
                            {department.coordinator[0]}
                        </div>
                        <span className="dept-section__coord-name">{department.coordinator}</span>
                    </div>
                </div>
            </div>

            {/* ── Activities list ── */}
            {department.tasks.length === 0 ? (
                <div className="dept-section__empty">
                    <span>📋</span>
                    <p>Sin actividades este mes</p>
                </div>
            ) : (
                <div className="dept-section__table-wrap">
                    <table className="dept-section__table">
                        <thead>
                            <tr>
                                <th className="dept-section__th dept-section__th--num">#</th>
                                <th className="dept-section__th">Actividad</th>
                                <th className="dept-section__th dept-section__th--status">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {department.tasks.map((task, i) => {
                                const eff = getDeptStatus(task.id, task.semaforo);
                                const color = DEPT_SEMAFORO_COLORS[eff] || STATUS_CONFIG[task.status]?.color || '#64748b';
                                const label = DEPT_SEMAFORO_LABELS[eff] || task.status;

                                return (
                                    <tr key={task.id} className="dept-section__row">
                                        <td className="dept-section__td dept-section__td--num">{i + 1}</td>
                                        <td className="dept-section__td dept-section__td--name">{task.name}</td>
                                        <td className="dept-section__td dept-section__td--status">
                                            <span
                                                className={`dept-section__pill ${!isAdmin ? 'dept-section__pill--readonly' : ''}`}
                                                style={{
                                                    '--pill-color': color,
                                                    '--pill-bg': `${color}15`,
                                                }}
                                                onClick={isAdmin ? () => cycleDeptStatus(task.id, task.semaforo) : undefined}
                                                title={isAdmin ? 'Click para cambiar estado' : undefined}
                                            >
                                                <span className="dept-section__pill-dot" />
                                                {label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
