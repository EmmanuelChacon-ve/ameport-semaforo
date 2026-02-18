import { STATUS_CONFIG } from '../../utils/semaforoUtils';
import { useTasks } from '../../context/TaskContext';
import './StatusCard.css';

export default function StatusCard({ status }) {
    const { statusCounts, activeFilter, setActiveFilter } = useTasks();
    const config = STATUS_CONFIG[status];
    const count = statusCounts[status] || 0;
    const isActive = activeFilter === status;

    const handleClick = () => {
        setActiveFilter(isActive ? null : status);
    };

    return (
        <button
            className={`status-card ${isActive ? 'status-card--active' : ''}`}
            onClick={handleClick}
            style={{
                '--card-color': config.color,
                '--card-bg': config.bgLight,
            }}
        >
            <div className="status-card__indicator">
                <span className="status-card__dot" />
            </div>
            <div className="status-card__content">
                <span className="status-card__count">{count}</span>
                <span className="status-card__label">{config.label}</span>
            </div>
            {isActive && <span className="status-card__active-badge">Filtrado</span>}
        </button>
    );
}
