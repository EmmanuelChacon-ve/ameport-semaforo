import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiLoader } from 'react-icons/fi';
import { fetchDepartmentsMetadata } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CreateTaskModal.css';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function CreateTaskModal({ isOpen, onClose, onSubmit, fixedDepartment }) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isCoordinator = user?.role === 'coordinator';

    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        category: '',
        startMonth: new Date().getMonth(),
        endMonth: new Date().getMonth(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load departments for the dropdown (only if no fixedDepartment)
    useEffect(() => {
        if (!isOpen || fixedDepartment) return;
        fetchDepartmentsMetadata()
            .then((depts) => {
                setDepartments(depts);
                if (isCoordinator && user?.departments?.length > 0) {
                    setFormData((prev) => ({ ...prev, department: user.departments[0] }));
                } else if (depts.length > 0 && !formData.department) {
                    setFormData((prev) => ({ ...prev, department: depts[0].name }));
                }
            })
            .catch(() => setError('Error cargando departamentos'));
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setError('');
            const dept = fixedDepartment
                || (isCoordinator && user?.departments?.length > 0 ? user.departments[0] : '');
            setFormData({
                name: '',
                department: dept,
                category: '',
                startMonth: new Date().getMonth(),
                endMonth: new Date().getMonth(),
            });
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isOpen) return null;

    const handleChange = (field) => (e) => {
        const value = field === 'startMonth' || field === 'endMonth'
            ? parseInt(e.target.value, 10)
            : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('El nombre de la actividad es obligatorio');
            return;
        }
        if (!formData.department) {
            setError('Debe seleccionar un departamento');
            return;
        }
        if (!formData.category.trim()) {
            setError('La categoría es obligatoria');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Error al crear la actividad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ctm-overlay" onClick={onClose}>
            <div className="ctm-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="ctm-header">
                    <div className="ctm-header__left">
                        <div className="ctm-header__icon">
                            <FiPlus />
                        </div>
                        <div>
                            <h2 className="ctm-header__title">Nueva Actividad</h2>
                            <p className="ctm-header__subtitle">Agregar una actividad al sistema</p>
                        </div>
                    </div>
                    <button className="ctm-close" onClick={onClose} aria-label="Cerrar">
                        <FiX />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="ctm-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Form */}
                <form className="ctm-form" onSubmit={handleSubmit}>
                    <div className="ctm-field">
                        <label className="ctm-label">Nombre de la Actividad</label>
                        <input
                            className="ctm-input"
                            type="text"
                            placeholder="Ej: Mantenimiento de servidores"
                            value={formData.name}
                            onChange={handleChange('name')}
                            autoFocus
                        />
                    </div>

                    <div className="ctm-field">
                        <label className="ctm-label">Departamento</label>
                        {fixedDepartment ? (
                            <>
                                <input
                                    className="ctm-input"
                                    type="text"
                                    value={fixedDepartment}
                                    disabled
                                />
                                <span className="ctm-hint">La actividad se creará en este departamento</span>
                            </>
                        ) : (
                            <>
                                <select
                                    className="ctm-select"
                                    value={formData.department}
                                    onChange={handleChange('department')}
                                    disabled={isCoordinator}
                                >
                                    <option value="">Seleccionar departamento</option>
                                    {departments.map((d) => (
                                        <option key={d.name} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                                {isCoordinator && (
                                    <span className="ctm-hint">Solo puedes crear actividades en tu departamento</span>
                                )}
                            </>
                        )}
                    </div>

                    <div className="ctm-field">
                        <label className="ctm-label">Categoría</label>
                        <input
                            className="ctm-input"
                            type="text"
                            placeholder="Ej: Infraestructura"
                            value={formData.category}
                            onChange={handleChange('category')}
                        />
                    </div>

                    <div className="ctm-row">
                        <div className="ctm-field">
                            <label className="ctm-label">Mes Inicio</label>
                            <select
                                className="ctm-select"
                                value={formData.startMonth}
                                onChange={handleChange('startMonth')}
                            >
                                {MONTHS.map((m, i) => (
                                    <option key={i} value={i}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ctm-field">
                            <label className="ctm-label">Mes Fin</label>
                            <select
                                className="ctm-select"
                                value={formData.endMonth}
                                onChange={handleChange('endMonth')}
                            >
                                {MONTHS.map((m, i) => (
                                    <option key={i} value={i}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="ctm-actions">
                        <button
                            type="button"
                            className="ctm-btn ctm-btn--cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="ctm-btn ctm-btn--submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="ctm-spinner" /> Creando...
                                </>
                            ) : (
                                <>
                                    <FiPlus /> Crear Actividad
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
