import { CHANNEL } from './data.js';
import { icon } from './icons.js';

const LINKS = [
  { href: 'index.html', label: 'Home', page: 'home' },
  {
    label: 'Videos', page: ['videos', 'documentaries', 'podcasts', 'shorts', 'watch'],
    children: [
      { href: 'videos.html', label: 'All videos', icon: 'search' },
      { href: 'documentaries.html', label: 'Documentaries', icon: 'film' },
      { href: 'podcasts.html', label: 'Podcasts', icon: 'mic' },
      { href: 'shorts.html', label: 'Shorts', icon: 'zap' },
    ],
  },
  { href: 'about.html', label: 'About', page: 'about' },
  { href: 'support.html', label: 'Support', page: 'support' },
  { href: 'contact.html', label: 'Contact', page: 'contact' },
];

const isActive = (item, page) => [].concat(item.page).includes(page);

/* Stand-in for the real Raftar mark until the official file arrives: black disc, red-to-orange ring and R. */
const LOGO = `
<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5301f"/><stop offset="1" stop-color="#ff7a1a"/></linearGradient></defs>
  <g class="ring"><circle cx="24" cy="24" r="22" fill="#0b0b0d" stroke="url(#lg)" stroke-width="2.4" stroke-dasharray="118 20" stroke-linecap="round"/></g>
  <g class="r"><path d="M17 34V14h9.2a5.8 5.8 0 0 1 0 11.6H17M25 25.6 33 34" fill="none" stroke="url(#lg)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></g>
</svg>`;

const CYBERX = `
<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="2" width="28" height="28" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<path d="m10 10 12 12M22 10 10 22" stroke="#ff6a2b" stroke-width="3" stroke-linecap="round"/></svg>`;

export function renderHeader(page) {
  const el = document.getElementById('site-header');
  el.className = 'nav';
  el.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="index.html" aria-label="Raftar home">${LOGO}<span class="brand-word">RAFTAR</span></a>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="nav-links" aria-label="Main">
        <span class="nav-indicator" aria-hidden="true"></span>
        ${LINKS.map((l) => l.children
          ? `<div class="has-sub ${isActive(l, page) ? 'active' : ''}">
               <a href="${l.children[0].href}">${l.label} ${icon('right')}</a>
               <div class="sub">${l.children.map((c) => `<a href="${c.href}">${icon(c.icon)}${c.label}</a>`).join('')}</div>
             </div>`
          : `<a href="${l.href}" class="${isActive(l, page) ? 'active' : ''}">${l.label}</a>`).join('')}
      </nav>
      <div class="nav-right">
        <span class="sub-count"><strong>1.25M</strong> subscribers</span>
        <a class="btn btn-primary btn-sm" href="${CHANNEL.url}?sub_confirmation=1" target="_blank" rel="noopener noreferrer">${icon('youtube')} Subscribe</a>
      </div>
    </div>`;

  const btn = el.querySelector('.menu-btn');
  btn.addEventListener('click', () => {
    const open = el.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open);
  });

  // Sliding highlight that follows the pointer / keyboard focus and rests on the active page.
  const nav = el.querySelector('.nav-links');
  const ind = el.querySelector('.nav-indicator');
  const items = [...nav.querySelectorAll(':scope > a, :scope > .has-sub')];
  const place = (target) => {
    if (!target) { ind.classList.remove('on'); return; }
    ind.style.left = target.offsetLeft + 'px';
    ind.style.width = target.offsetWidth + 'px';
    ind.classList.add('on');
  };
  const resting = () => items.find((i) => i.classList.contains('active'));
  items.forEach((i) => {
    i.addEventListener('pointerenter', () => place(i));
    i.addEventListener('focusin', () => place(i));
  });
  nav.addEventListener('pointerleave', () => place(resting()));
  nav.addEventListener('focusout', () => place(resting()));
  addEventListener('resize', () => place(resting()));
  document.fonts?.ready.then(() => place(resting()));
  place(resting());

  const onScroll = () => el.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function renderFooter() {
  const el = document.getElementById('site-footer');
  el.className = 'footer';
  el.innerHTML = `
    <div class="footer-watermark" aria-hidden="true">RAFTAR</div>
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">${LOGO}<span class="brand-word">RAFTAR</span></a>
          <p class="footer-blurb">Unfiltered stories on crime, power, history and the economy. Barhnay do.</p>
          <p class="footer-mail">Collaborate: <a href="mailto:${CHANNEL.email}">${CHANNEL.email}</a></p>
        </div>
        <div>
          <h4>Watch</h4>
          <a href="videos.html">All videos</a>
          <a href="documentaries.html">Documentaries</a>
          <a href="podcasts.html">Podcasts</a>
          <a href="shorts.html">Shorts</a>
        </div>
        <div>
          <h4>Raftar</h4>
          <a href="about.html">About</a>
          <a href="support.html">Support us</a>
          <a href="contact.html">Contact</a>
        </div>
        <div>
          <h4>Follow</h4>
          <a href="${CHANNEL.url}" target="_blank" rel="noopener noreferrer">${icon('youtube')} YouTube</a>
          <a href="${CHANNEL.instagram}" target="_blank" rel="noopener noreferrer">${icon('instagram')} Instagram</a>
          <a href="${CHANNEL.tiktok}" target="_blank" rel="noopener noreferrer">${icon('tiktok')} TikTok</a>
          <a href="${CHANNEL.facebook}" target="_blank" rel="noopener noreferrer">${icon('facebook')} Facebook</a>
          <a href="${CHANNEL.patreon}" target="_blank" rel="noopener noreferrer">${icon('patreon')} Patreon</a>
        </div>
      </div>
      <div class="footer-fine">
        <span>Design demo, not the final theme. Videos and thumbnails belong to their owners.</span>
        <a class="devby" href="https://cyberxsoft.net" target="_blank" rel="noopener noreferrer">${CYBERX}<span>Developed by <strong>CyberXSoft</strong></span></a>
      </div>
    </div>`;
}
