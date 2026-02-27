import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    FiBell, FiAlertTriangle, FiMessageSquare, FiRefreshCw,
    FiCheckCircle, FiXCircle, FiPlus, FiFolder, FiFlag,
    FiCheck, FiTrash2,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
    fetchNotifications, markNotificationRead, markAllNotificationsRead,
    deleteNotification, deleteAllNotifications,
} from '../../services/api';
import './NotificationBell.css';

/* ── Department → route mapping ── */
const DEPT_ROUTES = {
    'Presidencia': '/presidencia',
    'Coordinación General': '/coordinacion-general',
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

/* ── Type → icon/color mapping ── */
const TYPE_CONFIG = {
    new_activity: { icon: <FiPlus />, color: '#22c55e' },
    activity_updated: { icon: <FiRefreshCw />, color: '#f59e0b' },
    activity_deleted: { icon: <FiXCircle />, color: '#ef4444' },
    new_category: { icon: <FiFolder />, color: '#8b5cf6' },
    new_observation: { icon: <FiMessageSquare />, color: '#3b82f6' },
    new_milestone: { icon: <FiFlag />, color: '#f59e0b' },
    milestone_toggle: { icon: <FiCheck />, color: '#14b8a6' },
    milestone_comment: { icon: <FiMessageSquare />, color: '#6366f1' },
    milestone_deleted: { icon: <FiTrash2 />, color: '#ef4444' },
    status_request: { icon: <FiRefreshCw />, color: '#8b5cf6' },
    status_approved: { icon: <FiCheckCircle />, color: '#22c55e' },
    status_rejected: { icon: <FiXCircle />, color: '#ef4444' },
};

/* ── Relative time helper ── */
function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `Hace ${days}d`;
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
    const { token } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
    const bellRef = useRef(null);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    /* ── Fetch notifications from backend ── */
    const loadNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('NotificationBell: fetch error', err);
        }
    }, [token]);

    useEffect(() => { loadNotifications(); }, [loadNotifications]);

    // Refresh every 30s
    useEffect(() => {
        const id = setInterval(loadNotifications, 30000);
        return () => clearInterval(id);
    }, [loadNotifications]);

    /* ── Unread count ── */
    const unreadCount = notifications.filter((n) => !n.read).length;

    /* ── Position panel ── */
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

    /* ── Mark all as read ── */
    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    /* ── Click on notification ── */
    const handleClick = async (notif) => {
        // Mark as read
        if (!notif.read) {
            try {
                await markNotificationRead(notif.id);
                setNotifications((prev) =>
                    prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
                );
            } catch (err) {
                console.error('Error marking notification:', err);
            }
        }
        // Navigate to department
        const route = DEPT_ROUTES[notif.department];
        if (route) navigate(route);
        setOpen(false);
    };

    /* ── Delete single notification ── */
    const handleDeleteOne = async (e, notifId) => {
        e.stopPropagation();
        try {
            await deleteNotification(notifId);
            setNotifications((prev) => prev.filter((n) => n.id !== notifId));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    /* ── Delete all notifications ── */
    const handleDeleteAll = async () => {
        try {
            await deleteAllNotifications();
            setNotifications([]);
        } catch (err) {
            console.error('Error deleting all:', err);
        }
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

    const panel = open ? createPortal(
        <>
            <div className="notif-bell__backdrop" onClick={() => setOpen(false)} />
            <div
                className="notif-bell__panel"
                ref={panelRef}
                style={{ top: panelPos.top, left: panelPos.left }}
            >
                <div className="notif-bell__header">
                    <span className="notif-bell__title">Notificaciones</span>
                    <div className="notif-bell__header-btns">
                        {unreadCount > 0 && (
                            <button className="notif-bell__read-btn" onClick={handleMarkAllRead} title="Marcar todas como leídas">
                                <FiCheckCircle /> Leer
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button className="notif-bell__clear-btn" onClick={handleDeleteAll} title="Eliminar todas">
                                <FiTrash2 /> Limpiar
                            </button>
                        )}
                    </div>
                </div>
                <div className="notif-bell__list">
                    {notifications.length === 0 ? (
                        <div className="notif-bell__empty">
                            <span>🎉</span>
                            <p>Sin notificaciones</p>
                        </div>
                    ) : (
                        notifications.map((n) => {
                            const config = TYPE_CONFIG[n.type] || { icon: <FiBell />, color: '#64748b' };
                            return (
                                <div key={n.id} className={`notif-bell__item-row ${!n.read ? 'notif-bell__item-row--unread' : ''}`}>
                                    <button
                                        className="notif-bell__item"
                                        onClick={() => handleClick(n)}
                                    >
                                        <span className="notif-bell__item-icon" style={{ color: config.color, background: `${config.color}15` }}>
                                            {config.icon}
                                        </span>
                                        <div className="notif-bell__item-body">
                                            <span className="notif-bell__item-text">{n.message}</span>
                                            <div className="notif-bell__item-meta">
                                                {n.department && <span className="notif-bell__item-dept">{n.department}</span>}
                                                <span className="notif-bell__item-time">{timeAgo(n.createdAt)}</span>
                                            </div>
                                        </div>
                                        {!n.read && <span className="notif-bell__unread-dot" />}
                                    </button>
                                    <button
                                        className="notif-bell__dismiss-btn"
                                        onClick={(e) => handleDeleteOne(e, n.id)}
                                        title="Eliminar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>,
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
                {unreadCount > 0 && (
                    <span className="notif-bell__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>
            {panel}
        </div>
    );
}
