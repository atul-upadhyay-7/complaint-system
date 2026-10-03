import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SplashCursor from './SplashCursor';
import useDesktopPointer from '../../hooks/useDesktopPointer';
import './DesktopCursor.css';

// Nyric's dot and trailing ring, paired with React Bits SplashCursor.
function Pointer() {
    const dot = useRef(null);
    const ring = useRef(null);
    const [hover, setHover] = useState(false);
    useEffect(() => {
        let frame = 0;
        let moving = false;
        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        const draw = () => {
            current.x += (target.x - current.x) * 0.14;
            current.y += (target.y - current.y) * 0.14;
            ring.current.style.transform = `translate3d(${current.x}px,${current.y}px,0) translate(-50%,-50%)`;
            if (Math.hypot(target.x - current.x, target.y - current.y) > 0.1) frame = requestAnimationFrame(draw);
            else moving = false;
        };
        const move = e => {
            if (e.pointerType !== 'mouse') return;
            if (!dot.current.classList.contains('is-visible')) { current.x = e.clientX; current.y = e.clientY; }
            target.x = e.clientX; target.y = e.clientY;
            dot.current.classList.add('is-visible'); ring.current.classList.add('is-visible');
            dot.current.style.transform = `translate3d(${target.x}px,${target.y}px,0) translate(-50%,-50%)`;
            setHover(Boolean(e.target.closest('a,button,[role="button"],select,label[for]')));
            if (!moving) { moving = true; frame = requestAnimationFrame(draw); }
        };
        const leave = () => { dot.current.classList.remove('is-visible'); ring.current.classList.remove('is-visible'); };
        window.addEventListener('pointermove', move, { passive: true });
        document.addEventListener('pointerleave', leave);
        window.addEventListener('blur', leave);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('pointermove', move);
            document.removeEventListener('pointerleave', leave);
            window.removeEventListener('blur', leave);
        };
    }, []);
    return <div className="nyric-pointer" aria-hidden="true"><div ref={dot} className="nyric-pointer-dot" /><div ref={ring} className={`nyric-pointer-ring${hover ? ' is-hover' : ''}`} /></div>;
}

export default function DesktopCursor() {
    const enabled = useDesktopPointer();
    if (!enabled) return null;
    return createPortal(<><SplashCursor SIM_RESOLUTION={128} DYE_RESOLUTION={1024} CURL={3} COLOR="#309a5c" RAINBOW_MODE={false} /><Pointer /></>, document.body);
}
