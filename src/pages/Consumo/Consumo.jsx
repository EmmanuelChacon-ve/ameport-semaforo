import { FiCalendar, FiShoppingCart } from 'react-icons/fi';
import ConsumoGantt from '../../components/ConsumoGantt/ConsumoGantt';
import './Consumo.css';

export default function Consumo() {
    return (
        <div className="consumo page-enter">
            <header className="consumo__header">
                <div className="consumo__header-left">
                    <div className="consumo__icon-wrapper"><FiShoppingCart /></div>
                    <div>
                        <h1 className="consumo__title">Consumo</h1>
                        <p className="consumo__subtitle">Planificación y seguimiento de actividades 2026</p>
                    </div>
                </div>
                <div className="consumo__header-right">
                    <div className="consumo__date"><FiCalendar className="consumo__date-icon" />
                        <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="consumo__content"><ConsumoGantt /></main>
        </div>
    );
}
