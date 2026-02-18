import { useState, useEffect, useRef } from 'react';
import './AnimatedCounter.css';

export default function AnimatedCounter({ target, duration = 600 }) {
    const [count, setCount] = useState(0);
    const prevTarget = useRef(target);

    useEffect(() => {
        const start = prevTarget.current !== target ? 0 : count;
        prevTarget.current = target;

        if (target === 0) {
            setCount(0);
            return;
        }

        const startTime = performance.now();

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.round(start + (target - start) * easedProgress);

            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [target, duration]);

    return <span className="animated-counter">{count}</span>;
}
