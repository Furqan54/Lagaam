import { CHANNEL, stats, sisterChannels, videos, thumb, watchHref } from '../data.js';
import { icon } from '../icons.js';
import { esc } from '../cards.js';

const $ = (id) => document.getElementById(id);

export function init() {
  $('stats').innerHTML = stats.map((s) => `
    <div>
      <strong data-count="${s.value}" data-dec="${s.decimals}" data-suffix="${s.suffix}">0</strong>
      <span>${esc(s.label)}</span>
    </div>`).join('');

  const by = (f) => videos.filter(f);
  const rows = [
    { title: 'Investigate', ic: 'film', text: 'Power, politics and the institutions that shape daily life, researched before it is told.',
      list: by((v) => v.type === 'doc' && ['Politics', 'Karachi'].includes(v.topic)).slice(0, 3) },
    { title: 'Explain', ic: 'hourglass', text: 'History and the economy, broken down so that anyone can follow the argument.',
      list: by((v) => v.topic === 'History' || v.topic === 'Economy').filter((v) => v.type !== 'short').slice(0, 3) },
    { title: 'Converse', ic: 'mic', text: 'Long-form podcasts with people who were in the room when it happened.',
      list: by((v) => v.type === 'podcast').slice(0, 3) },
  ];
  $('spine').innerHTML = rows.map((r, i) => `
    <article class="spine-row reveal" style="--i:${i}">
      <div class="spine-media"><img src="${thumb(r.list[0].id)}" alt="" loading="lazy"></div>
      <div class="spine-body">
        <span class="tile-icon" style="position:static;transform:none">${icon(r.ic)}</span>
        <h3>${r.title}</h3>
        <p>${esc(r.text)}</p>
        <ul class="spine-list">${r.list.map((v) => `<li><a href="${watchHref(v)}">${icon('play')}${esc(v.title)}</a></li>`).join('')}</ul>
      </div>
    </article>`).join('');

  const platforms = [
    { ic: 'youtube', big: '1.25M', text: 'YouTube subscribers', href: CHANNEL.url },
    { ic: 'instagram', big: '157K', text: 'Instagram followers', href: CHANNEL.instagram },
    { ic: 'patreon', big: '8,865', text: 'Patreon members', href: CHANNEL.patreon },
    { ic: 'tiktok', big: 'TikTok', text: 'Short clips and updates', href: CHANNEL.tiktok },
  ];
  $('platforms').innerHTML = platforms.map((p, i) => `
    <div class="tilt-scene reveal" style="--i:${i}">
      <a class="card tilt platform" href="${p.href}" target="_blank" rel="noopener noreferrer" data-tilt="8">
        <span class="ico">${icon(p.ic)}</span><strong>${p.big}</strong><span>${p.text}</span>
        <span class="more">Open ${icon('up')}</span>
      </a>
    </div>`).join('');

  const max = Math.max(...sisterChannels.map((c) => parseFloat(c.subs)));
  $('channels').innerHTML = sisterChannels.map((c, i) => `
    <div class="tilt-scene reveal" style="--i:${i}">
      <div class="card tilt channel" data-tilt="9">
        <span class="big-letter" aria-hidden="true">${esc(c.name[0])}</span>
        <span class="avatar">${esc(c.name[0])}</span>
        <h3>${esc(c.name)}</h3>
        <span class="subs">${esc(c.subs)} subscribers</span>
        <div class="meter"><i style="--w:${Math.round((parseFloat(c.subs) / max) * 100)}%; width:${Math.round((parseFloat(c.subs) / max) * 100)}%"></i></div>
      </div>
    </div>`).join('');
}
