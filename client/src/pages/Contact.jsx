import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHANNEL } from '../data/data.js';
import Icon from '../components/ui/Icon.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { SubscribeStrip } from '../components/ui/Subscribe.jsx';
import useTitle from '../hooks/useTitle.js';

const TOPICS = ['Collaboration', 'Sponsorship', 'Guest or story idea', 'Feedback', 'Something else'];
const empty = { name: '', email: '', topic: TOPICS[0], message: '' };

const SOCIALS = [
  ['YouTube', 'youtube', CHANNEL.url],
  ['Instagram', 'instagram', CHANNEL.instagram],
  ['TikTok', 'tiktok', CHANNEL.tiktok],
  ['Facebook', 'facebook', CHANNEL.facebook],
  ['Patreon', 'patreon', CHANNEL.patreon],
];

export default function Contact() {
  useTitle('Contact — Lagaam');
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Native validation (required fields + a real email address) with the browser's own messages.
    if (!e.currentTarget.reportValidity()) return;
    // Demo only: the MERN build will POST this to /api/contact (Express + MongoDB + email).
    setSent(true);
    setForm(empty);
  };

  return (
    <>
      <PageHero
        art="podcast"
        offset={1}
        crumbs={[{ label: 'Contact' }]}
        pill="Rabta"
        title="Collaborate and partner"
        lede="Brand partnerships, guest ideas, story tips or feedback: send us a note and the team will take it from there."
      />
      <SubscribeStrip title="Stay in the loop" text="Subscribe to see what Lagaam publishes next." />

      <section className="section">
        <div className="container contact-grid">
          <Reveal as="form" className="panel form" onSubmit={submit}>
            <h2>Send a message</h2>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" autoComplete="name" required value={form.name} onChange={set('name')} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div className="field">
              <fieldset>
                <legend>What is this about?</legend>
                <div className="topic-chips">
                  {TOPICS.map((t) => (
                    <label key={t}>
                      <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set('topic')} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required value={form.message} onChange={set('message')} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ justifySelf: 'start', padding: '1rem 1.8rem' }}>
              <Icon name="send" /> Send message <span className="icon-go"><Icon name="arrow" /></span>
            </button>
            <div className={`form-ok ${sent ? 'show' : ''}`} role="status">
              Thanks! This is a design demo, so nothing was sent. The real form will email Lagaam's team.
            </div>
          </Reveal>

          <Reveal as="aside" className="info-list" i={1}>
            <div className="panel info-card">
              <span className="ico"><Icon name="mail" /></span>
              <div><h3>Email</h3><a className="plain" href={`mailto:${CHANNEL.email}`}>{CHANNEL.email}</a></div>
            </div>
            <div className="panel info-card">
              <span className="ico"><Icon name="users" /></span>
              <div>
                <h3>Follow Lagaam</h3>
                <div className="social-pills">
                  {SOCIALS.map(([name, icon, href]) => (
                    <a key={name} href={href} target="_blank" rel="noopener noreferrer"><Icon name={icon} />{name}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="panel info-card">
              <span className="ico"><Icon name="heart" /></span>
              <div>
                <h3>Support the channel</h3>
                <p>Prefer to help directly? Join us on Patreon.</p>
                <p style={{ marginTop: '.8rem' }}>
                  <Link className="btn btn-secondary btn-sm" to="/support">Support Lagaam <span className="icon-go"><Icon name="arrow" /></span></Link>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
