import { useEffect, useRef, useState } from 'react';
import { intro } from '../lib/intro.js';

/** Fades and lifts its content in the first time it scrolls into view. `i` staggers siblings. */
export default function Reveal({ as: Tag = 'div', i = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    let io;
    let cancelled = false;
    // wait for the loading intro to lift so the entrance is actually seen
    intro.done.then(() => {
      if (cancelled) return;
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      }, { threshold: 0.1 });
      io.observe(el);
    });
    return () => { cancelled = true; io?.disconnect(); };
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
