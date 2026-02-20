import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiAlertTriangle, FiMessageSquare, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { fetchAllActivities, fetchStatusRequests } from '../../services/api';
import useObservationRead from '../../hooks/useObservationRead';
import './NotificationBell.css';

/* ── Department → route mapping ── */
const DEPT_ROUTES = {
    'Sistemas': '/sistemas',
    'Turismo': '/turismo',
    'Salud y Recreación': '/salud',
    'Comunicación y Marketing': '/comunicacion',
    'Mantenimiento': '/mantenimiento',
    'Gestión de Asociados': '/gestion',
    'Finanzas': '/finanzas',
    'Crecimiento': '/crecimiento',
    'Consumo': '/consumo',
};

const DISMISSED_KEY = 'notif_dismissed';

function loadDismissed() {
    try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'); } catch { return []; }
}

export default function NotificationBell() {
    const { user, token } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Only render for admins
    if (!isAdmin) return null;

    return <NotificationBellInner token={token} />;
}

function NotificationBellInner({ token }) {
    const [open, setOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
    const [dismissedIds, setDismissedIds] = useState(loadDismissed);
    const bellRef = useRef(null);
    const panelRef = useRef(null);
    const navigate = useNavigate();
    const { getDeptStatus } = useTasks();
    const { hasUnread } = useObservationRead();

    /* ── Fetch data ── */
    const loadData = useCallback(async () => {
        if (!token) return;
        try {
            const [acts, reqs] = await Promise.all([
                fetchAllActivities(),
                fetchStatusRequests('pending'),
            ]);
            setActivities(acts);
            setPendingRequests(reqs);
        } catch (err) {
            console.error('NotificationBell: fetch error', err);
        }
    }, [token]);

    useEffect(() => { loadData(); }, [loadData]);

    // Refresh every 60s
    useEffect(() => {
        const id = setInterval(loadData, 60000);
        return () => clearInterval(id);
    }, [loadData]);

    /* ── Build notifications (excluding dismissed) ── */
    const notifications = useMemo(() => {
        const items = [];

        // 1. Pending status change requests
        pendingRequests.forEach((r) => {
            items.push({
                id: `sr-${r.id}`,
                type: 'request',
                icon: <FiRefreshCw />,
                text: `Solicitud de cambio: "${r.activityName || 'Actividad'}"`,
                sub: `${r.requestedByName || 'Coordinador'} → ${r.requestedStatus}`,
                dept: r.department,
                color: '#8B5CF6',
            });
        });

        // 2. Delayed activities
        activities.forEach((act) => {
            const eff = getDeptStatus(act.id, act.sempioro || act.semaforo);
            if (eff === 'red') {
                items.push({
                    id: `delayed-${act.id}`,
                    type: 'delayed',
                    icon: <FiAlertTriangle />,
                    text: `"${act.name}" está atrasada`,
                    sub: act.department,
                    dept: act.department,
                    color: '#EF4444',
                });
            }
        });

        // 3. Unread observations
        activities.forEach((act) => {
            const obsCount = act.observations?.length || 0;
            if (obsCount > 0 && hasUnread(act.id, obsCount)) {
                items.push({
                    id: `obs-${act.id}`,
                    type: 'observation',
                    icon: <FiMessageSquare />,
                    text: `Nueva observación en "${act.name}"`,
                    sub: act.department,
                    dept: act.department,
                    color: '#3B82F6',
                });
            }
        });

        // Filter out dismissed notifications
        return items.filter((n) => !dismissedIds.includes(n.id));
    }, [pendingRequests, activities, getDeptStatus, hasUnread, dismissedIds]);

    /* ── Position panel next to bell button ── */
    const toggleOpen = () => {
        if (!open && bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            setPanelPos({
                top: rect.bottom + 8,
                left: rect.left,
            });
        }
        setOpen(!open);
    };

    /* ── Dismiss all notifications ── */
    const dismissAll = () => {
        const allIds = notifications.map((n) => n.id);
        const newDismissed = [...new Set([...dismissedIds, ...allIds])];
        setDismissedIds(newDismissed);
        try { localStorage.setItem(DISMISSED_KEY, JSON.stringify(newDismissed)); } catch { /* noop */ }
        setOpen(false);
    };

    /* ── Dismiss single notification ── */
    const dismissOne = (e, notifId) => {
        e.stopPropagation();
        const newDismissed = [...dismissedIds, notifId];
        setDismissedIds(newDismissed);
        try { localStorage.setItem(DISMISSED_KEY, JSON.stringify(newDismissed)); } catch { /* noop */ }
    };

    /* ── Click outside to close ── */
    useEffect(() => {
        const handler = (e) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target) &&
                bellRef.current && !bellRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleClick = (notif) => {
        const route = DEPT_ROUTES[notif.dept];
        if (route) navigate(route);
        setOpen(false);
    };

    const count = notifications.length;

    const panel = open ? createPortal(
        <div
            className="notif-bell__panel"
            ref={panelRef}
            style={{ top: panelPos.top, left: panelPos.left }}
        >
            <div className="notif-bell__header">
                <span className="notif-bell__title">Notificaciones</span>
                {count > 0 && (
                    <button className="notif-bell__clear-btn" onClick={dismissAll} title="Limpiar todas">
                        <FiTrash2 /> Limpiar
                    </button>
                )}
            </div>
            <div className="notif-bell__list">
                {count === 0 ? (
                    <div className="notif-bell__empty">
                        <span>🎉</span>
                        <p>Sin notificaciones</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} className="notif-bell__item-row">
                            <button
                                className="notif-bell__item"
                                onClick={() => handleClick(n)}
                            >
                                <span className="notif-bell__item-icon" style={{ color: n.color, background: `${n.color}15` }}>
                                    {n.icon}
                                </span>
                                <div className="notif-bell__item-body">
                                    <span className="notif-bell__item-text">{n.text}</span>
                                    <span className="notif-bell__item-sub">{n.sub}</span>
                                </div>
                            </button>
                            <button
                                className="notif-bell__dismiss-btn"
                                onClick={(e) => dismissOne(e, n.id)}
                                title="Descartar"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="notif-bell">
            <button
                className="notif-bell__btn"
                ref={bellRef}
                onClick={toggleOpen}
                aria-label="Notificaciones"
            >
                <FiBell />
                {count > 0 && (
                    <span className="notif-bell__badge">{count > 99 ? '99+' : count}</span>
                )}
            </button>
            {panel}
        </div>
    );
}
