import { useCallback, useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Carousel logic: scroll buttons, start/end detection and an optional auto-loop.
 * The auto-loop advances every `autoplay` ms, wraps back to the start, pauses while the pointer or
 * focus is inside the carousel (or its buttons), and stays off for reduced-motion users.
 * `watch` is any value that changes when the cards change, so the hook can reset and re-measure.
 */
export default function useRail({ autoplay = 0, watch } = {}) {
  const track = useRef(null);
  const paused = useRef(false);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setEdge({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 8 });
  }, []);

  const step = () => (track.current?.firstElementChild?.getBoundingClientRect().width || 240) + 18;

  useEffect(() => {
    const t = track.current;
    if (!t) return undefined;
    t.scrollLeft = 0;
    update();
    t.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      t.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, watch]);

  useEffect(() => {
    if (!autoplay || prefersReducedMotion()) return undefined;
    const id = setInterval(() => {
      const t = track.current;
      if (!t || paused.current || document.hidden || t.scrollWidth <= t.clientWidth) return;
      const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8;
      if (atEnd) t.scrollTo({ left: 0, behavior: 'smooth' });
      else t.scrollBy({ left: step(), behavior: 'smooth' });
    }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, watch]);

  const hold = {
    onPointerEnter: () => { paused.current = true; },
    onPointerLeave: () => { paused.current = false; },
    onFocus: () => { paused.current = true; },
    onBlur: () => { paused.current = false; },
  };

  return {
    track,
    edge,
    hold,
    prev: () => track.current?.scrollBy({ left: -step() * 2, behavior: 'smooth' }),
    next: () => track.current?.scrollBy({ left: step() * 2, behavior: 'smooth' }),
  };
}
