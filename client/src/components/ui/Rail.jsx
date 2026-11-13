import Icon from './Icon.jsx';

/** Previous / next buttons for a carousel. Can sit anywhere on the page (usually in the section header). */
export function RailButtons({ rail }) {
  return (
    <div className="rail-head" {...rail.hold}>
      <button className="rail-btn" type="button" aria-label="Previous" disabled={rail.edge.start} onClick={rail.prev}>
        <Icon name="left" />
      </button>
      <button className="rail-btn" type="button" aria-label="Next" disabled={rail.edge.end} onClick={rail.next}>
        <Icon name="right" />
      </button>
    </div>
  );
}

/** Horizontally scrolling row of cards. `variant` is '', 'wide' or 'narrow'. */
export function RailTrack({ rail, variant = '', children }) {
  return (
    <div className="rail" {...rail.hold}>
      <div className={`rail-track ${variant}`} ref={rail.track}>{children}</div>
    </div>
  );
}
