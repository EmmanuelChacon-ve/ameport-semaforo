import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protege rutas de departamento.
 * - Admins: acceso a todo.
 * - Coordinadores: sólo a los departamentos en su array 'departments'.
 *
 * @param {string} deptKey — nombre exacto del departamento en Firestore
 */
export default function DeptRoute({ deptKey, children }) {
    const { user } = useAuth();

    // Admins tienen acceso total
    if (user?.role === 'admin') return children;

    // Verificar si el usuario tiene permiso para este departamento
    const allowed = (user?.departments || []).includes(deptKey);

    if (!allowed) {
        return <Navigate to="/" replace />;
    }

    return children;
}
