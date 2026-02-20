import { FiMessageSquare } from 'react-icons/fi';
import useObservationRead from '../../hooks/useObservationRead';

/**
 * Shows a chat icon next to task names.
 * Red + fully opaque if there are unread observations.
 * Grey + semi-transparent if all observations have been read.
 */
export default function ObservationIndicator({ activityId, count }) {
    const { hasUnread } = useObservationRead();
    const unread = hasUnread(activityId, count);

    return (
        <FiMessageSquare
            size={12}
            style={{
                marginLeft: 6,
                color: unread ? '#ef4444' : undefined,
                opacity: unread ? 1 : 0.5,
                transition: 'color 0.2s, opacity 0.2s',
            }}
        />
    );
}
