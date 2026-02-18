import { FiCalendar, FiMonitor } from 'react-icons/fi';
import GanttChart from '../../components/GanttChart/GanttChart';
import './Sistemas.css';

export default function Sistemas() {
    return (
        <div className="sistemas page-enter">
            <header className="sistemas__header">
                <div className="sistemas__header-left">
                    <div className="sistemas__icon-wrapper">
                        <FiMonitor />
                    </div>
                    <div>
                        <h1 className="sistemas__title">Departamento de Sistemas</h1>
                        <p className="sistemas__subtitle">
                            Planificación y seguimiento de actividades 2026
                        </p>
                    </div>
                </div>
                <div className="sistemas__header-right">
                    <div className="sistemas__date">
                        <FiCalendar className="sistemas__date-icon" />
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

            <main className="sistemas__content">
                <GanttChart />
            </main>
        </div>
    );
}
