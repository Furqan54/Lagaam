import { videos, TOPICS, topicBlurb, thumb } from '../data.js';
import { videoCard, shortCard, emptyState, rail, railButtons, esc } from '../cards.js';
import { icon, TOPIC_ICON, hydrateIcons } from '../icons.js';
import { initCards, initReveal, initRails } from '../ui.js';

const $ = (id) => document.getElementById(id);
const TYPES = [['all', 'All'], ['doc', 'Documentaries'], ['podcast', 'Podcasts'], ['short', 'Shorts']];

export function init() {
  const params = new URLSearchParams(location.search);
  const state = {
    type: TYPES.some(([k]) => k === params.get('type')) ? params.get('type') : 'all',
    topic: TOPICS.includes(params.get('topic')) ? params.get('topic') : 'all',
    q: params.get('q') || '',
  };
  $('search').value = state.q;

  const renderToolbar = () => {
    $('typeChips').innerHTML = TYPES.map(([k, l]) =>
      `<button class="seg ${state.type === k ? 'active' : ''}" type="button" data-group="type" data-key="${k}" aria-pressed="${state.type === k}">${l}</button>`).join('');
    $('topicChips').innerHTML =
      `<span class="chips-label">Topic</span>` +
      ['all', ...TOPICS].map((t) =>
        `<button class="chip ${state.topic === t ? 'active' : ''}" type="button" data-group="topic" data-key="${t}" aria-pressed="${state.topic === t}">${t === 'all' ? 'All topics' : `${icon(TOPIC_ICON[t])}${t}`}</button>`).join('');
  };

  const render = () => {
    renderToolbar();
    const q = state.q.trim().toLowerCase();
    const match = videos.filter((v) =>
      (state.type === 'all' || v.type === state.type) &&
      (state.topic === 'all' || v.topic === state.topic) &&
      (!q || v.title.toLowerCase().includes(q)));
    const longForm = match.filter((v) => v.type !== 'short');
    const shorts = match.filter((v) => v.type === 'short');

    $('count').textContent = `${match.length} video${match.length === 1 ? '' : 's'}`;
    $('results').innerHTML = longForm.length ? longForm.map(videoCard).join('') : (shorts.length ? '' : emptyState());
    $('results').hidden = !longForm.length && !!shorts.length;
    $('shortsBlock').hidden = !shorts.length;
    $('shortsButtons').innerHTML = railButtons('videos-shorts');
    $('shortsResults').innerHTML = rail(shorts.map(shortCard).join(''), 'videos-shorts');

    const next = new URLSearchParams();
    if (state.type !== 'all') next.set('type', state.type);
    if (state.topic !== 'all') next.set('topic', state.topic);
    if (state.q) next.set('q', state.q);
    history.replaceState(null, '', next.toString() ? `?${next}` : location.pathname);

    initCards(); initRails(); initReveal();
  };

  $('typeChips').addEventListener('click', (e) => { const b = e.target.closest('[data-key]'); if (b) { state.type = b.dataset.key; render(); } });
  $('topicChips').addEventListener('click', (e) => { const b = e.target.closest('[data-key]'); if (b) { state.topic = b.dataset.key; render(); } });
  $('search').addEventListener('input', (e) => { state.q = e.target.value; render(); });

  $('topics').innerHTML = TOPICS.map((t, i) => {
    // Society only has Shorts so far; fall back to those when a topic has no long-form video.
    const sample = videos.find((v) => v.topic === t && v.type !== 'short') ?? videos.find((v) => v.topic === t);
    const n = videos.filter((v) => v.topic === t).length;
    return `
    <a class="flip reveal" style="--i:${i}" href="videos.html?topic=${encodeURIComponent(t)}" aria-label="${esc(t)}: ${esc(topicBlurb[t])}">
      <div class="flip-inner">
        <div class="face front">
          <img class="bg" src="${thumb(sample.id)}" alt="" loading="lazy">
          ${icon(TOPIC_ICON[t], 'mark')}
          <span class="tag">${n} videos</span>
          <h3>${esc(t)}</h3>
        </div>
        <div class="face back">
          ${icon(TOPIC_ICON[t], 'mark')}
          <h3>${esc(t)}</h3><p>${esc(topicBlurb[t])}</p><span class="more">Explore ${icon('arrow')}</span>
        </div>
      </div>
    </a>`;
  }).join('');

  render();
  hydrateIcons();
}
