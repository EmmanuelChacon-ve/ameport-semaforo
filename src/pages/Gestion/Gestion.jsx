import { FiCalendar, FiUsers } from 'react-icons/fi';
import GestionGantt from '../../components/GestionGantt/GestionGantt';
import './Gestion.css';

export default function Gestion() {
    return (
        <div className="gestion page-enter">
            <header className="gestion__header">
                <div className="gestion__header-left">
                    <div className="gestion__icon-wrapper">
                        <FiUsers />
                    </div>
                    <div>
                        <h1 className="gestion__title">Gestión de Asociados</h1>
                        <p className="gestion__subtitle">
                            Planificación y seguimiento de actividades 2026
                        </p>
                    </div>
                </div>
                <div className="gestion__header-right">
                    <div className="gestion__date">
                        <FiCalendar className="gestion__date-icon" />
                        <span>
                            {new Date().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>
            </header>
            <main className="gestion__content">
                <GestionGantt />
            </main>
        </div>
    );
}
