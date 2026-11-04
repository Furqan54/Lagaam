import { CHANNEL, byType, TOPICS } from '../data.js';
import { shortCard, rail, railButtons } from '../cards.js';
import { icon, TOPIC_ICON } from '../icons.js';
import { initCards, initReveal, initRails } from '../ui.js';

const $ = (id) => document.getElementById(id);

export function init() {
  const shorts = byType('short');
  $('allShorts').href = CHANNEL.shortsUrl;

  // One section: topic chips filter a carousel; "Show all" turns it into a grid.
  const topics = ['all', ...TOPICS.filter((t) => shorts.some((s) => s.topic === t))];
  let topic = 'all';
  let showAll = false;

  const render = () => {
    $('topicChips').innerHTML = topics.map((t) =>
      `<button class="chip ${topic === t ? 'active' : ''}" type="button" data-key="${t}" aria-pressed="${topic === t}">${t === 'all' ? 'All' : `${icon(TOPIC_ICON[t])}${t}`}</button>`).join('');
    const cards = shorts.filter((s) => topic === 'all' || s.topic === topic).map(shortCard).join('');

    $('showAll').textContent = showAll ? 'Show less' : 'Show all';
    $('showAll').setAttribute('aria-expanded', showAll);
    $('railButtons').innerHTML = showAll ? '' : railButtons('shorts-page');
    $('list').innerHTML = showAll ? `<div class="shorts-grid">${cards}</div>` : rail(cards, 'shorts-page', 'narrow', 3600);
    initCards(); initRails(); initReveal();
  };

  $('topicChips').addEventListener('click', (e) => { const b = e.target.closest('[data-key]'); if (b) { topic = b.dataset.key; render(); } });
  $('showAll').addEventListener('click', () => { showAll = !showAll; render(); });
  render();
}
