import { Link } from 'react-router-dom';
import { CHANNEL, stats, sisterChannels, videos, thumb, watchHref } from '../data/data.js';
import Icon from '../components/ui/Icon.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Counter from '../components/ui/Counter.jsx';
import TiltCard from '../components/ui/TiltCard.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import { SubscribeButton, SubscribeStrip, CenterCta } from '../components/ui/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const by = (fn) => videos.filter(fn);

const SPINE = [
  {
    title: 'Investigate', icon: 'film',
    text: 'Power, politics and the institutions that shape daily life, researched before it is told.',
    list: by((v) => v.type === 'doc' && ['Politics', 'Karachi'].includes(v.topic)).slice(0, 3),
  },
  {
    title: 'Explain', icon: 'hourglass',
    text: 'History and the economy, broken down so that anyone can follow the argument.',
    list: by((v) => v.topic === 'History' || v.topic === 'Economy').filter((v) => v.type !== 'short').slice(0, 3),
  },
  {
    title: 'Converse', icon: 'mic',
    text: 'Long-form podcasts with people who were in the room when it happened.',
    list: by((v) => v.type === 'podcast').slice(0, 3),
  },
];

const PLATFORMS = [
  { icon: 'youtube', big: '1.25M', text: 'YouTube subscribers', href: CHANNEL.url },
  { icon: 'instagram', big: '157K', text: 'Instagram followers', href: CHANNEL.instagram },
  { icon: 'patreon', big: '8,865', text: 'Patreon members', href: CHANNEL.patreon },
  { icon: 'tiktok', big: 'TikTok', text: 'Short clips and updates', href: CHANNEL.tiktok },
];

const MAX_SUBS = Math.max(...sisterChannels.map((c) => parseFloat(c.subs)));

export default function About() {
  useTitle('About — Lagaam');

  return (
    <>
      <PageHero
        art="mix"
        offset={2}
        crumbs={[{ label: 'About' }]}
        pill="Who we are"
        title="More than content creators"
        lede="A dynamic platform dedicated to driving social change through the power of storytelling."
      >
        <Link className="btn btn-primary" to="/documentaries"><Icon name="play" /> Watch our work <span className="icon-go"><Icon name="arrow" /></span></Link>
        <Link className="btn btn-secondary" to="/contact">Get in touch <span className="icon-go"><Icon name="arrow" /></span></Link>
      </PageHero>
      <SubscribeStrip title="Be part of the story" text="Join 1.25M people who watch Lagaam." />

      <section className="section">
        <div className="container mission">
          <Reveal className="glow-panel">
            <div className="mesh" />
            <span className="pill">Our mission</span>
            <h2>Catalysts for progress</h2>
            <p>Lagaam provides up-to-date and unconventional content that sparks curiosity and inspires change. We believe knowledge is a key driver of transformation, and we are committed to bringing it to your screens.</p>
            <p>We simplify complex issues, challenge the status quo and ignite the spark of change in society: one idea, one video, one click at a time.</p>
          </Reveal>
          <Reveal className="glow-panel" i={1}>
            <div className="mesh" style={{ animationDelay: '-6s' }} />
            <span className="pill">The reach</span>
            <div className="mission-stats" style={{ marginTop: '1.4rem' }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            {/* decorative bar chart that breathes, like the dashboard bars in the reference */}
            <div className="bars" aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <i key={i} style={{ '--d': `${(i * 0.13).toFixed(2)}s`, '--h': `${34 + ((i * 41) % 62)}%` }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal as="header" className="section-head">
            <span className="pill">What we cover</span>
            <h2>Stories with a spine</h2>
            <p className="lede">Three ways Lagaam tells a story, each with its own pace and its own kind of depth.</p>
          </Reveal>
          <div className="spine" id="spine">
            {SPINE.map((r, i) => (
              <Reveal as="article" className="spine-row" i={i} key={r.title}>
                <div className="spine-media"><img src={thumb(r.list[0].id)} alt="" loading="lazy" /></div>
                <div className="spine-body">
                  <span className="tile-icon" style={{ position: 'static', transform: 'none' }}><Icon name={r.icon} /></span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <ul className="spine-list">
                    {r.list.map((v) => (
                      <li key={v.id}><Link to={watchHref(v)}><Icon name="play" />{v.title}</Link></li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <CenterCta label="Subscribe for every new story" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="header" className="section-head"><span className="pill">Find us</span><h2>Lagaam everywhere</h2></Reveal>
          <div className="platforms">
            {PLATFORMS.map((p, i) => (
              <Reveal className="tilt-scene" i={i} key={p.icon}>
                <TiltCard as="a" className="platform" max={8} href={p.href} target="_blank" rel="noopener noreferrer">
                  <span className="ico"><Icon name={p.icon} /></span>
                  <strong>{p.big}</strong>
                  <span>{p.text}</span>
                  <span className="more">Open <Icon name="up" /></span>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal as="header" className="section-head">
            <span className="pill">The Lagaam family</span>
            <h2>Our other channels</h2>
            <p className="lede">Beyond the main channel, Lagaam runs sister channels for clips, conversations and sport.</p>
          </Reveal>
          <div className="channels" id="channels">
            {sisterChannels.map((c, i) => {
              const width = `${Math.round((parseFloat(c.subs) / MAX_SUBS) * 100)}%`;
              return (
                <Reveal className="tilt-scene" i={i} key={c.name}>
                  <TiltCard className="channel" max={9}>
                    <span className="big-letter" aria-hidden="true">{c.name[0]}</span>
                    <span className="avatar">{c.name[0]}</span>
                    <h3>{c.name}</h3>
                    <span className="subs">{c.subs} subscribers</span>
                    <div className="meter"><i style={{ '--w': width, width }} /></div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
          <CenterCta label="Subscribe to Lagaam" />
          <p className="note">Channel names and subscriber counts are from the public YouTube page. The bars compare the sister channels with each other.</p>
        </div>
      </section>

      <CtaBand
        pill="Join the journey"
        title="Be part of the story"
        text="Subscribe, support on Patreon, or reach out to collaborate. Every bit helps us tell more."
      >
        <SubscribeButton variant="btn-dark" label="Subscribe" />
        <Link className="btn btn-light" to="/support"><Icon name="heart" /> Support Lagaam</Link>
        <Link className="btn btn-secondary" to="/contact">Collaborate <span className="icon-go"><Icon name="arrow" /></span></Link>
      </CtaBand>
    </>
  );
}
