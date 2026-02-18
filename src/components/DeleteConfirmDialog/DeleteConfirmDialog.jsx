import './DeleteConfirmDialog.css';

export default function DeleteConfirmDialog({ taskName, onConfirm, onCancel, loading }) {
    return (
        <div className="del-overlay" onClick={onCancel}>
            <div className="del-confirm" onClick={(e) => e.stopPropagation()}>
                <div className="del-confirm__icon">🗑️</div>
                <h3 className="del-confirm__title">¿Eliminar actividad?</h3>
                <p className="del-confirm__text">
                    Estás a punto de eliminar <strong>"{taskName}"</strong>.
                    Esta acción no se puede deshacer.
                </p>
                <div className="del-confirm__actions">
                    <button
                        className="del-confirm__btn del-confirm__btn--cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="del-confirm__btn del-confirm__btn--delete"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
