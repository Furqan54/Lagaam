import { Link, useSearchParams } from 'react-router-dom';
import { videos, TOPICS, topicBlurb, thumb } from '../data/data.js';
import Icon, { TOPIC_ICON } from '../components/ui/Icon.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import useRail from '../hooks/useRail.js';
import { RailButtons, RailTrack } from '../components/ui/Rail.jsx';
import { VideoCard, ShortCard, EmptyState } from '../components/video/VideoCards.jsx';
import { SubscribeButton, SubscribeStrip, CenterCta } from '../components/ui/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const TYPES = [['all', 'All'], ['doc', 'Documentaries'], ['podcast', 'Podcasts'], ['short', 'Shorts']];

export default function Videos() {
  useTitle('All Videos — Lagaam');
  const [params, setParams] = useSearchParams();

  // Filters live in the URL, so a filtered view can be shared or bookmarked.
  const type = TYPES.some(([k]) => k === params.get('type')) ? params.get('type') : 'all';
  const topic = TOPICS.includes(params.get('topic')) ? params.get('topic') : 'all';
  const q = params.get('q') || '';

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v && v !== 'all' ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const query = q.trim().toLowerCase();
  const match = videos.filter((v) =>
    (type === 'all' || v.type === type) &&
    (topic === 'all' || v.topic === topic) &&
    (!query || v.title.toLowerCase().includes(query)));
  const longForm = match.filter((v) => v.type !== 'short');
  const shorts = match.filter((v) => v.type === 'short');

  const shortsRail = useRail({ watch: shorts.map((s) => s.id).join() });

  return (
    <>
      <PageHero
        art="mix"
        crumbs={[{ label: 'Videos' }]}
        pill="Browse everything"
        title="All videos"
        lede="Documentaries, podcasts and Shorts in one place. Filter by format and topic, or search by title."
      />
      <SubscribeStrip title="Never miss a new video" text="Documentaries, podcasts and Shorts, the moment they land." />

      <section className="section">
        <div className="container">
          <Reveal className="toolbar">
            <div className="toolbar-row">
              <div className="segmented" role="group" aria-label="Format">
                {TYPES.map(([k, label]) => (
                  <button key={k} type="button" className={`seg ${type === k ? 'active' : ''}`} aria-pressed={type === k} onClick={() => update({ type: k })}>{label}</button>
                ))}
              </div>
              <label className="search">
                <Icon name="search" />
                <input type="search" placeholder="Search titles" aria-label="Search videos" value={q} onChange={(e) => update({ q: e.target.value })} />
              </label>
            </div>
            <div className="chips" role="group" aria-label="Topic">
              <span className="chips-label">Topic</span>
              {['all', ...TOPICS].map((t) => (
                <button key={t} type="button" className={`chip ${topic === t ? 'active' : ''}`} aria-pressed={topic === t} onClick={() => update({ topic: t })}>
                  {t === 'all' ? 'All topics' : <><Icon name={TOPIC_ICON[t]} />{t}</>}
                </button>
              ))}
            </div>
          </Reveal>

          <p className="result-count">{match.length} video{match.length === 1 ? '' : 's'}</p>

          {longForm.length > 0 && (
            <div className="grid-3">{longForm.map((v, i) => <VideoCard key={v.id} v={v} i={i} />)}</div>
          )}
          {!longForm.length && !shorts.length && <div className="grid-3"><EmptyState /></div>}

          {shorts.length > 0 && (
            <div>
              <div className="subheading">
                <div className="head-inline">
                  <h2>Shorts</h2>
                  <SubscribeButton variant="btn-secondary" small arrow={false} />
                </div>
                <RailButtons rail={shortsRail} />
              </div>
              <RailTrack rail={shortsRail}>
                {shorts.map((v, i) => <ShortCard key={v.id} v={v} i={i} />)}
              </RailTrack>
            </div>
          )}
          <CenterCta label="Subscribe to Lagaam" />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal as="header" className="section-head">
            <span className="pill">Browse by topic</span>
            <h2>Pick your obsession</h2>
            <p className="lede">Hover a card to flip it, then jump straight into that topic.</p>
          </Reveal>
          <div className="flip-grid">
            {TOPICS.map((t, i) => {
              const sample = videos.find((v) => v.topic === t && v.type !== 'short') ?? videos.find((v) => v.topic === t);
              const n = videos.filter((v) => v.topic === t).length;
              return (
                <Reveal as={Link} key={t} className="flip" i={i} to={`/videos?topic=${encodeURIComponent(t)}`} aria-label={`${t}: ${topicBlurb[t]}`}>
                  <div className="flip-inner">
                    <div className="face front">
                      <img className="bg" src={thumb(sample.id)} alt="" loading="lazy" />
                      <Icon name={TOPIC_ICON[t]} className="mark" />
                      <span className="tag">{n} videos</span>
                      <h3>{t}</h3>
                    </div>
                    <div className="face back">
                      <Icon name={TOPIC_ICON[t]} className="mark" />
                      <h3>{t}</h3>
                      <p>{topicBlurb[t]}</p>
                      <span className="more">Explore <Icon name="arrow" /></span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
