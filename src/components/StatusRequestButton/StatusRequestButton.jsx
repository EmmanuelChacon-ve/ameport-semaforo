import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSend, FiClock } from 'react-icons/fi';
import { createStatusRequest, fetchStatusRequests } from '../../services/api';
import './StatusRequestButton.css';

const STATUSES = ['Realizado', 'En Curso', 'Pendiente', 'Atrasado', 'No Realizado'];

// ── Module-level cache for pending activity IDs (shared across all instances) ──
let pendingIds = null;
let cacheTs = 0;
const CACHE_TTL = 60_000; // 1 min

async function loadPendingIds() {
    if (pendingIds && Date.now() - cacheTs < CACHE_TTL) return pendingIds;
    try {
        const reqs = await fetchStatusRequests('pending');
        pendingIds = new Set(reqs.map((r) => r.activityId));
    } catch {
        pendingIds = new Set();
    }
    cacheTs = Date.now();
    return pendingIds;
}

function invalidateCache() {
    pendingIds = null;
    cacheTs = 0;
}

/**
 * Button visible only for coordinators. Opens a mini-modal to request
 * a status change from the admin.
 * Rejection reasons are shown via the Observations modal (not here).
 */
export default function StatusRequestButton({ activity }) {
    const [open, setOpen] = useState(false);
    const [requestedStatus, setRequestedStatus] = useState('');
    const [reason, setReason] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [checking, setChecking] = useState(true);
    const [hasPending, setHasPending] = useState(false);

    useEffect(() => {
        loadPendingIds().then((ids) => {
            if (ids.has(activity.id)) setHasPending(true);
            setChecking(false);
        });
    }, [activity.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!requestedStatus || !reason.trim() || sending) return;

        setSending(true);
        try {
            await createStatusRequest(activity.id, requestedStatus, reason.trim());
            setSent(true);
            invalidateCache();
            setTimeout(() => {
                setOpen(false);
                setSent(false);
                setRequestedStatus('');
                setReason('');
                setHasPending(true);
            }, 1500);
        } catch (err) {
            alert(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
            setSent(false);
        }
    };

    // Don't render anything until the check is done
    if (checking) return null;

    // If there's a pending request, show badge
    if (hasPending) {
        return (
            <span className="sr-pending" title="Solicitud pendiente de aprobación">
                <FiClock size={11} /> Pendiente
            </span>
        );
    }

    return (
        <>
            <button
                className="sr-btn"
                onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                title="Solicitar cambio de estado"
            >
                <FiSend size={11} /> Solicitar
            </button>

            {open && createPortal(
                <div className="sr-overlay" onClick={handleOverlayClick}>
                    <div className="sr-modal" onClick={(e) => e.stopPropagation()}>
                        {sent ? (
                            <div className="sr-modal__success">
                                <span className="sr-modal__success-icon">✅</span>
                                <p className="sr-modal__success-text">Solicitud enviada exitosamente</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="sr-modal__title">Solicitar Cambio de Estado</h3>
                                <p className="sr-modal__subtitle">
                                    {activity.name}
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <label className="sr-modal__label">Estado solicitado</label>
                                    <select
                                        className="sr-modal__select"
                                        value={requestedStatus}
                                        onChange={(e) => setRequestedStatus(e.target.value)}
                                    >
                                        <option value="">Seleccionar estado...</option>
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>

                                    <label className="sr-modal__label">Razón del cambio</label>
                                    <textarea
                                        className="sr-modal__textarea"
                                        placeholder="Explica por qué se solicita este cambio..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />

                                    <div className="sr-modal__actions">
                                        <button type="button" className="sr-modal__cancel" onClick={() => setOpen(false)}>
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="sr-modal__submit"
                                            disabled={!requestedStatus || !reason.trim() || sending}
                                        >
                                            {sending ? 'Enviando...' : 'Enviar Solicitud'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
