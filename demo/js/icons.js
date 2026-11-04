// One consistent icon set: 24px grid, 2px round strokes. Replaces text glyphs.
const P = {
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  up: '<path d="M7 17 17 7M8 7h9v9"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 7 9 6 9-6"/>',
  check: '<path d="M20 6 9.5 17 4 11.5"/>',
  film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4"/>',
  mic: '<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  landmark: '<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M12 3 3 8.5h18z"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 3 6 5 9-2 3-5 4-5 9M17 3c0 5-3 6-5 9 2 3 5 4 5 9"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 21v-4h6v4M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01"/>',
  heart: '<path d="M12 20.5 4.6 13A5 5 0 0 1 12 6.3 5 5 0 0 1 19.4 13z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
  send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z"/>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.1 4.4 5 4.6"/>',
  patreon: '<circle cx="14.5" cy="9.5" r="6"/><path d="M4 3.5v17"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] ?? ''}</svg>`;

/** Replace <i data-icon="arrow"></i> placeholders in static HTML with real SVGs. */
export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]:not([data-done])').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
    el.dataset.done = '1';
  });
}

export const TOPIC_ICON = { Politics: 'landmark', History: 'hourglass', Economy: 'trend', Society: 'users', Karachi: 'building' };
