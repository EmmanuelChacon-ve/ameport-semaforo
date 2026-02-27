import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Mapa de departamentos a rutas del frontend.
 * Se usa para redirigir coordinadores a su primer departamento.
 */
const deptRouteMap = {
    'Coordinación General': '/coordinacion-general',
    'Sistemas': '/sistemas',
    'Turismo': '/turismo',
    'Salud y Recreación': '/salud',
    'Comunicación y Marketing': '/comunicacion',
    'Mantenimiento': '/mantenimiento',
    'Gestión de Asociados': '/gestion',
    'Finanzas': '/finanzas',
    'Crecimiento': '/crecimiento',
    'Consumo': '/consumo',
};

/**
 * Protege rutas exclusivas de administradores (Dashboard, Reportes).
 * Coordinadores son redirigidos a su primer departamento asignado.
 */
export default function AdminRoute({ children }) {
    const { user } = useAuth();

    if (user?.role === 'admin') return children;

    // Redirigir al primer departamento del coordinador
    const firstDept = (user?.departments || [])[0];
    const redirectTo = deptRouteMap[firstDept] || '/login';

    return <Navigate to={redirectTo} replace />;
}
