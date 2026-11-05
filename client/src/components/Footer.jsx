import { Link } from 'react-router-dom';
import { CHANNEL } from '../data/data.js';
import Icon from './Icon.jsx';
import { Logo, CyberXMark } from './Logo.jsx';

const external = { target: '_blank', rel: 'noopener noreferrer' };

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-watermark" aria-hidden="true">LAGAAM</div>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/" aria-label="Lagaam home"><Logo /></Link>
            <p className="footer-blurb">Unfiltered stories on crime, power, history and the economy. Barhnay do.</p>
            <p className="footer-mail">Collaborate: <a href={`mailto:${CHANNEL.email}`}>{CHANNEL.email}</a></p>
          </div>
          <div>
            <h4>Watch</h4>
            <Link to="/videos">All videos</Link>
            <Link to="/documentaries">Documentaries</Link>
            <Link to="/podcasts">Podcasts</Link>
            <Link to="/shorts">Shorts</Link>
          </div>
          <div>
            <h4>Lagaam</h4>
            <Link to="/about">About</Link>
            <Link to="/support">Support us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Follow</h4>
            <a href={CHANNEL.url} {...external}><Icon name="youtube" /> YouTube</a>
            <a href={CHANNEL.instagram} {...external}><Icon name="instagram" /> Instagram</a>
            <a href={CHANNEL.tiktok} {...external}><Icon name="tiktok" /> TikTok</a>
            <a href={CHANNEL.facebook} {...external}><Icon name="facebook" /> Facebook</a>
            <a href={CHANNEL.patreon} {...external}><Icon name="patreon" /> Patreon</a>
          </div>
        </div>
        <div className="footer-fine">
          <span>Design demo, not the final theme. Videos and thumbnails belong to their owners.</span>
          <a className="devby" href="https://cyberxsoft.net" {...external}>
            <CyberXMark />
            <span>Developed by <strong>CyberXSoft</strong></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
