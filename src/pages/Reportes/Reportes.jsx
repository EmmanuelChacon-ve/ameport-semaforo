import { useMemo } from 'react';
import { FiBarChart2, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { currentMonthLabel } from '../../utils/semaforoUtils';
import useDashboardData from '../../hooks/useDashboardData';
import { useTasks } from '../../context/TaskContext';
import AnimatedCounter from '../../components/AnimatedCounter/AnimatedCounter';
import './Reportes.css';

export default function Reportes() {
    const { getDeptStatus } = useTasks();
    const { departmentSections, loading, error } = useDashboardData();

    /* ── Build department stats with override-aware status ── */
    const deptStats = useMemo(() => {
        return departmentSections.map((dept) => {
            const total = dept.tasks.length;
            let completed = 0;
            let inProgress = 0;
            let delayed = 0;

            dept.tasks.forEach((t) => {
                const eff = getDeptStatus(t.id, t.semaforo);
                if (eff === 'green') completed++;
                else if (eff === 'yellow') inProgress++;
                else if (eff === 'red') delayed++;
            });

            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                name: dept.name,
                icon: dept.icon,
                color: dept.color,
                coordinator: dept.coordinator,
                total,
                completed,
                inProgress,
                delayed,
                pct,
            };
        });
    }, [getDeptStatus, departmentSections]);

    /* ── Global aggregates ── */
    const totals = useMemo(() => {
        const t = { total: 0, completed: 0, inProgress: 0, delayed: 0 };
        deptStats.forEach((d) => {
            t.total += d.total;
            t.completed += d.completed;
            t.inProgress += d.inProgress;
            t.delayed += d.delayed;
        });
        t.pct = t.total > 0 ? Math.round((t.completed / t.total) * 100) : 0;
        return t;
    }, [deptStats]);

    /* ── Sorted by completion for ranking ── */
    const ranked = useMemo(() => [...deptStats].sort((a, b) => b.pct - a.pct), [deptStats]);

    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    /* ── Loading / error states ── */
    if (loading) {
        return (
            <div className="reportes page-enter">
                <header className="reportes__header">
                    <div className="reportes__header-left">
                        <div className="reportes__icon-wrapper"><FiBarChart2 /></div>
                        <div>
                            <h1 className="reportes__title">Reportes</h1>
                            <p className="reportes__subtitle">Cargando datos...</p>
                        </div>
                    </div>
                </header>
                <main className="reportes__content">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
                        <div className="cogantt__spinner" />
                        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Cargando reportes...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reportes page-enter">
                <header className="reportes__header">
                    <div className="reportes__header-left">
                        <div className="reportes__icon-wrapper"><FiBarChart2 /></div>
                        <div>
                            <h1 className="reportes__title">Reportes</h1>
                            <p className="reportes__subtitle">Error al cargar datos</p>
                        </div>
                    </div>
                </header>
                <main className="reportes__content">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>⚠️</span>
                        <p style={{ color: '#ef4444', fontSize: '1rem' }}>Error: {error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="reportes page-enter">
            {/* ── Header ── */}
            <header className="reportes__header">
                <div className="reportes__header-left">
                    <div className="reportes__icon-wrapper"><FiBarChart2 /></div>
                    <div>
                        <h1 className="reportes__title">Reportes</h1>
                        <p className="reportes__subtitle">Resumen ejecutivo de seguimiento — {currentMonthLabel} 2026</p>
                    </div>
                </div>
                <div className="reportes__header-right">
                    <div className="reportes__date">
                        <FiCalendar className="reportes__date-icon" />
                        <span>{today}</span>
                    </div>
                </div>
            </header>

            <main className="reportes__content">
                {/* ── Summary Cards ── */}
                <section className="reportes__summary">
                    <div className="reportes__card reportes__card--main">
                        <div className="reportes__card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                            <FiTrendingUp />
                        </div>
                        <div className="reportes__card-body">
                            <span className="reportes__card-value"><AnimatedCounter target={totals.pct} />%</span>
                            <span className="reportes__card-label">Cumplimiento General</span>
                        </div>
                    </div>
                    <div className="reportes__card">
                        <div className="reportes__card-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                            <FiCheckCircle />
                        </div>
                        <div className="reportes__card-body">
                            <span className="reportes__card-value"><AnimatedCounter target={totals.completed} /></span>
                            <span className="reportes__card-label">Realizadas</span>
                        </div>
                    </div>
                    <div className="reportes__card">
                        <div className="reportes__card-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                            <FiClock />
                        </div>
                        <div className="reportes__card-body">
                            <span className="reportes__card-value"><AnimatedCounter target={totals.inProgress} /></span>
                            <span className="reportes__card-label">En Proceso</span>
                        </div>
                    </div>
                    <div className="reportes__card">
                        <div className="reportes__card-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                            <FiAlertCircle />
                        </div>
                        <div className="reportes__card-body">
                            <span className="reportes__card-value"><AnimatedCounter target={totals.delayed} /></span>
                            <span className="reportes__card-label">Atrasadas</span>
                        </div>
                    </div>
                </section>

                {/* ── Charts ── */}
                <section className="reportes__charts">
                    {/* Semáforo Distribution Donut */}
                    <div className="reportes__chart-card">
                        <h2 className="reportes__section-title">Distribución de Estados</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Realizadas', value: totals.completed, color: '#10B981' },
                                        { name: 'En Proceso', value: totals.inProgress, color: '#F59E0B' },
                                        { name: 'Atrasadas', value: totals.delayed, color: '#EF4444' },
                                    ].filter(d => d.value > 0)}
                                    cx="50%" cy="50%"
                                    innerRadius={65} outerRadius={105}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {[
                                        { color: '#10B981' },
                                        { color: '#F59E0B' },
                                        { color: '#EF4444' },
                                    ].filter((_, i) => [totals.completed, totals.inProgress, totals.delayed][i] > 0)
                                        .map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [`${value} actividades`, name]}
                                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.82rem' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '0.82rem', paddingTop: 12 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Department Progress Bar Chart */}
                    <div className="reportes__chart-card">
                        <h2 className="reportes__section-title">Avance por Departamento</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={ranked.map(d => ({ name: d.name.length > 12 ? d.name.slice(0, 12) + '…' : d.name, '% Avance': d.pct, fill: d.color }))}
                                layout="vertical"
                                margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: '#475569' }} />
                                <Tooltip
                                    formatter={(value) => [`${value}%`, 'Cumplimiento']}
                                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.82rem' }}
                                />
                                <Bar dataKey="% Avance" radius={[0, 6, 6, 0]} barSize={20}>
                                    {ranked.map((dept, i) => (
                                        <Cell key={i} fill={dept.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* ── Department Ranking ── */}
                <section className="reportes__ranking">
                    <h2 className="reportes__section-title">Cumplimiento por Departamento</h2>
                    <div className="reportes__bars">
                        {ranked.map((dept, i) => (
                            <div key={dept.name} className="reportes__bar-row" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="reportes__bar-info">
                                    <span className="reportes__bar-rank">#{i + 1}</span>
                                    <span className="reportes__bar-icon">{dept.icon}</span>
                                    <span className="reportes__bar-name">{dept.name}</span>
                                    <span className="reportes__bar-coord">{dept.coordinator}</span>
                                </div>
                                <div className="reportes__bar-track">
                                    <div
                                        className="reportes__bar-fill"
                                        style={{
                                            width: `${dept.pct}%`,
                                            background: `linear-gradient(90deg, ${dept.color}, ${dept.color}cc)`,
                                        }}
                                    />
                                </div>
                                <span className="reportes__bar-pct" style={{ color: dept.color }}>
                                    {dept.pct}%
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Department Detail Table ── */}
                <section className="reportes__detail">
                    <h2 className="reportes__section-title">Detalle por Departamento</h2>
                    <div className="reportes__table-wrap">
                        <table className="reportes__table">
                            <thead>
                                <tr>
                                    <th className="reportes__th">Departamento</th>
                                    <th className="reportes__th reportes__th--center">Total</th>
                                    <th className="reportes__th reportes__th--center">✅ Realizadas</th>
                                    <th className="reportes__th reportes__th--center">🔄 En Proceso</th>
                                    <th className="reportes__th reportes__th--center">⚠️ Atrasadas</th>
                                    <th className="reportes__th reportes__th--center">% Cumplimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranked.map((dept) => (
                                    <tr key={dept.name} className="reportes__tr">
                                        <td className="reportes__td">
                                            <span className="reportes__td-icon">{dept.icon}</span>
                                            <span className="reportes__td-name">{dept.name}</span>
                                        </td>
                                        <td className="reportes__td reportes__td--center">{dept.total}</td>
                                        <td className="reportes__td reportes__td--center">
                                            <span className="reportes__td-badge reportes__td-badge--green">{dept.completed}</span>
                                        </td>
                                        <td className="reportes__td reportes__td--center">
                                            <span className="reportes__td-badge reportes__td-badge--yellow">{dept.inProgress}</span>
                                        </td>
                                        <td className="reportes__td reportes__td--center">
                                            <span className="reportes__td-badge reportes__td-badge--red">{dept.delayed}</span>
                                        </td>
                                        <td className="reportes__td reportes__td--center">
                                            <span
                                                className="reportes__td-pct"
                                                style={{
                                                    color: dept.pct >= 70 ? '#10B981' : dept.pct >= 40 ? '#F59E0B' : '#EF4444',
                                                }}
                                            >
                                                {dept.pct}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="reportes__tr reportes__tr--total">
                                    <td className="reportes__td reportes__td--total-label">Total General</td>
                                    <td className="reportes__td reportes__td--center reportes__td--bold">{totals.total}</td>
                                    <td className="reportes__td reportes__td--center reportes__td--bold">{totals.completed}</td>
                                    <td className="reportes__td reportes__td--center reportes__td--bold">{totals.inProgress}</td>
                                    <td className="reportes__td reportes__td--center reportes__td--bold">{totals.delayed}</td>
                                    <td className="reportes__td reportes__td--center">
                                        <span className="reportes__td-pct reportes__td-pct--total">{totals.pct}%</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
