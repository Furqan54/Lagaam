import { useEffect, useRef, useState } from 'react';
import { introActive, finishIntro } from '../lib/intro.js';
import { Logo } from './Logo.jsx';

const MIN_MS = 1900;   // the intro always lasts at least this long
const MAX_MS = 3600;   // and never longer, even if fonts are slow

/** Full-screen loading intro: logo, progress line, counter, then the curtain slides up. */
export default function Intro() {
  const [phase, setPhase] = useState(introActive ? 'in' : 'gone'); // in -> leaving -> gone
  const count = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    if (!introActive) return undefined;
    document.documentElement.classList.add('intro-lock');
    let raf = 0;
    let fontsReady = false;
    let leaving = false;
    const t0 = performance.now();
    (document.fonts?.ready ?? Promise.resolve()).then(() => { fontsReady = true; });

    const tick = (now) => {
      const elapsed = Math.max(0, now - t0);
      const p = Math.min(elapsed / MIN_MS, 1);
      // hold at 99 until the fonts are ready, so the page does not reveal with the wrong typeface
      const waiting = p >= 1 && !fontsReady && elapsed < MAX_MS;
      const value = waiting ? 99 : Math.round((1 - (1 - p) ** 2) * 100);
      if (count.current) count.current.textContent = String(value).padStart(2, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${value / 100})`;
      if (value >= 100 && !leaving) {
        leaving = true;
        setPhase('leaving');
        finishIntro();                       // text and cards start assembling as the curtain lifts
        setTimeout(() => setPhase('gone'), 1000);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase === 'gone') document.documentElement.classList.remove('intro-lock');
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div className={`intro ${phase === 'leaving' ? 'is-leaving' : ''}`} role="status" aria-live="polite" aria-label="Loading Lagaam">
      <div className="intro-inner">
        <div className="intro-logo"><Logo /></div>
        <p className="intro-tag">Truth, Unfiltered &amp; Bold</p>
        <div className="intro-bar" aria-hidden="true"><i ref={bar} /></div>
      </div>
      <div className="intro-count" aria-hidden="true"><span ref={count}>00</span><small>%</small></div>
    </div>
  );
}
