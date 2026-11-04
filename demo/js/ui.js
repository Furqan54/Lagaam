import { getVideo, previewRange } from './data.js';

/* ---------- 3D tilt + glare + hover preview ---------- */
const canHover = matchMedia('(hover: hover)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCards(root = document) {
  root.querySelectorAll('.card:not([data-ready])').forEach((card) => {
    card.dataset.ready = '1';
    if (!canHover) return; // touch: tapping simply opens the watch page

    const max = parseFloat(card.dataset.tilt || 8);
    const layer = card.querySelector('.preview-layer');
    const id = card.dataset.id;
    let timer = null, iframe = null;

    const startPreview = () => {
      if (!layer || !id || iframe) return;
      iframe = document.createElement('iframe');
      // Hover preview: muted, a few seconds from the intro, looping. Never the whole video.
      const [s] = previewRange(getVideo(id) ?? {});
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${id}&start=${s}&end=${s + 12}&modestbranding=1`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.tabIndex = -1;
      iframe.title = 'Preview';
      iframe.addEventListener('load', () => card.classList.add('is-previewing'));
      layer.appendChild(iframe);
    };
    const stopPreview = () => {
      clearTimeout(timer);
      card.classList.remove('is-previewing');
      iframe?.remove();
      iframe = null;
    };

    card.addEventListener('pointerenter', () => {
      card.classList.add('is-hover');
      timer = setTimeout(startPreview, 450);
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      if (!reduced) {
        card.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2));
        card.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2));
      }
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-hover');
      card.style.setProperty('--rx', 0);
      card.style.setProperty('--ry', 0);
      stopPreview();
    });
  });
}

/* ---------- Carousels with arrow buttons ---------- */
export function initRails(root = document) {
  root.querySelectorAll('[data-rail]:not([data-ready])').forEach((rail) => {
    rail.dataset.ready = '1';
    const track = rail.querySelector('.rail-track');
    const buttons = document.querySelector(`[data-rail-for="${rail.dataset.rail}"]`);
    if (!buttons) return;
    const [prev, next] = buttons.querySelectorAll('.rail-btn');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 240) + 18;
    const update = () => {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step() * 2, behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();

    // Optional auto-loop: advances every few seconds, wraps back to the start,
    // pauses while the pointer or focus is inside, and is off for reduced-motion users.
    if (rail.dataset.autoplay && !reduced) {
      let paused = false;
      const tick = () => {
        if (!rail.isConnected) { clearInterval(timer); return; } // the section re-rendered
        if (paused || document.hidden || track.scrollWidth <= track.clientWidth) return;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
        if (atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollBy({ left: step(), behavior: 'smooth' });
      };
      const timer = setInterval(tick, Number(rail.dataset.autoplay) || 3500);
      const hold = (on) => () => { paused = on; };
      for (const el of [rail, buttons]) {
        el.addEventListener('pointerenter', hold(true));
        el.addEventListener('pointerleave', hold(false));
        el.addEventListener('focusin', hold(true));
        el.addEventListener('focusout', hold(false));
      }
      addEventListener('pagehide', () => clearInterval(timer));
    }
  });
}

/* ---------- Scroll reveal ---------- */
let revealIO;
export function initReveal(root = document) {
  revealIO ??= new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  root.querySelectorAll('.reveal:not(.in)').forEach((el) => revealIO.observe(el));
}

/* ---------- Animated counters ---------- */
export function initCounters(root = document) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const end = parseFloat(el.dataset.count), dec = +el.dataset.dec, suffix = el.dataset.suffix;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1600, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (end * eased).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  root.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
}
