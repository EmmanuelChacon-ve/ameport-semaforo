import { FiCalendar, FiMapPin } from 'react-icons/fi';
import TurismoGantt from '../../components/TurismoGantt/TurismoGantt';
import './Turismo.css';

export default function Turismo() {
    return (
        <div className="turismo page-enter">
            <header className="turismo__header">
                <div className="turismo__header-left">
                    <div className="turismo__icon-wrapper">
                        <FiMapPin />
                    </div>
                    <div>
                        <h1 className="turismo__title">Departamento de Turismo</h1>
                        <p className="turismo__subtitle">
                            Turismo Social · Lima 265-ACARA · Agencia Ameport — 2026
                        </p>
                    </div>
                </div>
                <div className="turismo__header-right">
                    <div className="turismo__date">
                        <FiCalendar className="turismo__date-icon" />
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

            <main className="turismo__content">
                <TurismoGantt />
            </main>
        </div>
    );
}
