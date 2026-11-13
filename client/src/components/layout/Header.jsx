import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { Logo } from '../ui/Logo.jsx';
import { SubscribeButton } from '../ui/Subscribe.jsx';

const VIDEO_PATHS = ['/videos', '/documentaries', '/podcasts', '/shorts'];

const LINKS = [
  { label: 'Home', to: '/', match: (p) => p === '/' },
  {
    label: 'Videos',
    to: '/videos',
    match: (p) => VIDEO_PATHS.includes(p) || p.startsWith('/watch'),
    children: [
      { to: '/videos', label: 'All videos', icon: 'search' },
      { to: '/documentaries', label: 'Documentaries', icon: 'film' },
      { to: '/podcasts', label: 'Podcasts', icon: 'mic' },
      { to: '/shorts', label: 'Shorts', icon: 'phone' },
    ],
  },
  { label: 'About', to: '/about', match: (p) => p === '/about' },
  { label: 'Support', to: '/support', match: (p) => p === '/support' },
  { label: 'Contact', to: '/contact', match: (p) => p === '/contact' },
];

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, on: false });
  const items = useRef([]);

  const activeIndex = LINKS.findIndex((l) => l.match(pathname));

  // The sliding highlight rests on the active page and follows the pointer or keyboard focus.
  const place = useCallback((index) => {
    const el = items.current[index];
    setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth, on: true } : (s) => ({ ...s, on: false }));
  }, []);

  useEffect(() => {
    place(activeIndex);
    const onResize = () => place(activeIndex);
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(() => place(activeIndex));
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex, place]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}${open ? ' menu-open' : ''}`}>
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="Lagaam home">
          <Logo />
        </Link>

        <button className="menu-btn" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>

        <nav className="nav-links" aria-label="Main" onPointerLeave={() => place(activeIndex)} onBlur={() => place(activeIndex)}>
          <span className={`nav-indicator${indicator.on ? ' on' : ''}`} style={{ left: indicator.left, width: indicator.width }} aria-hidden="true" />
          {LINKS.map((l, i) => {
            const active = i === activeIndex;
            const handlers = { onPointerEnter: () => place(i), onFocus: () => place(i) };
            if (l.children) {
              return (
                <div key={l.label} className={`has-sub${active ? ' active' : ''}`} ref={(el) => { items.current[i] = el; }} {...handlers}>
                  <Link to={l.to}>{l.label} <Icon name="right" /></Link>
                  <div className="sub">
                    {l.children.map((c) => (
                      <Link key={c.to} to={c.to}><Icon name={c.icon} />{c.label}</Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link key={l.label} to={l.to} className={active ? 'active' : ''} ref={(el) => { items.current[i] = el; }} {...handlers}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-right">
          <span className="sub-count"><strong>1.25M</strong> subscribers</span>
          <SubscribeButton label="Subscribe" small arrow={false} />
        </div>
      </div>
    </header>
  );
}
