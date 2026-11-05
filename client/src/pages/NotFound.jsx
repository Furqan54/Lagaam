import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import useTitle from '../hooks/useTitle.js';

export default function NotFound() {
  useTitle('Page not found — Lagaam');
  return (
    <section className="section" style={{ paddingTop: '10rem' }}>
      <div className="container">
        <div className="empty">
          <strong>Page not found</strong>
          <p>That page does not exist, or it moved.</p>
          <p><Link className="btn btn-primary" to="/">Back to home <Icon name="arrow" /></Link></p>
        </div>
      </div>
    </section>
  );
}
