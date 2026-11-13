import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { videos, thumb } from '../../data/data.js';
import Icon from './Icon.jsx';

/**
 * One connected 2x2 cluster of real thumbnails, tilted as a single block behind the heading.
 * kind: 'doc' | 'podcast' | 'mix' (documentaries + podcasts). Shorts are never used because their thumbnails are pillarboxed.
 */
export function HeroArt({ kind = 'mix', offset = 0 }) {
  const pool = videos.filter((v) => (kind === 'mix' ? v.type !== 'short' : v.type === kind));
  const step = pool.length >= 8 ? 2 : 1; // small pools: walk one by one so no thumbnail repeats
  const picks = Array.from({ length: 4 }, (_, i) => pool[(i * step + offset) % pool.length]);
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-cluster">
        {picks.map((v, i) => (
          <div className="art-panel" key={`${v.id}-${i}`}><img src={thumb(v.id)} alt="" /></div>
        ))}
      </div>
    </div>
  );
}

/** Hero for every inner page: breadcrumbs, pill, big title, intro text and optional buttons. */
export default function PageHero({ art = 'mix', offset = 0, crumbs = [], pill, title, lede, children }) {
  return (
    <section className="page-hero">
      <HeroArt kind={art} offset={offset} />
      <div className="container">
        <p className="crumbs">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (
            <Fragment key={c.label}>
              <Icon name="right" />
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </Fragment>
          ))}
        </p>
        <span className="pill">{pill}</span>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
        {children && <div className="hero-actions" style={{ marginTop: '1.6rem' }}>{children}</div>}
      </div>
    </section>
  );
}
