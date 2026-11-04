import { CHANNEL, byType, TOPICS, topicBlurb } from '../data.js';
import { featureCard, miniCard, videoCard, rail, railButtons, esc } from '../cards.js';
import { icon, TOPIC_ICON } from '../icons.js';

export function init() {
  const docs = byType('doc');
  const featured = docs.filter((v) => v.featured);

  document.getElementById('subscribe').href = CHANNEL.url + '?sub_confirmation=1';
  document.getElementById('featured').innerHTML =
    featureCard(featured[0], 0, { subscribe: true }) +
    `<div class="mini-stack">${featured.slice(1, 4).map((v, i) => miniCard(v, i + 1)).join('')}</div>`;

  // One carousel row per topic that has documentaries.
  document.getElementById('topicRows').innerHTML = TOPICS
    .map((t) => ({ t, list: docs.filter((v) => v.topic === t) }))
    .filter((r) => r.list.length)
    .map(({ t, list }) => `
      <div class="reveal">
        <div class="head-row" style="margin-bottom:1rem">
          <div style="display:flex;gap:.9rem;align-items:center">
            <span class="tile-icon" style="position:static;transform:none">${icon(TOPIC_ICON[t])}</span>
            <div><h3 style="font-size:2rem">${esc(t)}</h3><p style="margin:.2rem 0 0;color:var(--muted);font-size:.9rem">${esc(topicBlurb[t])}</p></div>
          </div>
          ${list.length > 3 ? railButtons('doc-' + t) : ''}
        </div>
        ${rail(list.map(videoCard).join(''), 'doc-' + t, 'wide', list.length > 3 ? 3800 : 0)}
      </div>`).join('');
}
