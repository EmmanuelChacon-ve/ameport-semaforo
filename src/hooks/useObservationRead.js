import { createContext, useContext, useState, useCallback, useMemo, useEffect, createElement } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchObsReadCounts, markObsReadApi } from '../services/api';

const ObsReadContext = createContext(null);

/**
 * Provider that wraps the app so every ObservationIndicator reacts
 * when markAsRead is called from ActivityDetailModal.
 *
 * Read counts are persisted PER USER in Firestore.
 * Re-fetches every time the authenticated user changes (login/logout).
 */
export function ObsReadProvider({ children }) {
    const { token } = useAuth();
    const [readMap, setReadMap] = useState({});
    const [loaded, setLoaded] = useState(false);

    // Re-load the read-count map every time the token changes (user login/logout)
    useEffect(() => {
        // No token → user is logged out, clear everything
        if (!token) {
            setReadMap({});
            setLoaded(true);
            return;
        }

        let cancelled = false;
        setLoaded(false);

        fetchObsReadCounts()
            .then((counts) => {
                if (!cancelled) {
                    setReadMap(counts || {});
                    setLoaded(true);
                }
            })
            .catch((err) => {
                console.error('Error cargando conteos de lectura:', err);
                if (!cancelled) {
                    setReadMap({});
                    setLoaded(true);
                }
            });

        return () => { cancelled = true; };
    }, [token]);

    const hasUnread = useCallback((activityId, currentCount) => {
        if (!activityId || !currentCount) return false;
        const lastRead = readMap[activityId] || 0;
        return currentCount > lastRead;
    }, [readMap]);

    const markAsRead = useCallback((activityId, currentCount) => {
        if (!activityId) return;

        // Optimistic update
        setReadMap((prev) => ({ ...prev, [activityId]: currentCount || 0 }));

        // Persist to backend (fire-and-forget)
        markObsReadApi(activityId, currentCount || 0).catch((err) =>
            console.error('Error guardando lectura:', err)
        );
    }, []);

    const value = useMemo(() => ({ hasUnread, markAsRead, loaded }), [hasUnread, markAsRead, loaded]);

    return createElement(ObsReadContext.Provider, { value }, children);
}

/**
 * Hook to access shared observation-read state.
 * Must be used inside ObsReadProvider.
 */
export default function useObservationRead() {
    const ctx = useContext(ObsReadContext);
    if (!ctx) {
        throw new Error('useObservationRead must be used within ObsReadProvider');
    }
    return ctx;
}
