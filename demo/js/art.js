import { videos, thumb } from './data.js';

/**
 * Fills every <div class="hero-art" data-art="doc"> with four tilted video thumbnails
 * so inner-page heroes have real imagery behind the heading.
 * data-art: doc | podcast | mix (mix = documentaries + podcasts). Shorts thumbnails are
 * pillarboxed, so they are never used here.
 */
export function initHeroArt(root = document) {
  root.querySelectorAll('.hero-art').forEach((el) => {
    const kind = el.dataset.art || 'mix';
    const pool = videos.filter((v) => (kind === 'mix' ? v.type !== 'short' : v.type === kind));
    const offset = Number(el.dataset.offset || 0);
    const step = pool.length >= 8 ? 2 : 1; // small pools: walk one by one so no thumbnail repeats
    const picks = Array.from({ length: 4 }, (_, i) => pool[(i * step + offset) % pool.length]);
    el.innerHTML = `<div class="art-cluster">${picks.map((v) => `<div class="art-panel"><img src="${thumb(v.id)}" alt=""></div>`).join('')}</div>`;
  });
}
