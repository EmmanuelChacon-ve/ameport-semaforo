import { useState } from 'react';
import { createPortal } from 'react-dom';
import './ObservationPrompt.css';

const STATUSES = ['Realizado', 'En Curso', 'Pendiente', 'Atrasado', 'No Realizado'];

const STATUS_META = {
    'Realizado': { icon: '✅', color: '#22c55e' },
    'En Curso': { icon: '🔄', color: '#3b82f6' },
    'Pendiente': { icon: '⏳', color: '#f59e0b' },
    'Atrasado': { icon: '⏰', color: '#ef4444' },
    'No Realizado': { icon: '❌', color: '#ef4444' },
};

/**
 * Modal for admin to change activity status.
 * Shows a status selector + observation textarea.
 * The observation is always required.
 *
 * Props:
 *  - currentStatus: current effective status label
 *  - activityName: name of the task/activity
 *  - onConfirm(selectedStatus, observationText): callback
 *  - onCancel: close without changes
 */
export default function ObservationPrompt({ currentStatus, activityName, onConfirm, onCancel }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedStatus || !text.trim()) return;
        onConfirm(selectedStatus, text.trim());
    };

    const meta = STATUS_META[selectedStatus] || {};

    return createPortal(
        <div className="obs-prompt-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className="obs-prompt">
                <div className="obs-prompt__icon">📋</div>
                <h3 className="obs-prompt__title">Cambiar Estado</h3>
                <p className="obs-prompt__subtitle">
                    {activityName}
                    {currentStatus && (
                        <span className="obs-prompt__current"> — Estado actual: <strong>{currentStatus}</strong></span>
                    )}
                </p>

                <form onSubmit={handleSubmit}>
                    <label className="obs-prompt__label">Nuevo estado</label>
                    <div className="obs-prompt__status-grid">
                        {STATUSES.map((s) => {
                            const m = STATUS_META[s];
                            const isActive = selectedStatus === s;
                            const isCurrent = s === currentStatus;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    className={`obs-prompt__status-btn ${isActive ? 'obs-prompt__status-btn--active' : ''} ${isCurrent ? 'obs-prompt__status-btn--current' : ''}`}
                                    style={{ '--st-color': m.color }}
                                    onClick={() => setSelectedStatus(s)}
                                    disabled={isCurrent}
                                    title={isCurrent ? 'Estado actual' : `Cambiar a ${s}`}
                                >
                                    <span className="obs-prompt__status-icon">{m.icon}</span>
                                    {s}
                                </button>
                            );
                        })}
                    </div>

                    <label className="obs-prompt__label">Observación</label>
                    <textarea
                        className="obs-prompt__textarea"
                        placeholder="Escribe el motivo del cambio de estado..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />

                    <div className="obs-prompt__actions">
                        <button type="button" className="obs-prompt__cancel" onClick={onCancel}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="obs-prompt__confirm"
                            disabled={!selectedStatus || !text.trim()}
                            style={meta.color ? { background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` } : {}}
                        >
                            Confirmar Cambio
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
