import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSend, FiCalendar, FiFolder, FiLayers } from 'react-icons/fi';
import { addObservation, fetchObservations } from '../../services/api';
import useObservationRead from '../../hooks/useObservationRead';
import './ActivityDetailModal.css';

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const STATUS_COLORS = {
    'Realizado': '#10B981',
    'En Curso': '#3B82F6',
    'Pendiente': '#F59E0B',
    'Atrasado': '#EF4444',
    'No Realizado': '#6B7280',
};

const TYPE_LABELS = {
    delay_reason: 'Razón de atraso',
    status_change: 'Cambio de estado',
    general: 'General',
};

export default function ActivityDetailModal({ activity, onClose }) {
    const [observations, setObservations] = useState([]);
    const [newText, setNewText] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingObs, setLoadingObs] = useState(true);
    const { markAsRead } = useObservationRead();

    const loadObservations = useCallback(async () => {
        if (!activity?.id) return;
        try {
            setLoadingObs(true);
            const obs = await fetchObservations(activity.id);
            setObservations(obs);
        } catch (err) {
            console.error('Error cargando observaciones:', err);
            // Fallback to observations from activity data
            setObservations(activity.observations || []);
        } finally {
            setLoadingObs(false);
        }
    }, [activity?.id, activity?.observations]);

    useEffect(() => {
        loadObservations();
    }, [loadObservations]);

    // Mark observations as read once they're loaded
    useEffect(() => {
        if (!loadingObs && activity?.id && observations.length > 0) {
            markAsRead(activity.id, observations.length);
        }
    }, [loadingObs, activity?.id, observations.length, markAsRead]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newText.trim() || sending) return;

        setSending(true);
        try {
            await addObservation(activity.id, newText.trim(), 'general');
            setNewText('');
            await loadObservations();
        } catch (err) {
            console.error('Error agregando observación:', err);
            alert(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!activity) return null;

    const statusColor = STATUS_COLORS[activity.manualStatus] || STATUS_COLORS[activity.status] || '#64748b';
    const statusLabel = activity.manualStatus || activity.status || 'Sin estado';
    const monthRange = activity.startMonth !== undefined && activity.endMonth !== undefined
        ? `${monthNames[activity.startMonth]} – ${monthNames[activity.endMonth]}`
        : null;

    return createPortal(
        <div className="activity-detail-overlay" onClick={handleOverlayClick}>
            <div className="activity-detail-modal">
                {/* Compact header */}
                <div className="adm__header">
                    <div className="adm__header-info">
                        <h2 className="adm__title">{activity.name}</h2>
                        <div className="adm__meta">
                            <span className="adm__meta-tag adm__meta-tag--dept">
                                <FiFolder size={12} /> {activity.department}
                            </span>
                            {activity.category && (
                                <span className="adm__meta-tag adm__meta-tag--cat">
                                    <FiLayers size={12} /> {activity.category}
                                </span>
                            )}
                            {monthRange && (
                                <span className="adm__meta-tag adm__meta-tag--months">
                                    <FiCalendar size={12} /> {monthRange}
                                </span>
                            )}
                            <span
                                className="adm__status-pill"
                                style={{ '--pill-color': statusColor, '--pill-bg': `${statusColor}18` }}
                            >
                                <span className="adm__status-dot" />
                                {statusLabel}
                            </span>
                        </div>
                    </div>
                    <button className="adm__close-btn" onClick={onClose}>
                        <FiX size={18} />
                    </button>
                </div>

                {/* Add observation form — FIRST, always visible */}
                <div className="adm__add-section">
                    <form className="adm__add-form" onSubmit={handleSubmit}>
                        <textarea
                            className="adm__add-textarea"
                            placeholder="Escribí tu observación aquí..."
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            rows={2}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="adm__add-btn"
                            disabled={!newText.trim() || sending}
                        >
                            <FiSend size={14} /> {sending ? 'Enviando...' : 'Enviar'}
                        </button>
                    </form>
                </div>

                {/* Observations list — scrollable */}
                <div className="adm__body">
                    <h3 className="adm__section-title">
                        📝 Observaciones anteriores
                        {observations.length > 0 && (
                            <span className="adm__obs-count">{observations.length}</span>
                        )}
                    </h3>

                    {loadingObs ? (
                        <div className="adm__obs-empty">Cargando observaciones...</div>
                    ) : observations.length > 0 ? (
                        <div className="adm__obs-list">
                            {observations.map((obs, i) => (
                                <div key={i} className={`adm__obs-item adm__obs-item--${obs.type || 'general'}`}>
                                    <p className="adm__obs-text">{obs.text}</p>
                                    <div className="adm__obs-footer">
                                        <span className="adm__obs-author">
                                            {obs.authorName} · {new Date(obs.createdAt).toLocaleDateString('es-ES', {
                                                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                        <span className={`adm__obs-type adm__obs-type--${obs.type || 'general'}`}>
                                            {TYPE_LABELS[obs.type] || 'General'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="adm__obs-empty">
                            <span className="adm__obs-empty-icon">💬</span>
                            No hay observaciones aún
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
