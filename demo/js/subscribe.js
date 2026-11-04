import { CHANNEL } from './data.js';
import { icon } from './icons.js';

const HREF = `${CHANNEL.url}?sub_confirmation=1`;
const attrs = `href="${HREF}" target="_blank" rel="noopener noreferrer"`;

// Copy for the strip under each inner-page hero.
const STRIP = {
  videos: ['Never miss a new video', 'Documentaries, podcasts and Shorts, the moment they land.'],
  documentaries: ['Documentaries, first', 'Join 1.25M subscribers and watch every new one on release day.'],
  podcasts: ['Every conversation, in your feed', 'Subscribe so new Raftar Conversations reach you first.'],
  shorts: ['New Shorts every week', 'Subscribe and keep up with the story in 60 seconds.'],
  about: ['Be part of the story', 'Join 1.25M people who watch Raftar.'],
  support: ['Start by subscribing, it is free', 'It is the biggest thing you can do for how far a story travels.'],
  contact: ['Stay in the loop', 'Subscribe to see what Raftar publishes next.'],
};

// Where the centred button goes: after the main content block of each page.
const CENTER = {
  videos: [['#shortsBlock', 'Subscribe to Raftar']],
  documentaries: [['#topicRows', 'Subscribe for new documentaries']],
  podcasts: [['#episodeGrid', 'Subscribe for new episodes']],
  shorts: [['#list', 'Subscribe for new Shorts']],
  about: [['#spine', 'Subscribe for every new story'], ['#channels', 'Subscribe to Raftar']],
  support: [['#ways', 'Subscribe on YouTube']],
};

// Headings that get a small, quiet button beside them.
const INLINE = { videos: '#shortsBlock .subheading h2' };

const button = (label, cls = 'btn-primary') =>
  `<a class="btn ${cls}" ${attrs}>${icon('youtube')} ${label} <span class="icon-up">${icon('up')}</span></a>`;

/** Adds the subscribe calls to action to an inner page. Idempotent; safe to call after the page rendered. */
export function injectSubscribe(page) {
  const main = document.querySelector('main');
  if (!main) return;

  // 1. Strip right under the hero.
  const hero = main.querySelector('.page-hero');
  const copy = STRIP[page];
  if (hero && copy && !main.querySelector('.sub-strip')) {
    hero.insertAdjacentHTML('afterend', `
      <section class="sub-strip-wrap">
        <div class="container">
          <div class="sub-strip reveal">
            <span class="sub-strip-icon">${icon('youtube')}</span>
            <div class="sub-strip-text"><strong>${copy[0]}</strong><span>${copy[1]}</span></div>
            ${button('Subscribe on YouTube')}
          </div>
        </div>
      </section>`);
  }

  // 2. Every call-to-action banner gets a Subscribe button unless it already has one.
  main.querySelectorAll('.cta-band .cta-actions').forEach((box) => {
    if (!box.querySelector('a[href*="sub_confirmation"]')) box.insertAdjacentHTML('afterbegin', button('Subscribe', 'btn-dark'));
  });

  // 3. Centred button under the page's main content.
  for (const [selector, label] of CENTER[page] ?? []) {
    const anchor = main.querySelector(selector);
    if (anchor && !anchor.nextElementSibling?.classList.contains('center-cta')) {
      anchor.insertAdjacentHTML('afterend', `<div class="center-cta reveal">${button(label)}</div>`);
    }
  }

  // 4. A small, quiet button next to a key heading.
  const h = INLINE[page] && main.querySelector(INLINE[page]);
  if (h && !h.parentElement.classList.contains('head-inline')) {
    const wrap = document.createElement('div');
    wrap.className = 'head-inline';
    h.replaceWith(wrap);
    wrap.append(h);
    wrap.insertAdjacentHTML('beforeend', `<a class="btn btn-secondary btn-sm" ${attrs}>${icon('youtube')} Subscribe</a>`);
  }
}
