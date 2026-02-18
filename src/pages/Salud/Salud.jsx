import { FiCalendar, FiHeart } from 'react-icons/fi';
import SaludGantt from '../../components/SaludGantt/SaludGantt';
import './Salud.css';

export default function Salud() {
    return (
        <div className="salud page-enter">
            <header className="salud__header">
                <div className="salud__header-left">
                    <div className="salud__icon-wrapper">
                        <FiHeart />
                    </div>
                    <div>
                        <h1 className="salud__title">Salud y Recreación</h1>
                        <p className="salud__subtitle">
                            Planificación y seguimiento de actividades 2026
                        </p>
                    </div>
                </div>
                <div className="salud__header-right">
                    <div className="salud__date">
                        <FiCalendar className="salud__date-icon" />
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

            <main className="salud__content">
                <SaludGantt />
            </main>
        </div>
    );
}
