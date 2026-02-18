import { FiCalendar, FiMic } from 'react-icons/fi';
import ComGantt from '../../components/ComGantt/ComGantt';
import './Comunicacion.css';

export default function Comunicacion() {
    return (
        <div className="comunicacion page-enter">
            <header className="comunicacion__header">
                <div className="comunicacion__header-left">
                    <div className="comunicacion__icon-wrapper">
                        <FiMic />
                    </div>
                    <div>
                        <h1 className="comunicacion__title">Comunicación y Marketing</h1>
                        <p className="comunicacion__subtitle">
                            Planificación y seguimiento de actividades 2026
                        </p>
                    </div>
                </div>
                <div className="comunicacion__header-right">
                    <div className="comunicacion__date">
                        <FiCalendar className="comunicacion__date-icon" />
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
            <main className="comunicacion__content">
                <ComGantt />
            </main>
        </div>
    );
}
