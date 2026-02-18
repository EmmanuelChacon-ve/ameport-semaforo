import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiPlus, FiX, FiLoader, FiFolder } from 'react-icons/fi';
import { addDepartmentCategory, fetchDepartmentsMetadata } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CreateCategoryModal.css';

export default function CreateCategoryModal({ isOpen, onClose, departmentName, departments, onCategoryCreated }) {
    const { token } = useAuth();
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const dept = departments?.find((d) => d.name === departmentName);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            setError('El nombre de la categoría es obligatorio');
            return;
        }
        if (!dept) {
            setError('No se encontró el departamento');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await addDepartmentCategory(dept.id, categoryName.trim(), token);
            setCategoryName('');
            setError('');
            if (onCategoryCreated) onCategoryCreated();
            onClose();
        } catch (err) {
            setError(err.message || 'Error al crear la categoría');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="ccm-overlay" onClick={onClose}>
            <div className="ccm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ccm-header">
                    <div className="ccm-header__left">
                        <div className="ccm-header__icon"><FiFolder /></div>
                        <div>
                            <h2 className="ccm-header__title">Nueva Categoría</h2>
                            <p className="ccm-header__subtitle">{departmentName}</p>
                        </div>
                    </div>
                    <button className="ccm-close" onClick={onClose}><FiX /></button>
                </div>

                {error && <div className="ccm-error"><span>⚠️</span> {error}</div>}

                <form className="ccm-form" onSubmit={handleSubmit}>
                    <div className="ccm-field">
                        <label className="ccm-label">Nombre de la Categoría</label>
                        <input
                            className="ccm-input"
                            type="text"
                            placeholder="Ej: Infraestructura, Eventos, etc."
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {dept?.categories?.length > 0 && (
                        <div className="ccm-existing">
                            <span className="ccm-existing__label">Categorías existentes:</span>
                            <div className="ccm-existing__tags">
                                {dept.categories.map((cat) => (
                                    <span key={cat} className="ccm-existing__tag">{cat}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="ccm-actions">
                        <button type="button" className="ccm-btn ccm-btn--cancel" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="ccm-btn ccm-btn--submit" disabled={loading || !categoryName.trim()}>
                            {loading ? (<><FiLoader className="ccm-spinner" /> Creando...</>) : (<><FiPlus /> Crear Categoría</>)}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
