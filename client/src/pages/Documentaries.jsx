import { Link } from 'react-router-dom';
import { byType, TOPICS, topicBlurb } from '../data/data.js';
import Icon, { TOPIC_ICON } from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useRail from '../hooks/useRail.js';
import { RailButtons, RailTrack } from '../components/Rail.jsx';
import { VideoCard, FeatureCard, MiniCard } from '../components/VideoCards.jsx';
import { SubscribeButton, SubscribeStrip, CenterCta } from '../components/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const docs = byType('doc');
const featured = docs.filter((v) => v.featured);

/** One carousel of documentaries for a topic. Rows with more than three cards get arrows and an auto-loop. */
function TopicRow({ topic, list }) {
  const long = list.length > 3;
  const rail = useRail({ autoplay: long ? 3800 : 0 });
  return (
    <Reveal>
      <div className="head-row" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '.9rem', alignItems: 'center' }}>
          <span className="tile-icon" style={{ position: 'static', transform: 'none' }}><Icon name={TOPIC_ICON[topic]} /></span>
          <div>
            <h3 style={{ fontSize: '2rem' }}>{topic}</h3>
            <p style={{ margin: '.2rem 0 0', color: 'var(--muted)', fontSize: '.9rem' }}>{topicBlurb[topic]}</p>
          </div>
        </div>
        {long && <RailButtons rail={rail} />}
      </div>
      <RailTrack rail={rail} variant="wide">
        {list.map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}
      </RailTrack>
    </Reveal>
  );
}

export default function Documentaries() {
  useTitle('Documentaries — Lagaam');
  const rows = TOPICS.map((t) => ({ t, list: docs.filter((v) => v.topic === t) })).filter((r) => r.list.length);

  return (
    <>
      <PageHero
        art="doc"
        crumbs={[{ label: 'Videos', to: '/videos' }, { label: 'Documentaries' }]}
        pill="Long-form"
        title="Documentaries"
        lede="Deep dives into power, crime, politics and history: the stories behind the headlines."
      >
        <a className="btn btn-primary" href="#library"><Icon name="play" /> Browse the library <span className="icon-go"><Icon name="arrow" /></span></a>
        <Link className="btn btn-secondary" to="/videos?type=doc">Filter and search <span className="icon-go"><Icon name="arrow" /></span></Link>
      </PageHero>
      <SubscribeStrip title="Documentaries, first" text="Join 1.25M subscribers and watch every new one on release day." />

      <section className="section">
        <div className="container">
          <Reveal as="header" className="section-head"><span className="pill">Featured</span><h2>Start here</h2></Reveal>
          <div className="featured">
            <FeatureCard v={featured[0]} subscribe />
            <div className="mini-stack">
              {featured.slice(1, 4).map((v, i) => <MiniCard key={v.id} v={v} i={i + 1} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="library">
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div><span className="pill">By topic</span><h2>Pick a rabbit hole</h2></div>
            <SubscribeButton label="Subscribe" />
          </Reveal>
          <div id="topicRows" style={{ display: 'grid', gap: '3.2rem' }}>
            {rows.map((r) => <TopicRow key={r.t} topic={r.t} list={r.list} />)}
          </div>
          <CenterCta label="Subscribe for new documentaries" />
          <p className="note">The demo shows the documentaries we have so far. The live site will list the full catalogue from the YouTube channel.</p>
        </div>
      </section>

      <CtaBand
        pill="Never miss one"
        title="New documentaries, first"
        text="Subscribe on YouTube so every new Lagaam documentary lands in your feed the moment it is published."
      >
        <SubscribeButton variant="btn-light" label="Subscribe" />
      </CtaBand>
    </>
  );
}
