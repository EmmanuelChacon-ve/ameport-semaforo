import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ObsReadProvider } from './hooks/useObservationRead';
import DeptRoute from './components/DeptRoute/DeptRoute';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import Login from './pages/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Sistemas from './pages/Sistemas/Sistemas';
import Turismo from './pages/Turismo/Turismo';
import Salud from './pages/Salud/Salud';
import Comunicacion from './pages/Comunicacion/Comunicacion';
import Mantenimiento from './pages/Mantenimiento/Mantenimiento';
import Gestion from './pages/Gestion/Gestion';
import Finanzas from './pages/Finanzas/Finanzas';
import Crecimiento from './pages/Crecimiento/Crecimiento';
import Consumo from './pages/Consumo/Consumo';
import Reportes from './pages/Reportes/Reportes';
import ActivityDetail from './pages/ActivityDetail/ActivityDetail';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <Routes>
          <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/reportes" element={<AdminRoute><Reportes /></AdminRoute>} />
          <Route path="/sistemas" element={<DeptRoute deptKey="Sistemas"><Sistemas /></DeptRoute>} />
          <Route path="/turismo" element={<DeptRoute deptKey="Turismo"><Turismo /></DeptRoute>} />
          <Route path="/salud" element={<DeptRoute deptKey="Salud y Recreación"><Salud /></DeptRoute>} />
          <Route path="/comunicacion" element={<DeptRoute deptKey="Comunicación y Marketing"><Comunicacion /></DeptRoute>} />
          <Route path="/mantenimiento" element={<DeptRoute deptKey="Mantenimiento"><Mantenimiento /></DeptRoute>} />
          <Route path="/gestion" element={<DeptRoute deptKey="Gestión de Asociados"><Gestion /></DeptRoute>} />
          <Route path="/finanzas" element={<DeptRoute deptKey="Finanzas"><Finanzas /></DeptRoute>} />
          <Route path="/crecimiento" element={<DeptRoute deptKey="Crecimiento"><Crecimiento /></DeptRoute>} />
          <Route path="/consumo" element={<DeptRoute deptKey="Consumo"><Consumo /></DeptRoute>} />
          <Route path="/actividad/:id" element={<ActivityDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <ObsReadProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ObsReadProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
