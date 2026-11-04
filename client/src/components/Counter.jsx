import { useEffect, useRef, useState } from 'react';

const format = (n, decimals) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** A number that counts up once when it scrolls into view. */
export default function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null);
  const [text, setText] = useState(`${format(0, decimals)}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1600, 1);
        const eased = 1 - (1 - p) ** 3;
        setText(`${format(value * eased, decimals)}${suffix}`);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, suffix]);

  return <strong ref={ref}>{text}</strong>;
}
