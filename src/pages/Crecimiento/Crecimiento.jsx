import { FiCalendar, FiTrendingUp } from 'react-icons/fi';
import CrecGantt from '../../components/CrecGantt/CrecGantt';
import './Crecimiento.css';

export default function Crecimiento() {
    return (
        <div className="crecimiento page-enter">
            <header className="crecimiento__header">
                <div className="crecimiento__header-left">
                    <div className="crecimiento__icon-wrapper"><FiTrendingUp /></div>
                    <div>
                        <h1 className="crecimiento__title">Crecimiento</h1>
                        <p className="crecimiento__subtitle">Planificación y seguimiento de actividades 2026</p>
                    </div>
                </div>
                <div className="crecimiento__header-right">
                    <div className="crecimiento__date"><FiCalendar className="crecimiento__date-icon" />
                        <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="crecimiento__content"><CrecGantt /></main>
        </div>
    );
}
