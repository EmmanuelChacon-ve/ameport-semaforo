import { STATUS_CONFIG } from '../../utils/semaforoUtils';
import './StatusBadge.css';

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status];
    if (!config) return null;

    return (
        <span
            className="status-badge"
            style={{
                '--badge-color': config.color,
                '--badge-bg': config.bgLight,
            }}
        >
            <span className="status-badge__dot" />
            <span className="status-badge__label">{config.label}</span>
        </span>
    );
}
