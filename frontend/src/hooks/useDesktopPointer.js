import { useEffect, useState } from 'react';

// A desktop UA and a wide layout viewport are not proof of a mouse.
// Chrome's "Desktop site" can report both on a real touch-only phone.
export default function useDesktopPointer() {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const queries = ['(hover: hover) and (pointer: fine)', '(any-pointer: coarse)', '(prefers-reduced-motion: reduce)', '(min-width: 769px)'].map(q => window.matchMedia(q));
        const update = () => setEnabled(queries[0].matches && !queries[1].matches && !queries[2].matches && queries[3].matches && navigator.maxTouchPoints === 0);
        update();
        queries.forEach(q => q.addEventListener('change', update));
        window.addEventListener('resize', update);
        return () => {
            queries.forEach(q => q.removeEventListener('change', update));
            window.removeEventListener('resize', update);
        };
    }, []);
    return enabled;
}
