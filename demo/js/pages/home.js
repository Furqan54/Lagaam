import { CHANNEL, byType, thumb, stats, TOPICS } from '../data.js';
import { videoCard, featureCard, miniCard, shortCard, episodeRow, rail, railButtons, esc } from '../cards.js';
import { icon } from '../icons.js';
import { initHero } from '../hero.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const docs = byType('doc');
  const featuredDocs = docs.filter((v) => v.featured);
  const plainDocs = docs.filter((v) => !v.featured);
  const podcasts = byType('podcast');
  const shorts = byType('short');

  const short = { 1.25: 'Subscribers', 2000: 'Videos', 8865: 'Patrons', 157: 'On Instagram' };
  $('stats').innerHTML = stats.map((s) => `
    <div class="stat">
      <strong data-count="${s.value}" data-dec="${s.decimals}" data-suffix="${s.suffix}">0</strong>
      <span>${esc(short[s.value] ?? s.label)}</span>
    </div>`).join('');

  const words = [...TOPICS, 'Documentaries', 'Podcasts', 'Shorts'].map((n) => n.toUpperCase());
  $('marquee').innerHTML = [...words, ...words, ...words, ...words]
    .map((n) => `<span>${esc(n)}</span><i></i>`).join('');

  $('featured').innerHTML =
    featureCard(featuredDocs[0], 0, { subscribe: true }) +
    `<div class="mini-stack">${featuredDocs.slice(1, 4).map((v, i) => miniCard(v, i + 1)).join('')}</div>`;

  const tile = (href, ic, title, text, count, v, i) => `
    <div class="tilt-scene reveal" style="--i:${i}">
      <a class="card tilt tile" href="${href}" data-tilt="7">
        <img src="${thumb(v.id)}" alt="" loading="lazy">
        <span class="tile-icon">${icon(ic)}</span>
        <span class="tile-count">${count}</span>
        <div class="tile-body"><h3>${title}</h3><p>${text}</p><span class="more">Open ${icon('arrow')}</span></div>
      </a>
    </div>`;
  $('tiles').innerHTML =
    tile('documentaries.html', 'film', 'Documentaries', 'Deep dives on power, crime and history.', `${docs.length} videos`, docs[4], 0) +
    tile('podcasts.html', 'mic', 'Podcasts', 'Long conversations with people in the room.', `${podcasts.length} episodes`, podcasts[0], 1) +
    tile('shorts.html', 'phone', 'Shorts', 'Truth in 60 seconds.', `${shorts.length} clips`, shorts[0], 2);

  $('docs').innerHTML = plainDocs.slice(0, 3).map(videoCard).join('');

  $('podcast').innerHTML = `
    ${featureCard(podcasts[0], 0, { subscribe: true })}
    <div class="pod-list">${podcasts.slice(1).map(episodeRow).join('')}</div>`;

  $('shortsButtons').innerHTML = railButtons('home-shorts');
  $('shorts').innerHTML = rail(shorts.map(shortCard).join(''), 'home-shorts');

  // Every static Subscribe button on the page points at the channel with the subscribe prompt.
  document.querySelectorAll('[data-sub]').forEach((a) => { a.href = CHANNEL.url + '?sub_confirmation=1'; });

  // 3D hero: ring of 8 real thumbnails; clicking one opens its watch page.
  const ringItems = [...featuredDocs, ...plainDocs, podcasts[0]];
  try {
    initHero({
      canvas: $('heroCanvas'), tip: $('heroTip'), items: ringItems, thumb,
      onPick: (v) => { location.href = `watch.html?id=${v.id}`; },
    });
  } catch (err) {
    console.warn('3D hero disabled:', err); // page still works without WebGL
  }
}
