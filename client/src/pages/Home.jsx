import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { byType, thumb, stats, TOPICS } from '../data/data.js';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import Counter from '../components/Counter.jsx';
import TiltCard from '../components/TiltCard.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useRail from '../hooks/useRail.js';
import { RailButtons, RailTrack } from '../components/Rail.jsx';
import { FeatureCard, MiniCard, VideoCard, ShortCard, EpisodeRow } from '../components/VideoCards.jsx';
import { SubscribeButton, SubscribeStrip, CenterCta } from '../components/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

// Three.js is the heaviest dependency, so the 3D hero loads in its own chunk instead of the main bundle.
const HeroScene = lazy(() => import('../components/HeroScene.jsx'));

const docs = byType('doc');
const featuredDocs = docs.filter((v) => v.featured);
const plainDocs = docs.filter((v) => !v.featured);
const podcasts = byType('podcast');
const shorts = byType('short');

// Eight real thumbnails go on the 3D ring. Defined once so the scene never restarts on re-render.
const RING_ITEMS = [...featuredDocs, ...plainDocs, podcasts[0]];

const STAT_LABEL = { 1.25: 'Subscribers', 2000: 'Videos', 8865: 'Patrons', 157: 'On Instagram' };
const MARQUEE = [...TOPICS, 'Documentaries', 'Podcasts', 'Shorts'].map((n) => n.toUpperCase());

const TILES = [
  { to: '/documentaries', icon: 'film', title: 'Documentaries', text: 'Deep dives on power, crime and history.', count: `${docs.length} videos`, v: docs[4] },
  { to: '/podcasts', icon: 'mic', title: 'Podcasts', text: 'Long conversations with people in the room.', count: `${podcasts.length} episodes`, v: podcasts[0] },
  { to: '/shorts', icon: 'phone', title: 'Shorts', text: 'Truth in 60 seconds.', count: `${shorts.length} clips`, v: shorts[0] },
];

const GoArrow = () => <span className="icon-go"><Icon name="arrow" /></span>;

export default function Home() {
  useTitle("Lagaam — Stories Pakistan Doesn't Tell");
  const navigate = useNavigate();
  const shortsRail = useRail();

  return (
    <div id="top">
      {/* Three.js ring of real video thumbnails */}
      <section className="hero" id="hero">
        <Suspense fallback={<div className="hero-vignette" aria-hidden="true" />}>
          <HeroScene items={RING_ITEMS} onPick={(v) => navigate(`/watch/${v.id}`)} />
        </Suspense>
        <div className="hero-copy">
          <h1>Stories<br /><span>Pakistan doesn't</span><br />tell.</h1>
          <p className="hero-tagline">Unfiltered. Untold. Unmissable.</p>
          <p className="hero-sub">Documentaries, podcasts and Shorts on crime, power, history and the economy, told without the filter.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/videos"><Icon name="play" /> Start watching <GoArrow /></Link>
            <Link className="btn btn-secondary" to="/about">About Lagaam</Link>
          </div>
        </div>
        <p className="hero-hint">Move your mouse over the ring. Click a thumbnail to watch.</p>
      </section>

      <section className="stats" aria-label="Channel numbers">
        <div className="stats-strip">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              <span>{STAT_LABEL[s.value] ?? s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1, 2, 3].flatMap((round) => MARQUEE.map((n) => (
              <span key={`${round}-${n}`}>{n}</span>
            ))).flatMap((el) => [el, <i key={`${el.key}-dot`} />])}
          </div>
        </div>
      </div>

      <SubscribeStrip title="New stories every week" text="Join 1.25M subscribers and never miss a documentary." />

      <section className="section" style={{ paddingTop: 'clamp(2rem,4vw,3rem)' }}>
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div><span className="pill">Featured</span><h2>Start with the big ones</h2></div>
            <Link className="btn btn-secondary" to="/documentaries">All documentaries <GoArrow /></Link>
          </Reveal>
          <div className="featured">
            <FeatureCard v={featuredDocs[0]} subscribe />
            <div className="mini-stack">
              {featuredDocs.slice(1, 4).map((v, i) => <MiniCard key={v.id} v={v} i={i + 1} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal as="header" className="section-head"><span className="pill">Explore</span><h2>Choose how you watch</h2></Reveal>
          <div className="tiles">
            {TILES.map((t, i) => (
              <Reveal key={t.to} className="tilt-scene" i={i}>
                <TiltCard as={Link} to={t.to} className="tile" max={7}>
                  <img src={thumb(t.v.id)} alt="" loading="lazy" />
                  <span className="tile-icon"><Icon name={t.icon} /></span>
                  <span className="tile-count">{t.count}</span>
                  <div className="tile-body">
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                    <span className="more">Open <Icon name="arrow" /></span>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <CenterCta label="Subscribe to Lagaam" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div><span className="pill">Latest documentaries</span><h2>Long-form, no shortcuts</h2></div>
            <Link className="btn btn-secondary" to="/documentaries">View all <GoArrow /></Link>
          </Reveal>
          <div className="grid-3">
            {plainDocs.slice(0, 3).map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}
          </div>
          <CenterCta label="Subscribe for new documentaries" />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div><span className="pill">Listen and watch</span><h2>Lagaam Conversations</h2></div>
            <Link className="btn btn-secondary" to="/podcasts">All podcasts <GoArrow /></Link>
          </Reveal>
          <div className="podcast-grid">
            <FeatureCard v={podcasts[0]} subscribe />
            <div className="pod-list">
              {podcasts.slice(1).map((v, i) => <EpisodeRow key={v.id} v={v} i={i} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div>
              <span className="pill">Fast and focused</span>
              <div className="head-inline">
                <h2>Lagaam Shorts</h2>
                <SubscribeButton variant="btn-secondary" small arrow={false} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <RailButtons rail={shortsRail} />
              <Link className="btn btn-secondary" to="/shorts">All Shorts <GoArrow /></Link>
            </div>
          </Reveal>
          <RailTrack rail={shortsRail}>
            {shorts.map((v, i) => <ShortCard key={v.id} v={v} i={i} />)}
          </RailTrack>
        </div>
      </section>

      <CtaBand
        pill="Lagaam Barhnay Do"
        title="Keep independent storytelling alive"
        text="Join thousands of members on Patreon and help us keep telling the stories nobody else will."
      >
        <SubscribeButton variant="btn-dark" label="Subscribe" />
        <Link className="btn btn-light" to="/support"><Icon name="heart" /> Support Lagaam</Link>
        <Link className="btn btn-secondary" to="/contact">Collaborate with us <GoArrow /></Link>
      </CtaBand>
    </div>
  );
}
