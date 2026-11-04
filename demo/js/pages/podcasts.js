import { CHANNEL, byType, TOPICS } from '../data.js';
import { featureCard, episodeRow, videoCard, rail, railButtons } from '../cards.js';
import { icon, TOPIC_ICON } from '../icons.js';
import { initCards, initReveal, initRails } from '../ui.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const pods = byType('podcast');
  $('playlist').href = CHANNEL.playlistPodcasts;
  $('playlist2').href = CHANNEL.playlistPodcasts;

  $('podcast').innerHTML = featureCard(pods[0], 0, { subscribe: true }) + `<div class="pod-list">${pods.slice(1).map(episodeRow).join('')}</div>`;

  // Episodes: a carousel by default, a grid when "Show all" is on. Topic chips filter either one.
  const topics = ['all', ...TOPICS.filter((t) => pods.some((p) => p.topic === t))];
  let topic = 'all';
  let showAll = false;

  const render = () => {
    $('topicChips').innerHTML = topics.map((t) =>
      `<button class="chip ${topic === t ? 'active' : ''}" type="button" data-key="${t}" aria-pressed="${topic === t}">${t === 'all' ? 'All' : `${icon(TOPIC_ICON[t])}${t}`}</button>`).join('');
    const list = pods.filter((p) => topic === 'all' || p.topic === topic);
    const cards = list.map(videoCard).join('');

    $('showAll').textContent = showAll ? 'Show less' : 'Show all';
    $('showAll').setAttribute('aria-expanded', showAll);
    $('railButtons').innerHTML = showAll ? '' : railButtons('pods');
    $('episodeGrid').innerHTML = showAll ? `<div class="grid-3">${cards}</div>` : rail(cards, 'pods', 'wide', 4200);
    initCards(); initRails(); initReveal();
  };

  $('topicChips').addEventListener('click', (e) => { const b = e.target.closest('[data-key]'); if (b) { topic = b.dataset.key; render(); } });
  $('showAll').addEventListener('click', () => { showAll = !showAll; render(); });
  render();
}
