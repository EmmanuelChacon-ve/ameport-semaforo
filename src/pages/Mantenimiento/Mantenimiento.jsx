import { FiCalendar, FiTool } from 'react-icons/fi';
import MantGantt from '../../components/MantGantt/MantGantt';
import './Mantenimiento.css';

export default function Mantenimiento() {
    return (
        <div className="mantenimiento page-enter">
            <header className="mantenimiento__header">
                <div className="mantenimiento__header-left">
                    <div className="mantenimiento__icon-wrapper">
                        <FiTool />
                    </div>
                    <div>
                        <h1 className="mantenimiento__title">Mantenimiento</h1>
                        <p className="mantenimiento__subtitle">
                            Planificación y seguimiento de actividades 2026
                        </p>
                    </div>
                </div>
                <div className="mantenimiento__header-right">
                    <div className="mantenimiento__date">
                        <FiCalendar className="mantenimiento__date-icon" />
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
            <main className="mantenimiento__content">
                <MantGantt />
            </main>
        </div>
    );
}
