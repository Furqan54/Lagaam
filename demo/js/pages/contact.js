import { CHANNEL } from '../data.js';
import { icon } from '../icons.js';

const TOPICS = ['Collaboration', 'Sponsorship', 'Guest or story idea', 'Feedback', 'Something else'];

export function init() {
  const mail = document.getElementById('mail');
  mail.href = 'mailto:' + CHANNEL.email;
  mail.textContent = CHANNEL.email;

  document.getElementById('topics').innerHTML = TOPICS.map((t, i) =>
    `<label><input type="radio" name="topic" value="${t}" ${i === 0 ? 'checked' : ''}><span>${t}</span></label>`).join('');

  document.getElementById('socials').innerHTML = [
    ['YouTube', 'youtube', CHANNEL.url], ['Instagram', 'instagram', CHANNEL.instagram], ['TikTok', 'tiktok', CHANNEL.tiktok],
    ['Facebook', 'facebook', CHANNEL.facebook], ['Patreon', 'patreon', CHANNEL.patreon],
  ].map(([n, ic, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${icon(ic)}${n}</a>`).join('');

  const form = document.getElementById('form');
  const ok = document.getElementById('ok');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('[required]')].find((f) => !f.value.trim() || (f.type === 'email' && !f.validity.valid));
    if (bad) { bad.focus(); bad.reportValidity?.(); return; }
    // Demo only: the MERN build will POST this to /api/contact (Express + MongoDB + email).
    ok.classList.add('show');
    form.reset();
    form.querySelector('input[name=topic]').checked = true;
  });
}
