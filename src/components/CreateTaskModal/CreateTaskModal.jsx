import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiPlus, FiLoader, FiCheck } from 'react-icons/fi';
import { fetchDepartmentsMetadata, addDepartmentCategory } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CreateTaskModal.css';

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function CreateTaskModal({ isOpen, onClose, onSubmit, fixedDepartment }) {
    const { user, token } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isCoordinator = user?.role === 'coordinator';

    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        category: '',
        startMonth: new Date().getMonth(),
        endMonth: new Date().getMonth(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // New category creation state
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);

    // Load departments for the dropdown
    useEffect(() => {
        if (!isOpen) return;
        fetchDepartmentsMetadata()
            .then((depts) => {
                setDepartments(depts);
                if (!fixedDepartment) {
                    if (isCoordinator && user?.departments?.length > 0) {
                        setFormData((prev) => ({ ...prev, department: user.departments[0] }));
                    } else if (depts.length > 0 && !formData.department) {
                        setFormData((prev) => ({ ...prev, department: depts[0].name }));
                    }
                }
            })
            .catch(() => setError('Error cargando departamentos'));
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update categories when department changes
    useEffect(() => {
        const deptName = fixedDepartment || formData.department;
        if (!deptName || departments.length === 0) {
            setCategories([]);
            return;
        }
        const dept = departments.find((d) => d.name === deptName);
        setCategories(dept?.categories || []);
    }, [formData.department, fixedDepartment, departments]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setError('');
            setShowNewCategory(false);
            setNewCategoryName('');
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

    // Lock body scroll while modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (field) => (e) => {
        const value = field === 'startMonth' || field === 'endMonth'
            ? parseInt(e.target.value, 10)
            : e.target.value;
        setFormData((prev) => {
            const next = { ...prev, [field]: value };
            // If startMonth changed and is now after endMonth, auto-adjust endMonth
            if (field === 'startMonth' && value > prev.endMonth) {
                next.endMonth = value;
            }
            return next;
        });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === '__new__') {
            setShowNewCategory(true);
            setFormData((prev) => ({ ...prev, category: '' }));
        } else {
            setShowNewCategory(false);
            setNewCategoryName('');
            setFormData((prev) => ({ ...prev, category: value }));
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        const deptName = fixedDepartment || formData.department;
        const dept = departments.find((d) => d.name === deptName);
        if (!dept) return;

        setCreatingCategory(true);
        setError('');
        try {
            await addDepartmentCategory(dept.id, newCategoryName.trim(), token);
            // Refresh departments to get updated categories
            const updatedDepts = await fetchDepartmentsMetadata();
            setDepartments(updatedDepts);
            // Select the newly created category
            setFormData((prev) => ({ ...prev, category: newCategoryName.trim() }));
            setShowNewCategory(false);
            setNewCategoryName('');
        } catch (err) {
            setError(err.message || 'Error al crear la categoría');
        } finally {
            setCreatingCategory(false);
        }
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
        if (formData.endMonth < formData.startMonth) {
            setError('El mes de fin no puede ser anterior al mes de inicio');
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

    return createPortal(
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
                        {!showNewCategory ? (
                            <select
                                className="ctm-select"
                                value={formData.category}
                                onChange={handleCategoryChange}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                {isAdmin && (
                                    <option value="__new__">➕ Crear nueva categoría...</option>
                                )}
                            </select>
                        ) : (
                            <div className="ctm-new-category">
                                <input
                                    className="ctm-input ctm-new-category__input"
                                    type="text"
                                    placeholder="Nombre de la nueva categoría"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreateCategory();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="ctm-new-category__btn ctm-new-category__btn--create"
                                    onClick={handleCreateCategory}
                                    disabled={creatingCategory || !newCategoryName.trim()}
                                    title="Crear categoría"
                                >
                                    {creatingCategory ? <FiLoader className="ctm-spinner" /> : <FiCheck />}
                                </button>
                                <button
                                    type="button"
                                    className="ctm-new-category__btn ctm-new-category__btn--cancel"
                                    onClick={() => {
                                        setShowNewCategory(false);
                                        setNewCategoryName('');
                                    }}
                                    title="Cancelar"
                                >
                                    <FiX />
                                </button>
                            </div>
                        )}
                        {categories.length === 0 && !showNewCategory && (
                            <span className="ctm-hint">
                                {isAdmin
                                    ? 'No hay categorías. Selecciona "Crear nueva categoría" para agregar una.'
                                    : 'No hay categorías disponibles para este departamento.'}
                            </span>
                        )}
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
                                    <option key={i} value={i} disabled={i < formData.startMonth}>{m}</option>
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
        </div>,
        document.body
    );
}
