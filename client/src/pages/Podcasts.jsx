import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHANNEL, byType, TOPICS } from '../data/data.js';
import Icon, { TOPIC_ICON } from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useRail from '../hooks/useRail.js';
import { RailButtons, RailTrack } from '../components/Rail.jsx';
import { VideoCard, FeatureCard, EpisodeRow } from '../components/VideoCards.jsx';
import { SubscribeButton, SubscribeStrip, CenterCta } from '../components/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const pods = byType('podcast');
const topics = ['all', ...TOPICS.filter((t) => pods.some((p) => p.topic === t))];
const external = { target: '_blank', rel: 'noopener noreferrer' };

export default function Podcasts() {
  useTitle('Podcasts — Raftar');
  // Episodes are a carousel by default and a grid when "Show all" is on. Topic chips filter either one.
  const [topic, setTopic] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const list = pods.filter((p) => topic === 'all' || p.topic === topic);
  const rail = useRail({ autoplay: showAll ? 0 : 4200, watch: `${topic}-${showAll}` });

  return (
    <>
      <PageHero
        art="podcast"
        crumbs={[{ label: 'Videos', to: '/videos' }, { label: 'Podcasts' }]}
        pill="Listen and watch"
        title="Raftar Conversations"
        lede="Long, honest conversations on the economy, politics and the questions that matter."
      >
        <a className="btn btn-primary" href={CHANNEL.playlistPodcasts} {...external}><Icon name="play" /> Full playlist <span className="icon-up"><Icon name="up" /></span></a>
        <a className="btn btn-secondary" href="#episodes">Jump to episodes <span className="icon-go"><Icon name="arrow" /></span></a>
      </PageHero>
      <SubscribeStrip title="Every conversation, in your feed" text="Subscribe so new Raftar Conversations reach you first." />

      <section className="section">
        <div className="container">
          <Reveal as="header" className="section-head"><span className="pill">Latest</span><h2>On the mic right now</h2></Reveal>
          <div className="podcast-grid">
            <FeatureCard v={pods[0]} subscribe />
            <div className="pod-list">
              {pods.slice(1).map((v, i) => <EpisodeRow key={v.id} v={v} i={i} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="episodes">
        <div className="container">
          <Reveal as="header" className="section-head head-row">
            <div><span className="pill">All episodes</span><h2>Every conversation</h2></div>
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
            <div className="grid-3">{list.map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}</div>
          ) : (
            <RailTrack rail={rail} variant="wide">
              {list.map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}
            </RailTrack>
          )}
          <CenterCta label="Subscribe for new episodes" />
        </div>
      </section>

      <CtaBand
        pill="More on YouTube"
        title="Hear it out in full"
        text="The full Raftar Conversations playlist has every episode, in order, with new ones added as they are recorded."
      >
        <SubscribeButton variant="btn-dark" label="Subscribe" />
        <a className="btn btn-light" href={CHANNEL.playlistPodcasts} {...external}><Icon name="youtube" /> Open the playlist <span className="icon-up"><Icon name="up" /></span></a>
        <Link className="btn btn-secondary" to="/support">Support the show <span className="icon-go"><Icon name="arrow" /></span></Link>
      </CtaBand>
    </>
  );
}
