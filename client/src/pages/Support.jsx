import { Link } from 'react-router-dom';
import { CHANNEL } from '../data/data.js';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import TiltCard from '../components/TiltCard.jsx';
import PageHero from '../components/PageHero.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { SUBSCRIBE_HREF, SubscribeStrip, CenterCta } from '../components/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const external = { target: '_blank', rel: 'noopener noreferrer' };

// Design placeholders. Only "from $3 a month", 8,865 members and 78 exclusive posts are public Patreon facts.
const TIERS = [
  { name: 'Supporter', price: '$3', perks: ['Access to the members community', 'Exclusive member posts', 'Your name on the supporter wall'] },
  { name: 'Insider', price: '$8', top: true, perks: ['Everything in Supporter', 'Behind-the-scenes updates', 'Vote on upcoming topics'] },
  { name: 'Producer', price: '$20', perks: ['Everything in Insider', 'Early access to documentaries', 'Credit in selected videos'] },
];

const FAQ = [
  ['Where does my money go?', 'Into research, production and the team that makes each documentary and podcast.'],
  ['Can I cancel any time?', 'Yes. Patreon memberships can be paused or cancelled whenever you like from your Patreon account.'],
  ['Do I need a Patreon account?', 'Yes. Membership is handled securely by Patreon, so this site never sees your payment details.'],
  ['What do members get?', 'Members get access to exclusive posts and the community. Specific perks depend on the tier you choose on Patreon.'],
  ['Can I support without paying?', 'Absolutely. Subscribing, liking, commenting and sharing all help a story reach more people.'],
  ['How do I suggest a topic or guest?', 'Use the contact page and choose "Guest or story idea". The team reads every message.'],
  ['I run a brand. Can we work together?', 'Yes. Pick "Collaboration" or "Sponsorship" on the contact page, or email the team directly.'],
  ['Is my membership public?', 'Patreon controls this. You can manage how your name appears from your Patreon settings.'],
];

export default function Support() {
  useTitle('Support Raftar');

  return (
    <>
      <PageHero
        art="doc"
        offset={1}
        crumbs={[{ label: 'Support' }]}
        pill="Raftar Barhnay Do"
        title="Keep independent storytelling alive"
        lede="8,865 members already back Raftar on Patreon, from $3 a month. Members get exclusive posts and a place in the community."
      >
        <a className="btn btn-primary" href={CHANNEL.patreon} {...external}><Icon name="patreon" /> Join on Patreon <span className="icon-up"><Icon name="up" /></span></a>
        <a className="btn btn-secondary" href="#tiers">See membership ideas <span className="icon-go"><Icon name="arrow" /></span></a>
      </PageHero>
      <SubscribeStrip title="Start by subscribing, it is free" text="It is the biggest thing you can do for how far a story travels." />

      <section className="section" id="tiers">
        <div className="container">
          <Reveal as="header" className="section-head"><span className="pill">Membership</span><h2>Ways to join</h2></Reveal>
          <div className="tiers">
            {TIERS.map((t, i) => (
              <Reveal className="tilt-scene" i={i} key={t.name}>
                <TiltCard className={`tier ${t.top ? 'top' : ''}`} max={6}>
                  {t.top && <span className="tag tier-tag">Most popular</span>}
                  <h3>{t.name}</h3>
                  <div className="price">{t.price}<small> / month</small></div>
                  <ul>
                    {t.perks.map((p) => <li key={p}><Icon name="check" /><span>{p}</span></li>)}
                  </ul>
                  <a className={`btn ${t.top ? 'btn-primary' : 'btn-secondary'}`} href={CHANNEL.patreon} {...external}>
                    Join on Patreon <span className="icon-up"><Icon name="up" /></span>
                  </a>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <p className="note">Design placeholder: the tier names, most perks and the $8 and $20 prices are sample content. Public Patreon facts used here: from $3 a month, 8,865 members, 78 exclusive posts. The real tiers will replace these.</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal as="header" className="section-head"><span className="pill">Not ready to pay?</span><h2>Other ways to help</h2></Reveal>
          <div className="ways">
            <Reveal className="tilt-scene">
              <TiltCard className="way" max={6}>
                <span className="ico"><Icon name="youtube" /></span>
                <h3>Subscribe</h3>
                <p>Free, and it makes the biggest difference to how far each story travels.</p>
                <a className="btn btn-secondary btn-sm" href={SUBSCRIBE_HREF} {...external}>Subscribe on YouTube <span className="icon-up"><Icon name="up" /></span></a>
              </TiltCard>
            </Reveal>
            <Reveal className="tilt-scene" i={1}>
              <TiltCard className="way" max={6}>
                <span className="ico"><Icon name="share" /></span>
                <h3>Share</h3>
                <p>Send a documentary to someone who should see it. Word of mouth is how Raftar grew.</p>
                <Link className="btn btn-secondary btn-sm" to="/videos">Pick a video <span className="icon-go"><Icon name="arrow" /></span></Link>
              </TiltCard>
            </Reveal>
            <Reveal className="tilt-scene" i={2}>
              <TiltCard className="way" max={6}>
                <span className="ico"><Icon name="mail" /></span>
                <h3>Collaborate</h3>
                <p>Brands, guests and partners: tell us what you have in mind.</p>
                <Link className="btn btn-secondary btn-sm" to="/contact">Contact the team <span className="icon-go"><Icon name="arrow" /></span></Link>
              </TiltCard>
            </Reveal>
          </div>
          <CenterCta label="Subscribe on YouTube" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal as="header" className="section-head" style={{ textAlign: 'center' }}><span className="pill">FAQ</span><h2>Good questions</h2></Reveal>
          <div className="faq">
            {FAQ.map(([q, a], i) => (
              <Reveal as="details" i={i % 4} key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        pill="Raftar Barhnay Do"
        title="Stories need people like you"
        text="Back the channel on Patreon, or start by subscribing. Either way, you are part of what keeps Raftar independent."
      >
        <a className="btn btn-light" href={CHANNEL.patreon} {...external}><Icon name="heart" /> Become a member <span className="icon-up"><Icon name="up" /></span></a>
        <a className="btn btn-secondary" href={SUBSCRIBE_HREF} {...external}>Subscribe free <span className="icon-up"><Icon name="up" /></span></a>
      </CtaBand>
    </>
  );
}
