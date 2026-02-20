import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchActivityById,
    createMilestone,
    updateMilestoneApi,
    toggleMilestoneApi,
    deleteMilestoneApi,
    addMilestoneComment,
    fetchObservations,
    addObservation,
} from '../../services/api';
import useObservationRead from '../../hooks/useObservationRead';
import { monthNames } from '../../utils/semaforoUtils';
import { useTasks } from '../../context/TaskContext';
import {
    FiArrowLeft, FiPlus, FiTrash2, FiCheck, FiSend,
    FiCalendar, FiFolder, FiTarget, FiAlertCircle,
    FiChevronDown, FiChevronUp, FiMessageCircle, FiEdit2, FiX, FiSave,
    FiMessageSquare,
} from 'react-icons/fi';
import './ActivityDetail.css';

const CURRENT_MONTH = new Date().getMonth();

export default function ActivityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, getDeptStatus, DEPT_SEMAFORO_COLORS, DEPT_SEMAFORO_LABELS } = useTasks();

    const [activity, setActivity] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Milestone form
    const [newTitle, setNewTitle] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [creating, setCreating] = useState(false);

    // Edit state  { milestoneId: { title, dueDate } | null }
    const [editing, setEditing] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    // Per-milestone comment input  { [milestoneId]: string }
    const [commentText, setCommentText] = useState({});
    const [commentLoading, setCommentLoading] = useState({});

    // Expanded milestones (to show/hide comments)
    const [expanded, setExpanded] = useState({});

    // Observations (activity-level)
    const [observations, setObservations] = useState([]);
    const [obsText, setObsText] = useState('');
    const [obsSending, setObsSending] = useState(false);
    const [obsLoading, setObsLoading] = useState(true);
    const { markAsRead } = useObservationRead();

    /* ── Load activity data ── */
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const act = await fetchActivityById(id);
            setActivity(act);
            setMilestones(act.milestones || []);
            setProgress(act.progress || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadData(); }, [loadData]);

    /* ── Load observations ── */
    const loadObservations = useCallback(async () => {
        if (!id) return;
        try {
            setObsLoading(true);
            const obs = await fetchObservations(id);
            setObservations(obs);
        } catch (err) {
            console.error('Error cargando observaciones:', err);
        } finally {
            setObsLoading(false);
        }
    }, [id]);

    useEffect(() => { loadObservations(); }, [loadObservations]);

    // Mark observations as read when loaded
    useEffect(() => {
        if (!obsLoading && id && observations.length > 0) {
            markAsRead(id, observations.length);
        }
    }, [obsLoading, id, observations.length, markAsRead]);

    /* ── Date range helpers ── */
    const YEAR = new Date().getFullYear();
    const getMinDate = () => {
        if (!activity || activity.startMonth === null) return '';
        return `${YEAR}-${String(activity.startMonth + 1).padStart(2, '0')}-01`;
    };
    const getMaxDate = () => {
        if (!activity || activity.endMonth === null) return '';
        const lastDay = new Date(YEAR, activity.endMonth + 1, 0).getDate();
        return `${YEAR}-${String(activity.endMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    };

    /* ── Create milestone ── */
    const handleCreateMilestone = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDueDate || creating) return;
        try {
            setCreating(true);
            const result = await createMilestone(id, newTitle.trim(), newDueDate);
            setMilestones((prev) => [...prev, result.milestone]);
            setProgress(result.progress);
            setNewTitle('');
            setNewDueDate('');
        } catch (err) {
            alert(err.message);
        } finally {
            setCreating(false);
        }
    };

    /* ── Edit milestone ── */
    const startEdit = (m) => {
        setEditing(m.id);
        setEditTitle(m.title);
        setEditDate(m.dueDate || '');
    };

    const cancelEdit = () => {
        setEditing(null);
        setEditTitle('');
        setEditDate('');
    };

    const saveEdit = async (milestoneId) => {
        if (!editTitle.trim() || editLoading) return;
        try {
            setEditLoading(true);
            const updates = {};
            const original = milestones.find((m) => m.id === milestoneId);
            if (editTitle.trim() !== original?.title) updates.title = editTitle.trim();
            if (editDate !== (original?.dueDate || '')) updates.dueDate = editDate;

            if (Object.keys(updates).length === 0) {
                cancelEdit();
                return;
            }

            await updateMilestoneApi(id, milestoneId, updates);
            // Update local state
            setMilestones((prev) =>
                prev.map((m) => m.id === milestoneId
                    ? { ...m, ...updates }
                    : m
                )
            );
            cancelEdit();
        } catch (err) {
            alert(err.message);
        } finally {
            setEditLoading(false);
        }
    };

    /* ── Toggle milestone ── */
    const handleToggle = async (milestone) => {
        const newCompleted = !milestone.completed;
        setMilestones((prev) =>
            prev.map((m) => m.id === milestone.id ? { ...m, completed: newCompleted } : m)
        );
        try {
            const result = await toggleMilestoneApi(id, milestone.id, newCompleted);
            setProgress(result.progress);
        } catch (err) {
            setMilestones((prev) =>
                prev.map((m) => m.id === milestone.id ? { ...m, completed: !newCompleted } : m)
            );
            alert(err.message);
        }
    };

    /* ── Delete milestone ── */
    const handleDeleteMilestone = async (milestoneId) => {
        const prev = [...milestones];
        setMilestones((ms) => ms.filter((m) => m.id !== milestoneId));
        try {
            const result = await deleteMilestoneApi(id, milestoneId);
            setProgress(result.progress);
        } catch (err) {
            setMilestones(prev);
            alert(err.message);
        }
    };

    /* ── Add comment to milestone ── */
    const handleAddComment = async (milestoneId) => {
        const text = (commentText[milestoneId] || '').trim();
        if (!text || commentLoading[milestoneId]) return;
        try {
            setCommentLoading((p) => ({ ...p, [milestoneId]: true }));
            const result = await addMilestoneComment(id, milestoneId, text);
            setMilestones((prev) =>
                prev.map((m) => m.id === milestoneId
                    ? { ...m, comments: [...(m.comments || []), result.comment] }
                    : m
                )
            );
            setCommentText((p) => ({ ...p, [milestoneId]: '' }));
        } catch (err) {
            alert(err.message);
        } finally {
            setCommentLoading((p) => ({ ...p, [milestoneId]: false }));
        }
    };

    const toggleExpand = (milestoneId) => {
        setExpanded((p) => ({ ...p, [milestoneId]: !p[milestoneId] }));
    };

    /* ── Computed values ── */
    const formatMonth = (idx) => (idx !== null && idx !== undefined ? monthNames[idx] || '—' : '—');

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    };

    const calcDesvio = () => {
        if (!activity || activity.endMonth === null || activity.endMonth === undefined) return null;
        return activity.endMonth - CURRENT_MONTH;
    };

    const getTimelineProgress = () => {
        if (!activity || activity.startMonth === null || activity.endMonth === null) return 0;
        const total = activity.endMonth - activity.startMonth;
        if (total <= 0) return 100;
        const elapsed = CURRENT_MONTH - activity.startMonth;
        return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
    };

    const getStatusInfo = () => {
        if (!activity) return { color: '#64748b', label: 'Sin estado' };
        const eff = getDeptStatus(activity.id, activity.manualStatus || 'yellow');
        return {
            color: DEPT_SEMAFORO_COLORS[eff] || '#64748b',
            label: DEPT_SEMAFORO_LABELS[eff] || 'Sin estado',
        };
    };

    const nextMilestone = milestones.find((m) => !m.completed);
    const desvio = calcDesvio();
    const statusInfo = getStatusInfo();

    if (loading) {
        return (
            <div className="act-detail__loading">
                <div className="act-detail__spinner" />
                <p>Cargando actividad...</p>
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div className="act-detail__error">
                <FiAlertCircle size={40} />
                <p>{error || 'Actividad no encontrada'}</p>
                <button onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    return (
        <div className="act-detail">
            <button className="act-detail__back" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Volver a la lista
            </button>

            <div className="act-detail__layout">
                {/* ══ MAIN COLUMN ══ */}
                <div className="act-detail__main">
                    {/* Header */}
                    <div className="act-detail__header">
                        <h1 className="act-detail__title">{activity.name}</h1>
                        <div className="act-detail__meta">
                            <span className="act-detail__meta-item">
                                <FiFolder /> {activity.department}
                            </span>
                            {activity.category && (
                                <span className="act-detail__meta-item">
                                    <FiTarget /> {activity.category}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="act-detail__timeline-card">
                        <div className="act-detail__timeline-bar">
                            <div
                                className="act-detail__timeline-fill"
                                style={{ width: `${getTimelineProgress()}%` }}
                            />
                            <div
                                className="act-detail__timeline-today"
                                style={{ left: `${getTimelineProgress()}%` }}
                            >
                                <span className="act-detail__timeline-today-dot" />
                            </div>
                        </div>
                        <div className="act-detail__timeline-labels">
                            <span><FiCalendar /> Inicio: {formatMonth(activity.startMonth)}</span>
                            <span className="act-detail__timeline-today-label">Hoy</span>
                            <span>Compromiso: {formatMonth(activity.endMonth)}</span>
                        </div>
                    </div>

                    {/* ── Milestones section ── */}
                    <div className="act-detail__section">
                        <div className="act-detail__section-header">
                            <h2><FiTarget /> Hitos del Proyecto</h2>
                            <span className="act-detail__progress-badge">
                                {progress}% completado
                            </span>
                        </div>

                        <div className="act-detail__progress-bar">
                            <div
                                className="act-detail__progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Milestone list */}
                        <div className="act-detail__milestones">
                            {milestones.map((m, idx) => {
                                const comments = m.comments || [];
                                const isExpanded = expanded[m.id];
                                const isEditing = editing === m.id;

                                return (
                                    <div key={m.id} className={`act-detail__milestone-card ${m.completed ? 'act-detail__milestone-card--done' : ''}`}>
                                        {/* Main row */}
                                        <div className="act-detail__milestone-row">
                                            <button
                                                className="act-detail__milestone-check"
                                                onClick={() => isAdmin && handleToggle(m)}
                                                disabled={!isAdmin}
                                            >
                                                {m.completed && <FiCheck />}
                                            </button>

                                            {isEditing ? (
                                                /* ── Edit mode ── */
                                                <div className="act-detail__milestone-edit">
                                                    <input
                                                        type="text"
                                                        className="act-detail__edit-title"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        autoFocus
                                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(m.id)}
                                                    />
                                                    <input
                                                        type="date"
                                                        className="act-detail__edit-date"
                                                        value={editDate}
                                                        onChange={(e) => setEditDate(e.target.value)}
                                                        min={getMinDate()}
                                                        max={getMaxDate()}
                                                    />
                                                    <button
                                                        className="act-detail__edit-save"
                                                        onClick={() => saveEdit(m.id)}
                                                        disabled={editLoading || !editTitle.trim()}
                                                        title="Guardar"
                                                    >
                                                        <FiSave />
                                                    </button>
                                                    <button
                                                        className="act-detail__edit-cancel"
                                                        onClick={cancelEdit}
                                                        title="Cancelar"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ) : (
                                                /* ── View mode ── */
                                                <>
                                                    <div className="act-detail__milestone-info">
                                                        <span className="act-detail__milestone-order">#{idx + 1}</span>
                                                        <span className={`act-detail__milestone-title ${m.completed ? 'act-detail__milestone-title--done' : ''}`}>
                                                            {m.title}
                                                        </span>
                                                    </div>
                                                    {m.dueDate && (
                                                        <span className="act-detail__milestone-date">
                                                            <FiCalendar /> {formatDate(m.dueDate)}
                                                        </span>
                                                    )}
                                                    <button
                                                        className="act-detail__milestone-expand"
                                                        onClick={() => toggleExpand(m.id)}
                                                        title={isExpanded ? 'Ocultar comentarios' : 'Ver comentarios'}
                                                    >
                                                        <FiMessageCircle />
                                                        {comments.length > 0 && (
                                                            <span className="act-detail__comment-count">{comments.length}</span>
                                                        )}
                                                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                                    </button>
                                                    {isAdmin && (
                                                        <button
                                                            className="act-detail__milestone-edit-btn"
                                                            onClick={() => startEdit(m)}
                                                            title="Editar hito"
                                                        >
                                                            <FiEdit2 />
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button
                                                            className="act-detail__milestone-delete"
                                                            onClick={() => handleDeleteMilestone(m.id)}
                                                            title="Eliminar hito"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Inline comments section */}
                                        {isExpanded && !isEditing && (
                                            <div className="act-detail__milestone-comments">
                                                {comments.length === 0 && (
                                                    <p className="act-detail__milestone-comments-empty">Sin comentarios de seguimiento</p>
                                                )}
                                                {comments.map((c, ci) => (
                                                    <div key={ci} className="act-detail__comment">
                                                        <div className="act-detail__comment-header">
                                                            <span className="act-detail__comment-author">{c.author || 'Sistema'}</span>
                                                            <span className="act-detail__comment-date">
                                                                {c.date ? new Date(c.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </span>
                                                        </div>
                                                        <p className="act-detail__comment-text">{c.text}</p>
                                                    </div>
                                                ))}

                                                {/* Add comment form */}
                                                <div className="act-detail__comment-form">
                                                    <input
                                                        type="text"
                                                        className="act-detail__comment-input"
                                                        placeholder="Agregar comentario..."
                                                        value={commentText[m.id] || ''}
                                                        onChange={(e) => setCommentText((p) => ({ ...p, [m.id]: e.target.value }))}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(m.id)}
                                                    />
                                                    <button
                                                        className="act-detail__comment-send"
                                                        onClick={() => handleAddComment(m.id)}
                                                        disabled={commentLoading[m.id] || !(commentText[m.id] || '').trim()}
                                                    >
                                                        <FiSend />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {milestones.length === 0 && (
                                <p className="act-detail__empty">No hay hitos definidos todavía.</p>
                            )}
                        </div>

                        {/* Add milestone form (admin + coordinator) */}
                        {(
                            <form className="act-detail__add-form" onSubmit={handleCreateMilestone}>
                                <input
                                    type="text"
                                    className="act-detail__add-input"
                                    placeholder="Nombre del hito..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="act-detail__add-date"
                                    value={newDueDate}
                                    onChange={(e) => setNewDueDate(e.target.value)}
                                    min={getMinDate()}
                                    max={getMaxDate()}
                                />
                                <button
                                    type="submit"
                                    className="act-detail__add-btn"
                                    disabled={creating || !newTitle.trim() || !newDueDate}
                                >
                                    <FiPlus /> {creating ? 'Creando...' : 'Agregar'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Observations section (status change reasons) ── */}
                    <div className="act-detail__section">
                        <div className="act-detail__section-header">
                            <h2><FiMessageSquare /> Observaciones</h2>
                            {observations.length > 0 && (
                                <span className="act-detail__progress-badge">
                                    {observations.length} {observations.length === 1 ? 'observación' : 'observaciones'}
                                </span>
                            )}
                        </div>

                        {/* Add observation form */}
                        <form
                            className="act-detail__obs-form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!obsText.trim() || obsSending) return;
                                setObsSending(true);
                                try {
                                    await addObservation(id, obsText.trim(), 'general');
                                    setObsText('');
                                    await loadObservations();
                                } catch (err) {
                                    alert(err.message);
                                } finally {
                                    setObsSending(false);
                                }
                            }}
                        >
                            <textarea
                                className="act-detail__obs-textarea"
                                placeholder="Escribí tu observación aquí..."
                                value={obsText}
                                onChange={(e) => setObsText(e.target.value)}
                                rows={2}
                            />
                            <button
                                type="submit"
                                className="act-detail__obs-submit"
                                disabled={!obsText.trim() || obsSending}
                            >
                                <FiSend /> {obsSending ? 'Enviando...' : 'Enviar'}
                            </button>
                        </form>

                        {/* Observations list */}
                        {obsLoading ? (
                            <p className="act-detail__empty">Cargando observaciones...</p>
                        ) : observations.length > 0 ? (
                            <div className="act-detail__obs-list">
                                {observations.map((obs, i) => (
                                    <div key={i} className={`act-detail__obs-item act-detail__obs-item--${obs.type || 'general'}`}>
                                        <p className="act-detail__obs-text">{obs.text}</p>
                                        <div className="act-detail__obs-footer">
                                            <span className="act-detail__obs-author">
                                                {obs.authorName} · {obs.createdAt ? new Date(obs.createdAt).toLocaleDateString('es-AR', {
                                                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                }) : ''}
                                            </span>
                                            <span className={`act-detail__obs-type act-detail__obs-type--${obs.type || 'general'}`}>
                                                {obs.type === 'delay_reason' ? 'Razón de atraso' : obs.type === 'status_change' ? 'Cambio de estado' : 'General'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="act-detail__empty">💬 No hay observaciones aún</p>
                        )}
                    </div>
                </div>

                {/* ══ SIDEBAR ══ */}
                <aside className="act-detail__sidebar">
                    <div className="act-detail__info-card">
                        <h3>📋 Información del Proyecto</h3>

                        <div className="act-detail__info-row">
                            <span className="act-detail__info-label">ESTADO</span>
                            <span
                                className="act-detail__info-status"
                                style={{ '--status-color': statusInfo.color }}
                            >
                                <span className="act-detail__info-status-dot" />
                                {statusInfo.label}
                            </span>
                        </div>

                        <div className="act-detail__info-row">
                            <span className="act-detail__info-label">ÁREA</span>
                            <span className="act-detail__info-value">{activity.department}</span>
                        </div>

                        {activity.category && (
                            <div className="act-detail__info-row">
                                <span className="act-detail__info-label">CATEGORÍA</span>
                                <span className="act-detail__info-value">{activity.category}</span>
                            </div>
                        )}

                        <div className="act-detail__info-row">
                            <span className="act-detail__info-label">AVANCE</span>
                            <span className="act-detail__info-value act-detail__info-value--highlight">
                                {progress}%
                            </span>
                        </div>

                        <div className="act-detail__info-row">
                            <span className="act-detail__info-label">DESVÍO</span>
                            <span className={`act-detail__info-value ${desvio !== null ? (desvio < 0 ? 'act-detail__info-value--red' : desvio === 0 ? 'act-detail__info-value--yellow' : 'act-detail__info-value--green') : ''}`}>
                                {desvio !== null ? `${desvio > 0 ? '+' : ''}${desvio} ${Math.abs(desvio) === 1 ? 'mes' : 'meses'}` : '—'}
                            </span>
                        </div>

                        <div className="act-detail__info-row">
                            <span className="act-detail__info-label">HITOS</span>
                            <span className="act-detail__info-value">
                                {milestones.filter((m) => m.completed).length} / {milestones.length}
                            </span>
                        </div>

                        {nextMilestone && (
                            <div className="act-detail__info-row">
                                <span className="act-detail__info-label">PRÓXIMO HITO</span>
                                <span className="act-detail__info-value">{nextMilestone.title}</span>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
