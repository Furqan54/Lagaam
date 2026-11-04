import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { thumb, thumbSmall, watchHref, TYPE_LABEL } from '../data/data.js';
import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import TiltCard, { CardContext } from './TiltCard.jsx';
import { SUBSCRIBE_HREF } from './Subscribe.jsx';

/** Thumbnail with a small glass play button in the middle. The hover preview iframe mounts in .preview-layer. */
function Media({ v, small = false }) {
  const { frameSrc, onFrameLoad } = useContext(CardContext);
  return (
    <div className="media">
      <img className="video-thumbnail" src={small ? thumbSmall(v.id) : thumb(v.id)} alt={v.title} loading="lazy" />
      <div className="preview-layer">
        {frameSrc && <iframe src={frameSrc} title="Preview" tabIndex={-1} allow="autoplay; encrypted-media" onLoad={onFrameLoad} />}
      </div>
      <span className="play" aria-hidden="true"><Icon name="play" /></span>
      {v.type === 'short' && <span className="badge">Short</span>}
    </div>
  );
}

/** Wraps a card in the 3D perspective container that also handles the scroll reveal. */
const Scene = ({ i = 0, children }) => <Reveal className="tilt-scene" i={i % 6}>{children}</Reveal>;

const VideoLink = ({ v, className, max, children }) => (
  <TiltCard as={Link} to={watchHref(v)} previewId={v.id} className={className} max={max}>{children}</TiltCard>
);

/** Standard card: thumbnail on top, text underneath. */
export function VideoCard({ v, i = 0 }) {
  return (
    <Scene i={i}>
      <VideoLink v={v} className="vcard" max={7}>
        <Media v={v} />
        <div className="body">
          <div className="meta"><span className="tag">{v.topic}</span><small>{TYPE_LABEL[v.type]}</small></div>
          <h3>{v.title}</h3>
          {v.desc && <p>{v.desc}</p>}
        </div>
      </VideoLink>
    </Scene>
  );
}

/**
 * Large featured card. With `subscribe` a Subscribe button sits in the bottom-right corner.
 * It is a sibling of the card link, because a link inside a link is invalid HTML.
 */
export function FeatureCard({ v, i = 0, subscribe = false }) {
  return (
    <Scene i={i}>
      <VideoLink v={v} className="vcard large" max={4}>
        <Media v={v} />
        <div className="body">
          <div className="meta"><span className="tag">{v.topic}</span><small>{TYPE_LABEL[v.type]}</small></div>
          <h3>{v.title}</h3>
          <p>{v.desc}</p>
          <span className="more">Watch the intro <Icon name="arrow" /></span>
        </div>
      </VideoLink>
      {subscribe && (
        <a className="btn btn-primary btn-sm card-sub" href={SUBSCRIBE_HREF} target="_blank" rel="noopener noreferrer">
          <Icon name="youtube" /> Subscribe
        </a>
      )}
    </Scene>
  );
}

/** Compact horizontal card: small thumbnail on the left, text on the right. */
export function MiniCard({ v, i = 0 }) {
  return (
    <Scene i={i}>
      <VideoLink v={v} className="vcard compact" max={6}>
        <Media v={v} small />
        <div className="body">
          <span className="tag" style={{ alignSelf: 'flex-start' }}>{v.topic}</span>
          <h4>{v.title}</h4>
        </div>
      </VideoLink>
    </Scene>
  );
}

/** Vertical 9:16 card for Shorts. */
export function ShortCard({ v, i = 0 }) {
  return (
    <Scene i={i}>
      <VideoLink v={v} className="vcard short" max={9}>
        <Media v={v} />
        <div className="body">
          <h4>{v.title}</h4>
          <span className="tag" style={{ alignSelf: 'flex-start' }}>{v.topic}</span>
        </div>
      </VideoLink>
    </Scene>
  );
}

/** Podcast episode row: the thumbnail fills the full card height. */
export function EpisodeRow({ v, i = 0 }) {
  return (
    <Scene i={i}>
      <VideoLink v={v} className="vcard ep" max={3}>
        <Media v={v} small />
        <div className="body">
          <div className="meta"><span className="tag">{v.topic}</span><small>{TYPE_LABEL[v.type]}</small></div>
          <h4>{v.title}</h4>
          <span className="more">Watch the intro <Icon name="arrow" /></span>
        </div>
      </VideoLink>
    </Scene>
  );
}

export function EmptyState({ message = 'Nothing matches those filters yet.' }) {
  return (
    <div className="empty"><strong>No results</strong><p>{message}</p></div>
  );
}
