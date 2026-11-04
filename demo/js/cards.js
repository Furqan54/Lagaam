import { CHANNEL, thumb, thumbSmall, watchHref, TYPE_LABEL } from './data.js';
import { icon } from './icons.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Thumbnail, small glass play button in the middle; the hover preview iframe goes into .preview-layer. */
const media = (v, small = false) => `
  <div class="media">
    <img class="video-thumbnail" src="${small ? thumbSmall(v.id) : thumb(v.id)}" alt="${esc(v.title)}" loading="lazy">
    <div class="preview-layer"></div>
    <span class="play" aria-hidden="true">${icon('play')}</span>
    ${v.type === 'short' ? '<span class="badge">Short</span>' : ''}
  </div>`;

const scene = (html, i = 0) => `<div class="tilt-scene reveal" style="--i:${i % 6}">${html}</div>`;
const link = (v, cls, inner, tilt = 7) =>
  `<a class="card tilt ${cls}" href="${watchHref(v)}" data-id="${v.id}" data-tilt="${tilt}">${inner}</a>`;

export const videoCard = (v, i = 0) => scene(link(v, 'vcard',
  `${media(v)}
   <div class="body">
     <div class="meta"><span class="tag">${esc(v.topic)}</span><small>${TYPE_LABEL[v.type]}</small></div>
     <h3>${esc(v.title)}</h3>
     ${v.desc ? `<p>${esc(v.desc)}</p>` : ''}
   </div>`), i);

// With { subscribe: true } a Subscribe button sits in the card's bottom-right corner. It is a sibling of the
// card link (not inside it), because a link inside a link is invalid HTML.
export const featureCard = (v, i = 0, opts = {}) => scene(link(v, 'vcard large',
  `${media(v)}
   <div class="body">
     <div class="meta"><span class="tag">${esc(v.topic)}</span><small>${TYPE_LABEL[v.type]}</small></div>
     <h3>${esc(v.title)}</h3>
     <p>${esc(v.desc)}</p>
     <span class="more">Watch the intro ${icon('arrow')}</span>
   </div>`, 4) + (opts.subscribe
  ? `<a class="btn btn-primary btn-sm card-sub" href="${CHANNEL.url}?sub_confirmation=1" target="_blank" rel="noopener noreferrer">${icon('youtube')} Subscribe</a>`
  : ''), i);

export const miniCard = (v, i = 0) => scene(link(v, 'vcard compact',
  `${media(v, true)}
   <div class="body"><span class="tag" style="align-self:flex-start">${esc(v.topic)}</span><h4>${esc(v.title)}</h4></div>`, 6), i);

export const shortCard = (v, i = 0) => scene(link(v, 'vcard short',
  `${media(v)}
   <div class="body"><h4>${esc(v.title)}</h4><span class="tag" style="align-self:flex-start">${esc(v.topic)}</span></div>`, 9), i);

export const episodeRow = (v, i = 0) => scene(link(v, 'vcard ep',
  `${media(v, true)}
   <div class="body">
     <div class="meta"><span class="tag">${esc(v.topic)}</span><small>${TYPE_LABEL[v.type]}</small></div>
     <h4>${esc(v.title)}</h4>
     <span class="more">Watch the intro ${icon('arrow')}</span>
   </div>`, 3), i);

export const emptyState = (msg = 'Nothing matches those filters yet.') =>
  `<div class="empty"><strong>No results</strong><p>${esc(msg)}</p></div>`;

/** Horizontal carousel markup with prev/next buttons; wired up by initRails() in ui.js. */
export const rail = (cardsHtml, id, cls = '', autoplay = 0) => `
  <div class="rail" data-rail="${id}" ${autoplay ? `data-autoplay="${autoplay}"` : ''}>
    <div class="rail-track ${cls}">${cardsHtml}</div>
  </div>`;

export const railButtons = (id) => `
  <div class="rail-head" data-rail-for="${id}">
    <button class="rail-btn" type="button" data-dir="-1" aria-label="Previous">${icon('left')}</button>
    <button class="rail-btn" type="button" data-dir="1" aria-label="Next">${icon('right')}</button>
  </div>`;
