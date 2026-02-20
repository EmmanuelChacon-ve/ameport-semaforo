import { useState, useEffect, useCallback } from 'react';
import { FiCheck, FiX, FiArrowRight, FiMessageSquare, FiRefreshCw } from 'react-icons/fi';
import { fetchStatusRequests, resolveStatusRequest } from '../../services/api';
import { useTasks } from '../../context/TaskContext';
import './StatusRequestsPanel.css';

const STATUS_COLORS = {
    'Realizado': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
    'En Curso': { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
    'Pendiente': { color: '#F59E0B', bg: 'rgba(251, 191, 36, 0.15)' },
    'Atrasado': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
    'No Realizado': { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' },
};

export default function StatusRequestsPanel() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);   // which request is being rejected
    const [rejectNote, setRejectNote] = useState('');        // rejection reason text
    const { refreshTasks } = useTasks();

    const loadRequests = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchStatusRequests('pending');
            setRequests(data);
        } catch (err) {
            console.error('Error cargando solicitudes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleApprove = async (requestId) => {
        setResolving(requestId);
        try {
            await resolveStatusRequest(requestId, 'approved');
            await loadRequests();
            await refreshTasks();
        } catch (err) {
            alert(err.message);
        } finally {
            setResolving(null);
        }
    };

    const handleRejectConfirm = async (requestId) => {
        if (!rejectNote.trim()) {
            alert('Debés escribir un motivo para rechazar la solicitud.');
            return;
        }
        setResolving(requestId);
        try {
            await resolveStatusRequest(requestId, 'rejected', rejectNote.trim());
            setRejectingId(null);
            setRejectNote('');
            await loadRequests();
        } catch (err) {
            alert(err.message);
        } finally {
            setResolving(null);
        }
    };

    const getStatusStyle = (status) => {
        const s = STATUS_COLORS[status] || { color: '#64748b', bg: 'rgba(100,116,139,0.15)' };
        return { '--status-color': s.color, '--status-bg': s.bg };
    };

    return (
        <div className="srp">
            <div className="srp__header">
                <h3 className="srp__title">
                    🔔 Solicitudes de Cambio
                    {requests.length > 0 && (
                        <span className="srp__badge">{requests.length}</span>
                    )}
                </h3>
                <button
                    className="srp__refresh-btn"
                    onClick={loadRequests}
                    disabled={loading}
                    title="Actualizar solicitudes"
                >
                    <FiRefreshCw size={14} className={loading ? 'srp__spin' : ''} /> Actualizar
                </button>
            </div>

            {loading ? (
                <div className="srp__loading">Cargando solicitudes...</div>
            ) : requests.length === 0 ? (
                <div className="srp__empty">
                    <span className="srp__empty-icon">✨</span>
                    No hay solicitudes pendientes
                </div>
            ) : (
                <div className="srp__list">
                    {requests.map((req) => (
                        <div key={req.id} className="srp__item">
                            <div className="srp__item-top">
                                <div className="srp__item-info">
                                    <p className="srp__item-name">{req.activityName}</p>
                                    <span className="srp__item-meta">
                                        {req.department} · {req.requestedByName} · {new Date(req.createdAt).toLocaleDateString('es-ES', {
                                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="srp__item-arrow">
                                    <span className="srp__item-status" style={getStatusStyle(req.currentStatus || 'Pendiente')}>
                                        {req.currentStatus || 'Auto'}
                                    </span>
                                    <FiArrowRight size={14} color="#64748b" />
                                    <span className="srp__item-status" style={getStatusStyle(req.requestedStatus)}>
                                        {req.requestedStatus}
                                    </span>
                                </div>
                            </div>

                            <p className="srp__item-reason">"{req.reason}"</p>

                            {/* Inline reject form */}
                            {rejectingId === req.id ? (
                                <div className="srp__reject-form">
                                    <label className="srp__reject-label">
                                        <FiMessageSquare size={13} /> Motivo del rechazo:
                                    </label>
                                    <textarea
                                        className="srp__reject-input"
                                        placeholder="Escribí el motivo por el cual se rechaza..."
                                        value={rejectNote}
                                        onChange={(e) => setRejectNote(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="srp__reject-form-actions">
                                        <button
                                            className="srp__reject-cancel"
                                            onClick={() => { setRejectingId(null); setRejectNote(''); }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="srp__reject-confirm"
                                            onClick={() => handleRejectConfirm(req.id)}
                                            disabled={!rejectNote.trim() || resolving === req.id}
                                        >
                                            {resolving === req.id ? 'Rechazando...' : 'Confirmar Rechazo'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="srp__item-actions">
                                    <button
                                        className="srp__approve-btn"
                                        onClick={() => handleApprove(req.id)}
                                        disabled={resolving === req.id}
                                    >
                                        <FiCheck size={14} /> Aprobar
                                    </button>
                                    <button
                                        className="srp__reject-btn"
                                        onClick={() => setRejectingId(req.id)}
                                        disabled={resolving === req.id}
                                    >
                                        <FiX size={14} /> Rechazar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
