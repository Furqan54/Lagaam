import { CHANNEL, getVideo, related, youtubeUrl, thumb, previewRange, TYPE_LABEL } from '../data.js';
import { episodeRow, esc } from '../cards.js';
import { icon } from '../icons.js';

/** Loads the YouTube IFrame API once. */
const loadYT = () => new Promise((resolve) => {
  if (window.YT?.Player) return resolve(window.YT);
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
});

export function init() {
  const root = document.getElementById('watch');
  const v = getVideo(new URLSearchParams(location.search).get('id'));

  if (!v) {
    document.title = 'Video not found — Raftar (Demo)';
    root.innerHTML = `<div class="empty"><strong>Video not found</strong><p>That link doesn't match anything in the demo.</p>
      <p><a class="btn btn-primary" href="videos.html">Browse all videos ${icon('arrow')}</a></p></div>`;
    return;
  }

  document.title = `${v.title} — Raftar (Demo)`;
  document.getElementById('ambient').style.backgroundImage = `url(${thumb(v.id)})`;

  const [start, end] = previewRange(v);
  const list = related(v, 5);
  const section = { doc: ['documentaries.html', 'Documentaries'], podcast: ['podcasts.html', 'Podcasts'], short: ['shorts.html', 'Shorts'] }[v.type];

  root.innerHTML = `
    <p class="crumbs"><a href="index.html">Home</a>${icon('right')}<a href="${section[0]}">${section[1]}</a>${icon('right')}<span>Intro preview</span></p>
    <div class="watch-grid">
      <div>
        <div class="player ${v.type === 'short' ? 'vertical' : ''}" id="playerBox">
          <div id="ytplayer"></div>
          <span class="preview-badge">Intro preview, first ${end - start}s</span>
          <div class="player-end" id="playerEnd" hidden>
            <strong>That was the intro.</strong>
            <p>Watch the full ${TYPE_LABEL[v.type].toLowerCase()} on Raftar's YouTube channel.</p>
            <div class="watch-actions" style="justify-content:center">
              <a class="btn btn-primary" href="${youtubeUrl(v)}" target="_blank" rel="noopener noreferrer">${icon('youtube')} Watch the full video <span class="icon-up">${icon('up')}</span></a>
              <button class="btn btn-secondary" id="replay" type="button">Replay intro</button>
            </div>
          </div>
        </div>
        <div class="watch-info">
          <div class="meta"><span class="tag">${esc(v.topic)}</span><small>${TYPE_LABEL[v.type]}</small></div>
          <h1>${esc(v.title)}</h1>
          ${v.desc ? `<p>${esc(v.desc)}</p>` : ''}
          <div class="watch-actions">
            <a class="btn btn-primary" href="${youtubeUrl(v)}" target="_blank" rel="noopener noreferrer">${icon('youtube')} Watch full video <span class="icon-up">${icon('up')}</span></a>
            <a class="btn btn-secondary" href="${CHANNEL.url}?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Subscribe</a>
            <button class="btn btn-secondary" id="copy" type="button">${icon('share')}<span>Copy link</span></button>
          </div>
        </div>
      </div>
      <aside class="upnext" aria-label="Up next">
        <h2>Up next</h2>
        ${list.map(episodeRow).join('')}
      </aside>
    </div>`;

  // Intro-only player: starts at `start`, stops at `end`, no scrubbing, then offers the full video.
  const endBox = document.getElementById('playerEnd');
  let player;
  loadYT().then((YT) => {
    player = new YT.Player('ytplayer', {
      videoId: v.id,
      width: '100%', height: '100%',
      playerVars: { start, end, autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
      events: {
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) endBox.hidden = false;
          if (e.data === YT.PlayerState.PLAYING) endBox.hidden = true;
        },
      },
    });
  });
  document.getElementById('replay').addEventListener('click', () => {
    endBox.hidden = true;
    player?.seekTo(start, true);
    player?.playVideo();
  });

  document.getElementById('copy').addEventListener('click', async (e) => {
    const label = e.currentTarget.querySelector('span');
    try { await navigator.clipboard.writeText(location.href); label.textContent = 'Copied'; }
    catch { label.textContent = 'Copy failed'; }
    setTimeout(() => (label.textContent = 'Copy link'), 1800);
  });
}
