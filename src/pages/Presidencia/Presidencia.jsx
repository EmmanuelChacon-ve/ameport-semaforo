import { FiCalendar, FiStar } from 'react-icons/fi';
import PresidenciaGantt from '../../components/PresidenciaGantt/PresidenciaGantt';
import './Presidencia.css';

export default function Presidencia() {
    return (
        <div className="presidencia page-enter">
            <header className="presidencia__header">
                <div className="presidencia__header-left">
                    <div className="presidencia__icon-wrapper"><FiStar /></div>
                    <div>
                        <h1 className="presidencia__title">Presidencia</h1>
                        <p className="presidencia__subtitle">Planificación y seguimiento de actividades 2026</p>
                    </div>
                </div>
                <div className="presidencia__header-right">
                    <div className="presidencia__date"><FiCalendar className="presidencia__date-icon" />
                        <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="presidencia__content"><PresidenciaGantt /></main>
        </div>
    );
}
