import { FiCalendar, FiDollarSign } from 'react-icons/fi';
import FinGantt from '../../components/FinGantt/FinGantt';
import './Finanzas.css';

export default function Finanzas() {
    return (
        <div className="finanzas page-enter">
            <header className="finanzas__header">
                <div className="finanzas__header-left">
                    <div className="finanzas__icon-wrapper"><FiDollarSign /></div>
                    <div>
                        <h1 className="finanzas__title">Finanzas</h1>
                        <p className="finanzas__subtitle">Planificación y seguimiento de actividades 2026</p>
                    </div>
                </div>
                <div className="finanzas__header-right">
                    <div className="finanzas__date"><FiCalendar className="finanzas__date-icon" />
                        <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="finanzas__content"><FinGantt /></main>
        </div>
    );
}
