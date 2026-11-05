import { useEffect, useRef } from 'react';

// Colours come from the Lagaam logo palette: brand burgundy, a lighter rose of the same hue, and a pale blush for highlights.
const PALETTE = [
  [224, 86, 140],  // rose
  [224, 86, 140],
  [183, 37, 95],   // mid burgundy
  [125, 13, 67],   // deep burgundy
  [255, 205, 228], // blush highlight
];

const RIBBONS = 10;
const SCALE = 0.5;    // the glow is soft anyway: draw at half size and let CSS stretch it, 4x fewer pixels
const FRAME_MS = 33;  // about 30fps is plenty for slow drifting light
const rand = (a, b) => a + Math.random() * (b - a);

/**
 * Fixed, full-page background of slow flowing light ribbons.
 * It sits behind all content (z-index -1), drifts with scroll for depth, pauses when the tab is hidden,
 * and renders a single still frame for people who prefer reduced motion.
 */
export default function WaveBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ribbons = Array.from({ length: RIBBONS }, (_, i) => ({
      lane: i / RIBBONS,                 // vertical position as a fraction of the screen
      depth: rand(0.4, 1.4),             // how strongly it drifts with scroll
      amp1: rand(50, 130), amp2: rand(14, 44),
      f1: rand(0.0011, 0.0024), f2: rand(0.0035, 0.0072),
      s1: rand(0.18, 0.42), s2: rand(0.25, 0.6),
      phase: rand(0, Math.PI * 2),
      width: rand(1.1, 3),
      alpha: rand(0.28, 0.6),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));

    let w = 0, h = 0, raf = 0, last = 0, t = 0, scrolling = false, idle = 0;
    const onScroll = () => {
      scrolling = true;
      clearTimeout(idle);
      idle = setTimeout(() => { scrolling = false; }, 140);
    };

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * SCALE); canvas.height = Math.round(h * SCALE);
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      for (const r of ribbons) {          // gradients only depend on the width, so build them once here
        const [cr, cg, cb] = r.color;
        r.grad = ctx.createLinearGradient(0, 0, w, 0);
        r.grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
        r.grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${r.alpha})`);
        r.grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const scroll = window.scrollY;
      const span = h + 240;
      for (const r of ribbons) {
        const baseY = ((((r.lane * h * 1.15) - scroll * 0.09 * r.depth) % span) + span) % span - 120;
        // a wide faint pass for the glow and a thin bright core
        for (const [lw, a] of [[r.width * 6, 0.3], [r.width, 1]]) {
          ctx.beginPath();
          for (let x = -20; x <= w + 20; x += 40) {
            const y = baseY
              + Math.sin(x * r.f1 + t * r.s1 + r.phase) * r.amp1
              + Math.sin(x * r.f2 - t * r.s2 + r.phase * 2) * r.amp2;
            if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.lineWidth = lw; ctx.globalAlpha = a; ctx.strokeStyle = r.grad; ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS || scrolling) return; // never compete with scrolling for the frame
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now; t += dt;
      draw();
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };

    resize();
    draw(); // first frame straight away
    if (!reduced) raf = requestAnimationFrame((n) => { last = n; loop(n); });
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="wave-bg" aria-hidden="true" />;
}
