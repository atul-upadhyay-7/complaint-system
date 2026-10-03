import { useEffect, useState } from 'react';

export default function MobileViewportNotice() {
    const [widePhone, setWidePhone] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    useEffect(() => {
        const check = () => {
            const width = Math.min(screen.width, screen.height);
            setWidePhone(navigator.maxTouchPoints > 0 && width < 768 && innerWidth >= 768 && innerWidth > width * 1.3);
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    if (!widePhone || dismissed) return null;
    return <aside data-mobile-viewport-notice className="mobile-viewport-notice" role="status"><span>This browser is showing a desktop-sized page. For the phone layout, open your browser menu and turn off "Desktop site", then reload.</span><button onClick={() => setDismissed(true)} aria-label="Dismiss mobile view tip">Close</button></aside>;
}
