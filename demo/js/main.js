import { renderHeader, renderFooter } from './layout.js';
import { initCards, initReveal, initCounters, initRails } from './ui.js';
import { hydrateIcons } from './icons.js';
import { initHeroArt } from './art.js';
import { injectSubscribe } from './subscribe.js';

// One entry point for every page. <body data-page="home"> picks js/pages/home.js.
const page = document.body.dataset.page;

renderHeader(page);
renderFooter();
initHeroArt();

const pages = import.meta.glob('./pages/*.js');
const loader = pages[`./pages/${page}.js`];
if (loader) {
  const mod = await loader();
  await mod.init?.();
}

injectSubscribe(page);   // Subscribe calls to action on every inner page (home has its own)
hydrateIcons();
initCards();
initRails();
initReveal();
initCounters();
