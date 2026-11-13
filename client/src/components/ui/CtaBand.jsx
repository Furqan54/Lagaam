import Reveal from './Reveal.jsx';

/** Big gradient banner at the bottom of a page. Children are the buttons. */
export default function CtaBand({ pill, title, text, children }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <span className="pill">{pill}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-actions">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}
