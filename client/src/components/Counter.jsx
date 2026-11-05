import { useLayoutEffect, useRef } from 'react';
import { intro } from '../lib/intro.js';

const format = (n, decimals) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const randDigit = () => String(Math.floor(Math.random() * 10));

/**
 * A number that "decodes" the first time it scrolls into view: every digit flickers through random values
 * and settles into place from left to right. Commas, dots and suffix letters (K, M, +, $) stay put,
 * so the width never jumps. Writes straight to the DOM, so it costs no React renders while it runs.
 */
export function DecodeNumber({ text, as: Tag = 'strong', className }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined; // final number stays as rendered

    const chars = [...text];
    const digitIdx = chars.map((c, i) => (/[0-9]/.test(c) ? i : -1)).filter((i) => i >= 0);
    let raf = 0;
    let cancelled = false;
    let io;

    const render = (settled) => {
      // `settled` = how many of the digits (left to right) already show their final value
      let d = 0;
      el.textContent = chars.map((c) => (/[0-9]/.test(c) ? (d++ < settled ? c : randDigit()) : c)).join('');
    };

    render(0); // scrambled before the first paint
    el.setAttribute('aria-label', text);

    const run = () => {
      const t0 = performance.now();
      const duration = 1500 + digitIdx.length * 120;
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        if (p >= 1) { el.textContent = text; el.removeAttribute('aria-label'); return; }
        render(Math.floor((1 - (1 - p) ** 2) * (digitIdx.length + 0.999)));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    intro.done.then(() => {
      if (cancelled) return;
      io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      }, { threshold: 0.6 });
      io.observe(el);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      el.textContent = text;
      el.removeAttribute('aria-label');
    };
  }, [text]);

  return <Tag ref={ref} className={className}>{text}</Tag>;
}

/** The stat numbers (1.25M, 2,000+, ...) as a decoding number. */
export default function Counter({ value, decimals = 0, suffix = '' }) {
  return <DecodeNumber text={`${format(value, decimals)}${suffix}`} />;
}
