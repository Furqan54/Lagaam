import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHANNEL, byType, TOPICS } from '../data/data.js';
import Icon, { TOPIC_ICON } from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useRail from '../hooks/useRail.js';
import { RailButtons, RailTrack } from '../components/Rail.jsx';
import { ShortCard } from '../components/VideoCards.jsx';
import { SubscribeButton, SubscribeStrip } from '../components/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const shorts = byType('short');
const topics = ['all', ...TOPICS.filter((t) => shorts.some((s) => s.topic === t))];

export default function Shorts() {
  useTitle('Shorts — Raftar');
  // One section: topic chips filter a carousel, and "Show all" turns it into a grid.
  const [topic, setTopic] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const list = shorts.filter((s) => topic === 'all' || s.topic === topic);
  const rail = useRail({ autoplay: showAll ? 0 : 3600, watch: `${topic}-${showAll}` });

  return (
    <>
      <PageHero
        art="mix"
        offset={1}
        crumbs={[{ label: 'Videos', to: '/videos' }, { label: 'Shorts' }]}
        pill="Fast and focused"
        title="Raftar Shorts"
        lede="Truth in 60 seconds. Short-form stories built for quick discovery."
      >
        <a className="btn btn-primary" href={CHANNEL.shortsUrl} target="_blank" rel="noopener noreferrer"><Icon name="phone" /> Every Short on YouTube <span className="icon-up"><Icon name="up" /></span></a>
        <a className="btn btn-secondary" href="#shorts">Start swiping <span className="icon-go"><Icon name="arrow" /></span></a>
      </PageHero>
      <SubscribeStrip title="New Shorts every week" text="Subscribe and keep up with the story in 60 seconds." />

      <section className="section" id="shorts">
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div><span className="pill">Quick hits</span><h2>Find your clip</h2></div>
            <div className="tool-row">
              <div className="chips" role="group" aria-label="Topic">
                {topics.map((t) => (
                  <button key={t} type="button" className={`chip ${topic === t ? 'active' : ''}`} aria-pressed={topic === t} onClick={() => setTopic(t)}>
                    {t === 'all' ? 'All' : <><Icon name={TOPIC_ICON[t]} />{t}</>}
                  </button>
                ))}
              </div>
              {!showAll && <RailButtons rail={rail} />}
              <button className="btn btn-secondary btn-sm" type="button" aria-expanded={showAll} onClick={() => setShowAll((s) => !s)}>
                {showAll ? 'Show less' : 'Show all'}
              </button>
            </div>
          </Reveal>
          {showAll ? (
            <div className="shorts-grid">{list.map((v, i) => <ShortCard key={v.id} v={v} i={i} />)}</div>
          ) : (
            <RailTrack rail={rail} variant="narrow">
              {list.map((v, i) => <ShortCard key={v.id} v={v} i={i} />)}
            </RailTrack>
          )}
        </div>
      </section>

      <CtaBand
        pill="Watch the full story"
        title="Liked the clip? Watch the documentary"
        text="Every Short is a sliver of something bigger. The long-form documentaries tell the whole story."
      >
        <SubscribeButton variant="btn-dark" label="Subscribe" />
        <Link className="btn btn-light" to="/documentaries"><Icon name="film" /> Browse documentaries <span className="icon-go"><Icon name="arrow" /></span></Link>
      </CtaBand>
    </>
  );
}
