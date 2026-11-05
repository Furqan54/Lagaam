import { createContext, useEffect, useRef, useState } from 'react';
import { getVideo, previewRange } from '../data/data.js';

/** Lets a card's thumbnail know when to show the hover preview iframe. */
export const CardContext = createContext({ frameSrc: null, onFrameLoad: () => {} });

// "any-hover": true when at least one connected input (mouse, trackpad) can hover. The stricter "hover: hover"
// only looks at the primary input, which touchscreen laptops and some browsers report as non-hovering.
const canHover = () => typeof matchMedia !== 'undefined' && matchMedia('(any-hover: hover)').matches;
const prefersReducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A card that tilts in 3D toward the pointer, with a soft glare and a directional shadow.
 * If `previewId` is given it also plays a short muted intro preview after hovering for a moment
 * (never the whole video). `as` can be 'div', 'a' or a router Link.
 */
export default function TiltCard({ as: Tag = 'div', max = 8, previewId, className = '', children, ...rest }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const [hover, setHover] = useState(false);
  const [frame, setFrame] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const setVar = (name, value) => ref.current?.style.setProperty(name, value);

  const onEnter = () => {
    if (!canHover()) return; // touch devices: tapping just opens the video page
    setHover(true);
    if (previewId) timer.current = setTimeout(() => setFrame(true), 450);
  };

  const onMove = (e) => {
    if (!canHover() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setVar('--mx', `${px * 100}%`);
    setVar('--my', `${py * 100}%`);
    if (!prefersReducedMotion()) {
      setVar('--ry', ((px - 0.5) * 2 * max).toFixed(2));
      setVar('--rx', ((0.5 - py) * 2 * max).toFixed(2));
    }
  };

  const onLeave = () => {
    setHover(false);
    setFrame(false);
    setPlaying(false);
    clearTimeout(timer.current);
    setVar('--rx', 0);
    setVar('--ry', 0);
  };

  let frameSrc = null;
  if (frame && previewId) {
    const [start] = previewRange(getVideo(previewId) ?? {});
    frameSrc = `https://www.youtube-nocookie.com/embed/${previewId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${previewId}&start=${start}&end=${start + 12}&modestbranding=1`;
  }

  return (
    <CardContext.Provider value={{ frameSrc, onFrameLoad: () => setPlaying(true) }}>
      <Tag
        ref={ref}
        className={`card tilt ${className} ${hover ? 'is-hover' : ''} ${playing ? 'is-previewing' : ''}`}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        {...rest}
      >
        {children}
      </Tag>
    </CardContext.Provider>
  );
}
