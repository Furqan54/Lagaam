import { CHANNEL } from '../data.js';
import { icon } from '../icons.js';

const TIERS = [
  { name: 'Supporter', price: '$3', perks: ['Access to the members community', 'Exclusive member posts', 'Your name on the supporter wall'] },
  { name: 'Insider', price: '$8', top: true, perks: ['Everything in Supporter', 'Behind-the-scenes updates', 'Vote on upcoming topics'] },
  { name: 'Producer', price: '$20', perks: ['Everything in Insider', 'Early access to documentaries', 'Credit in selected videos'] },
];

const WAYS = [
  { ic: 'youtube', title: 'Subscribe', text: 'Free, and it makes the biggest difference to how far each story travels.', cta: 'Subscribe on YouTube', href: CHANNEL.url + '?sub_confirmation=1', ext: true },
  { ic: 'share', title: 'Share', text: 'Send a documentary to someone who should see it. Word of mouth is how Raftar grew.', cta: 'Pick a video', href: 'videos.html' },
  { ic: 'mail', title: 'Collaborate', text: 'Brands, guests and partners: tell us what you have in mind.', cta: 'Contact the team', href: 'contact.html' },
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

export function init() {
  const $ = (id) => document.getElementById(id);
  for (const id of ['patreon', 'patreon2']) $(id).href = CHANNEL.patreon;
  $('sub2').href = CHANNEL.url + '?sub_confirmation=1';

  $('tiers-grid').innerHTML = TIERS.map((t, i) => `
    <div class="tilt-scene reveal" style="--i:${i}">
      <div class="card tilt tier ${t.top ? 'top' : ''}" data-tilt="6">
        ${t.top ? '<span class="tag tier-tag">Most popular</span>' : ''}
        <h3>${t.name}</h3>
        <div class="price">${t.price}<small> / month</small></div>
        <ul>${t.perks.map((p) => `<li>${icon('check')}<span>${p}</span></li>`).join('')}</ul>
        <a class="btn ${t.top ? 'btn-primary' : 'btn-secondary'}" href="${CHANNEL.patreon}" target="_blank" rel="noopener noreferrer">Join on Patreon <span class="icon-up">${icon('up')}</span></a>
      </div>
    </div>`).join('');

  $('ways').innerHTML = WAYS.map((w, i) => `
    <div class="tilt-scene reveal" style="--i:${i}">
      <div class="card tilt way" data-tilt="6">
        <span class="ico">${icon(w.ic)}</span>
        <h3>${w.title}</h3>
        <p>${w.text}</p>
        <a class="btn btn-secondary btn-sm" href="${w.href}" ${w.ext ? 'target="_blank" rel="noopener noreferrer"' : ''}>${w.cta} <span class="${w.ext ? 'icon-up' : 'icon-go'}">${icon(w.ext ? 'up' : 'arrow')}</span></a>
      </div>
    </div>`).join('');

  $('faq').innerHTML = FAQ.map(([q, a], i) => `
    <details class="reveal" style="--i:${i % 4}"><summary>${q}</summary><p>${a}</p></details>`).join('');
}
