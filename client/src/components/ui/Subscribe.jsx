import { CHANNEL } from '../../data/data.js';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';

export const SUBSCRIBE_HREF = `${CHANNEL.url}?sub_confirmation=1`;

/** Link to the channel with the YouTube subscribe prompt open. */
export function SubscribeButton({ label = 'Subscribe', variant = 'btn-primary', small = false, arrow = true, className = '' }) {
  return (
    <a className={`btn ${variant} ${small ? 'btn-sm' : ''} ${className}`} href={SUBSCRIBE_HREF} target="_blank" rel="noopener noreferrer">
      <Icon name="youtube" /> {label} {arrow && <span className="icon-up"><Icon name="up" /></span>}
    </a>
  );
}

/** Slim banner with a message and a Subscribe button, used under every page hero. */
export function SubscribeStrip({ title, text }) {
  return (
    <section className="sub-strip-wrap">
      <div className="container">
        <Reveal className="sub-strip">
          <span className="sub-strip-icon"><Icon name="youtube" /></span>
          <div className="sub-strip-text"><strong>{title}</strong><span>{text}</span></div>
          <SubscribeButton label="Subscribe on YouTube" />
        </Reveal>
      </div>
    </section>
  );
}

/** Centred Subscribe button under a block of content. */
export function CenterCta({ label = 'Subscribe to Lagaam' }) {
  return (
    <Reveal className="center-cta">
      <SubscribeButton label={label} />
    </Reveal>
  );
}
