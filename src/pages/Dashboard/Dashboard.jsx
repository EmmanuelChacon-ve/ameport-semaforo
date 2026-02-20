import { useState, useMemo } from 'react';
import Header from '../../components/Header/Header';
import AdminExecutiveGrid from '../../components/AdminExecutiveGrid/AdminExecutiveGrid';
import AnimatedCounter from '../../components/AnimatedCounter/AnimatedCounter';
import { currentMonthLabel } from '../../utils/semaforoUtils';
import useDashboardData from '../../hooks/useDashboardData';
import { useTasks } from '../../context/TaskContext';
import { FiFilter, FiX, FiSearch, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi';
import StatusRequestsPanel from '../../components/StatusRequestsPanel/StatusRequestsPanel';
import ObservationPrompt from '../../components/ObservationPrompt/ObservationPrompt';
import './Dashboard.css';

/* ── Semáforo card definitions ──
   Grouped by effective semáforo colors from getDeptStatus:
   green = Realizado, yellow = A tiempo (En Curso + Pendiente),
   red = Atrasado (Atrasado + No Realizado)
*/
const SEMAFORO_CARDS = [
    {
        key: 'atrasadas',
        semColors: ['red'],
        label: 'Atrasadas',
        subtitle: 'Requieren atención inmediata',
        icon: FiAlertCircle,
        color: '#EF4444',
        bg: '#FEF2F2',
        border: '#FECACA',
    },
    {
        key: 'a_tiempo',
        semColors: ['yellow'],
        label: 'A Tiempo',
        subtitle: 'En curso o pendientes',
        icon: FiClock,
        color: '#F59E0B',
        bg: '#FFFBEB',
        border: '#FDE68A',
    },
    {
        key: 'realizadas',
        semColors: ['green'],
        label: 'Realizadas',
        subtitle: 'Completadas con éxito',
        icon: FiCheckCircle,
        color: '#10B981',
        bg: '#ECFDF5',
        border: '#A7F3D0',
    },
];

export default function Dashboard() {
    const [deptFilter, setDeptFilter] = useState('');
    const [search, setSearch] = useState('');
    const [semaforoFilter, setSemaforoFilter] = useState('');   // stores card key
    const { getDeptStatus, isAdmin, pendingObservation, confirmObservation, cancelObservation } = useTasks();
    const { departmentSections, allDeptNames, loading, error } = useDashboardData();

    /* ── Compute effective semáforo for each task (respects overrides) ── */
    const sectionsWithEffective = useMemo(() => {
        return departmentSections.map((dept) => ({
            ...dept,
            tasks: dept.tasks.map((t) => ({
                ...t,
                effectiveSemaforo: getDeptStatus(t.id, t.semaforo),
            })),
        }));
    }, [getDeptStatus, departmentSections]);

    /* ── Count tasks per card group ── */
    const allTasks = useMemo(() => sectionsWithEffective.flatMap((d) => d.tasks), [sectionsWithEffective]);
    const semaforoCounts = useMemo(() => {
        const counts = {};
        SEMAFORO_CARDS.forEach((c) => { counts[c.key] = 0; });
        allTasks.forEach((t) => {
            const card = SEMAFORO_CARDS.find((c) => c.semColors.includes(t.effectiveSemaforo));
            if (card) counts[card.key]++;
        });
        return counts;
    }, [allTasks]);

    /* ── Apply filters ── */
    const filtered = useMemo(() => {
        let result = sectionsWithEffective;

        if (deptFilter) {
            result = result.filter((d) => d.name === deptFilter);
        }
        if (semaforoFilter) {
            const activeCard = SEMAFORO_CARDS.find((c) => c.key === semaforoFilter);
            if (activeCard) {
                result = result
                    .map((d) => ({
                        ...d,
                        tasks: d.tasks.filter((t) => activeCard.semColors.includes(t.effectiveSemaforo)),
                    }))
                    .filter((d) => d.tasks.length > 0);
            }
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result
                .map((d) => ({
                    ...d,
                    tasks: d.tasks.filter((t) => t.name.toLowerCase().includes(q)),
                }))
                .filter((d) => d.tasks.length > 0);
        }

        return result;
    }, [deptFilter, search, semaforoFilter, sectionsWithEffective]);

    const totalActivities = filtered.reduce((sum, d) => sum + d.tasks.length, 0);
    const hasFilters = deptFilter || search || semaforoFilter;

    const clearAll = () => {
        setDeptFilter('');
        setSearch('');
        setSemaforoFilter('');
    };

    const toggleSemaforoFilter = (key) => {
        setSemaforoFilter((prev) => (prev === key ? '' : key));
    };

    /* ── Loading / error states ── */
    if (loading) {
        return (
            <div className="dashboard page-enter">
                <Header />
                <main className="dashboard__content">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
                        <div className="cogantt__spinner" />
                        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Cargando datos del dashboard...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard page-enter">
                <Header />
                <main className="dashboard__content">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', flexDirection: 'column', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>⚠️</span>
                        <p style={{ color: '#ef4444', fontSize: '1rem' }}>Error al cargar datos: {error}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard page-enter">
                <Header />
                <main className="dashboard__content">
                    {/* ── Month banner ── */}
                    <section className="dashboard__month-banner">
                        <div className="dashboard__month-info">
                            <h2 className="dashboard__month-title">Actividades del Mes</h2>
                            <span className="dashboard__month-badge">{currentMonthLabel} 2026</span>
                        </div>
                        <div className="dashboard__month-stats">
                            <div className="dashboard__stat">
                                <span className="dashboard__stat-value"><AnimatedCounter target={filtered.length} /></span>
                                <span className="dashboard__stat-label">Departamentos</span>
                            </div>
                            <div className="dashboard__stat">
                                <span className="dashboard__stat-value"><AnimatedCounter target={totalActivities} /></span>
                                <span className="dashboard__stat-label">Actividades</span>
                            </div>
                        </div>
                    </section>

                    {/* ── Semáforo Cards ── */}
                    <section className="dashboard__semaforo">
                        {SEMAFORO_CARDS.map((card) => {
                            const Icon = card.icon;
                            const isActive = semaforoFilter === card.key;
                            return (
                                <button
                                    key={card.key}
                                    className={`dashboard__sem-card ${isActive ? 'dashboard__sem-card--active' : ''}`}
                                    style={{
                                        '--sem-color': card.color,
                                        '--sem-bg': card.bg,
                                        '--sem-border': card.border,
                                    }}
                                    onClick={() => toggleSemaforoFilter(card.key)}
                                    title={isActive ? 'Quitar filtro' : `Filtrar por ${card.label}`}
                                >
                                    <div className="dashboard__sem-card-header">
                                        <Icon className="dashboard__sem-card-icon" />
                                        <span className="dashboard__sem-card-label">{card.label}</span>
                                    </div>
                                    <span className="dashboard__sem-card-count">
                                        <AnimatedCounter target={semaforoCounts[card.key]} />
                                    </span>
                                    <span className="dashboard__sem-card-sub">{card.subtitle}</span>
                                </button>
                            );
                        })}
                    </section>

                    {/* ── Filters ── */}
                    <section className="dashboard__filters">
                        <div className="dashboard__filter-row">
                            <FiFilter className="dashboard__filter-icon" />

                            <div className="dashboard__select-wrap">
                                <select
                                    className="dashboard__select"
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                >
                                    <option value="">Todos los departamentos</option>
                                    {allDeptNames.map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="dashboard__search-wrap">
                                <FiSearch className="dashboard__search-icon" />
                                <input
                                    className="dashboard__search"
                                    type="text"
                                    placeholder="Buscar actividad..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {hasFilters && (
                                <button className="dashboard__clear-btn" onClick={clearAll}>
                                    <FiX /> Limpiar
                                </button>
                            )}
                        </div>
                    </section>

                    {/* ── Admin: Status Requests Panel ── */}
                    {isAdmin && (
                        <section className="dashboard__requests">
                            <StatusRequestsPanel />
                        </section>
                    )}

                    {/* ── Executive Grid ── */}
                    <section className="dashboard__departments">
                        <AdminExecutiveGrid sections={filtered} />
                    </section>
                </main>
            </div>
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
