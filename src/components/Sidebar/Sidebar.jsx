import { NavLink, useLocation } from 'react-router-dom';
import {
    FiGrid,
    FiBarChart2,
    FiMonitor,
    FiMapPin,
    FiHeart,
    FiMic,
    FiTool,
    FiUsers,
    FiDollarSign,
    FiTrendingUp,
    FiShoppingCart,
    FiBriefcase,
    FiChevronLeft,
    FiChevronRight,
    FiChevronDown,
    FiMenu,
    FiX,
    FiLogOut,
} from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import useObservationRead from '../../hooks/useObservationRead';
import { fetchAllActivities } from '../../services/api';
import NotificationBell from '../NotificationBell/NotificationBell';
import './Sidebar.css';

const topItems = [
    { to: '/', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/reportes', icon: <FiBarChart2 />, label: 'Reportes' },
];

const deptItems = [
    { to: '/coordinacion-general', icon: <FiBriefcase />, label: 'Coord. General', deptKey: 'Coordinación General' },
    { to: '/sistemas', icon: <FiMonitor />, label: 'Sistemas', deptKey: 'Sistemas' },
    { to: '/turismo', icon: <FiMapPin />, label: 'Turismo', deptKey: 'Turismo' },
    { to: '/salud', icon: <FiHeart />, label: 'Salud', deptKey: 'Salud y Recreación' },
    { to: '/comunicacion', icon: <FiMic />, label: 'Comunicación', deptKey: 'Comunicación y Marketing' },
    { to: '/mantenimiento', icon: <FiTool />, label: 'Mantenimiento', deptKey: 'Mantenimiento' },
    { to: '/gestion', icon: <FiUsers />, label: 'Gestión', deptKey: 'Gestión de Asociados' },
    { to: '/finanzas', icon: <FiDollarSign />, label: 'Finanzas', deptKey: 'Finanzas' },
    { to: '/crecimiento', icon: <FiTrendingUp />, label: 'Crecimiento', deptKey: 'Crecimiento' },
    { to: '/consumo', icon: <FiShoppingCart />, label: 'Consumo', deptKey: 'Consumo' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [deptsOpen, setDeptsOpen] = useState(true);
    const location = useLocation();
    const { user, token, logout } = useAuth();
    const { hasUnread } = useObservationRead();

    // ── Fetch activities to determine unread observations per dept ──
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (!token) return;
        fetchAllActivities()
            .then(setActivities)
            .catch((err) => console.error('Sidebar: error cargando actividades:', err));
    }, [token]);

    // Build a Set of department names that have at least one activity with unread observations
    const deptsWithUnread = useMemo(() => {
        const result = new Set();
        activities.forEach((act) => {
            const obsCount = act.observations?.length || 0;
            if (obsCount > 0 && hasUnread(act.id, obsCount)) {
                result.add(act.department);
            }
        });
        return result;
    }, [activities, hasUnread]);

    // Filtrar departamentos según permisos del usuario
    const visibleDepts = user?.role === 'admin'
        ? deptItems
        : deptItems.filter((d) => (user?.departments || []).includes(d.deptKey));

    // Cerrar sidebar móvil al cambiar de ruta
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const renderLink = (item) => (
        <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
        >
            <span className="sidebar__link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
            {item.deptKey && deptsWithUnread.has(item.deptKey) && (
                <span className="sidebar__unread-dot" title="Observaciones sin leer" />
            )}
        </NavLink>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                className="sidebar__mobile-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
            >
                <FiMenu />
            </button>

            {/* Backdrop overlay */}
            {mobileOpen && (
                <div
                    className="sidebar__backdrop"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
                <div className="sidebar__header">
                    <div className="sidebar__logo">
                        <span className="sidebar__logo-icon">🚦</span>
                        {!collapsed && <span className="sidebar__logo-text">Semáforo</span>}
                    </div>
                    <div className="sidebar__header-actions">
                        {!collapsed && <NotificationBell />}
                        {/* Desktop collapsed toggle */}
                        <button
                            className="sidebar__toggle"
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                        >
                            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                        </button>
                        {/* Mobile close */}
                        <button
                            className="sidebar__mobile-close"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Cerrar menú"
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                <nav className="sidebar__nav">
                    {/* ── Links solo para admin ── */}
                    {user?.role === 'admin' && topItems.map(renderLink)}

                    {/* ── Departamentos group ── */}
                    {!collapsed && (
                        <button
                            className={`sidebar__group-toggle ${deptsOpen ? 'sidebar__group-toggle--open' : ''}`}
                            onClick={() => setDeptsOpen(!deptsOpen)}
                        >
                            <span className="sidebar__group-label">Departamentos</span>
                            <FiChevronDown className="sidebar__group-chevron" />
                        </button>
                    )}

                    <div className={`sidebar__group ${deptsOpen || collapsed ? 'sidebar__group--open' : ''}`}>
                        {visibleDepts.map(renderLink)}
                    </div>
                </nav>

                <div className="sidebar__footer">
                    {!collapsed && user && (
                        <div className="sidebar__user-info">
                            <p className="sidebar__user-name">{user.displayName || user.email}</p>
                            <p className="sidebar__user-role">{user.role === 'admin' ? 'Administrador' : 'Coordinador'}</p>
                        </div>
                    )}
                    <button
                        className="sidebar__logout"
                        onClick={logout}
                        title="Cerrar sesión"
                    >
                        <FiLogOut />
                        {!collapsed && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
