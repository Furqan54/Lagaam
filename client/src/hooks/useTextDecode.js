import { useLayoutEffect } from 'react';
import { intro } from '../lib/intro.js';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const rnd = (set) => set[Math.floor(Math.random() * set.length)];

// Letters stay the same kind of character (capital, small, digit) so line widths barely move while scrambled.
const noise = (ch) => (/[A-Z]/.test(ch) ? rnd(UPPER) : /[a-z]/.test(ch) ? rnd(LOWER) : /[0-9]/.test(ch) ? rnd(DIGIT) : ch);

const TARGETS = 'h1, h2, .lede, .hero-sub';
const SKIP_INSIDE = '.card, .player, .empty, .flip, .tilt-scene';

const textNodesOf = (el) => {
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) nodes.push(n);
  return nodes;
};

/**
 * "Decode" effect: headings and intro text start as scrambled characters and resolve left to right
 * the first time they scroll into view. Works on the rendered DOM, so no page markup has to change.
 * Skipped entirely for people who prefer reduced motion.
 */
export default function useTextDecode(routeKey) {
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let cancelled = false;
    const items = [];
    let raf = 0;
    let observer;

    const targets = [...document.querySelectorAll(TARGETS)].filter((el) => !el.closest(SKIP_INSIDE));
    for (const el of targets) {
      const nodes = textNodesOf(el).map((node) => ({ node, text: node.nodeValue }));
      if (!nodes.length) continue;
      const total = nodes.reduce((s, n) => s + n.text.length, 0);
      const item = { el, nodes, total, start: 0, duration: Math.min(500 + total * 14, 1700), done: false, active: false };
      items.push(item);
      // Start scrambled before the first paint so the real words never flash.
      for (const n of nodes) n.node.nodeValue = [...n.text].map(noise).join('');
      if (/^H[1-6]$/.test(el.tagName)) el.setAttribute('aria-label', nodes.map((n) => n.text.trim()).join(' '));
    }

    const finish = (item) => {
      for (const n of item.nodes) n.node.nodeValue = n.text;
      item.el.removeAttribute('aria-label');
      item.done = true;
      item.active = false;
    };

    const tick = (now) => {
      let running = false;
      for (const item of items) {
        if (!item.active) continue;
        const p = Math.min((now - item.start) / item.duration, 1);
        if (p >= 1) { finish(item); continue; }
        running = true;
        const eased = 1 - (1 - p) ** 2;
        let revealed = Math.floor(eased * item.total);
        for (const n of item.nodes) {
          const chars = [...n.text];
          n.node.nodeValue = chars.map((ch, i) => (i < revealed ? ch : noise(ch))).join('');
          revealed = Math.max(0, revealed - chars.length);
        }
      }
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const begin = (item) => {
      if (item.done || item.active) return;
      item.active = true;
      item.start = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    intro.done.then(() => {
      if (cancelled) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const item = items.find((i) => i.el === entry.target);
          if (item) { begin(item); observer.unobserve(entry.target); }
        }
      }, { threshold: 0.25 });
      items.forEach((i) => observer.observe(i.el));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      items.forEach(finish); // always leave the real text behind
    };
  }, [routeKey]);
}
