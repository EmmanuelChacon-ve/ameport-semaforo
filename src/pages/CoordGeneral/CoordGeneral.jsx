import { FiCalendar, FiBriefcase } from 'react-icons/fi';
import CoordGenGantt from '../../components/CoordGenGantt/CoordGenGantt';
import './CoordGeneral.css';

export default function CoordGeneral() {
    return (
        <div className="coordgeneral page-enter">
            <header className="coordgeneral__header">
                <div className="coordgeneral__header-left">
                    <div className="coordgeneral__icon-wrapper"><FiBriefcase /></div>
                    <div>
                        <h1 className="coordgeneral__title">Coordinación General</h1>
                        <p className="coordgeneral__subtitle">Planificación y seguimiento de actividades 2026</p>
                    </div>
                </div>
                <div className="coordgeneral__header-right">
                    <div className="coordgeneral__date"><FiCalendar className="coordgeneral__date-icon" />
                        <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>
            <main className="coordgeneral__content"><CoordGenGantt /></main>
        </div>
    );
}
