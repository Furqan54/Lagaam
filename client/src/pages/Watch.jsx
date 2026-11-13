import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CHANNEL, getVideo, related, youtubeUrl, thumb, previewRange, TYPE_LABEL } from '../data/data.js';
import Icon from '../components/ui/Icon.jsx';
import { EpisodeRow } from '../components/video/VideoCards.jsx';
import { SUBSCRIBE_HREF } from '../components/ui/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const SECTION = {
  doc: ['/documentaries', 'Documentaries'],
  podcast: ['/podcasts', 'Podcasts'],
  short: ['/shorts', 'Shorts'],
};

/** Loads the YouTube IFrame API once and resolves with the global YT object. */
let ytPromise;
const loadYT = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  ytPromise ??= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  });
  return ytPromise;
};

function NotFoundVideo() {
  useTitle('Video not found — Lagaam');
  return (
    <div className="watch-wrap">
      <div className="container">
        <div className="empty">
          <strong>Video not found</strong>
          <p>That link doesn't match anything in the demo.</p>
          <p><Link className="btn btn-primary" to="/videos">Browse all videos <Icon name="arrow" /></Link></p>
        </div>
      </div>
    </div>
  );
}

export default function Watch() {
  const { id } = useParams();
  const v = getVideo(id);
  return v ? <WatchVideo key={v.id} v={v} /> : <NotFoundVideo />;
}

function WatchVideo({ v }) {
  useTitle(`${v.title} — Lagaam`);
  const [start, end] = previewRange(v);
  const mount = useRef(null);
  const player = useRef(null);
  const [ended, setEnded] = useState(false);
  const [copied, setCopied] = useState('Copy link');
  const section = SECTION[v.type];

  // Intro-only player: starts at `start`, stops at `end`, no scrubbing, then offers the full video on YouTube.
  useEffect(() => {
    let cancelled = false;
    const holder = mount.current;
    const target = document.createElement('div'); // YouTube replaces this node, so React must not own it
    holder.appendChild(target);
    loadYT().then((YT) => {
      if (cancelled) return;
      player.current = new YT.Player(target, {
        videoId: v.id,
        width: '100%',
        height: '100%',
        playerVars: { start, end, autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) setEnded(true);
            if (e.data === YT.PlayerState.PLAYING) setEnded(false);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      player.current?.destroy?.();
      player.current = null;
      holder.innerHTML = '';
    };
  }, [v.id, start, end]);

  const replay = () => {
    setEnded(false);
    player.current?.seekTo(start, true);
    player.current?.playVideo();
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied('Copied'); } catch { setCopied('Copy failed'); }
    setTimeout(() => setCopied('Copy link'), 1800);
  };

  return (
    <div className="watch-wrap">
      {/* Ambient glow: the video's own thumbnail, blurred, behind the player */}
      <div className="watch-ambient" style={{ backgroundImage: `url(${thumb(v.id)})` }} aria-hidden="true" />
      <div className="container">
        <p className="crumbs">
          <Link to="/">Home</Link><Icon name="right" />
          <Link to={section[0]}>{section[1]}</Link><Icon name="right" />
          <span>Intro preview</span>
        </p>
        <div className="watch-grid">
          <div>
            <div className={`player ${v.type === 'short' ? 'vertical' : ''}`}>
              <div ref={mount} style={{ width: '100%', height: '100%' }} />
              <span className="preview-badge">Intro preview, first {end - start}s</span>
              {ended && (
                <div className="player-end">
                  <strong>That was the intro.</strong>
                  <p>Watch the full {TYPE_LABEL[v.type].toLowerCase()} on Lagaam's YouTube channel.</p>
                  <div className="watch-actions" style={{ justifyContent: 'center' }}>
                    <a className="btn btn-primary" href={youtubeUrl(v)} target="_blank" rel="noopener noreferrer">
                      <Icon name="youtube" /> Watch the full video <span className="icon-up"><Icon name="up" /></span>
                    </a>
                    <button className="btn btn-secondary" type="button" onClick={replay}>Replay intro</button>
                  </div>
                </div>
              )}
            </div>
            <div className="watch-info">
              <div className="meta"><span className="tag">{v.topic}</span><small>{TYPE_LABEL[v.type]}</small></div>
              <h1>{v.title}</h1>
              {v.desc && <p>{v.desc}</p>}
              <div className="watch-actions">
                <a className="btn btn-primary" href={youtubeUrl(v)} target="_blank" rel="noopener noreferrer">
                  <Icon name="youtube" /> Watch full video <span className="icon-up"><Icon name="up" /></span>
                </a>
                <a className="btn btn-secondary" href={SUBSCRIBE_HREF} target="_blank" rel="noopener noreferrer">Subscribe</a>
                <button className="btn btn-secondary" type="button" onClick={copyLink}><Icon name="share" /><span>{copied}</span></button>
              </div>
            </div>
          </div>
          <aside className="upnext" aria-label="Up next">
            <h2>Up next</h2>
            {related(v, 5).map((x, i) => <EpisodeRow key={x.id} v={x} i={i} />)}
          </aside>
        </div>
      </div>
    </div>
  );
}
