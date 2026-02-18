import { FiCalendar } from 'react-icons/fi';
import './Header.css';

export default function Header() {
    const today = new Date();
    const formatted = today.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="header">
            <div className="header__left">
                <h1 className="header__title">
                    Filtro de Semáforo
                </h1>
                <p className="header__subtitle">
                    Panel de seguimiento y control de actividades AMEPORT
                </p>
            </div>
            <div className="header__right">
                <div className="header__date">
                    <FiCalendar className="header__date-icon" />
                    <span>{formatted}</span>
                </div>
            </div>
        </header>
    );
}
