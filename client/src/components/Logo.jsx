import { useId } from 'react';

/** Stand-in for the real Raftar mark until the official file arrives: black disc, red-to-orange ring and R. */
export function Logo() {
  const id = useId();
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e5301f" />
          <stop offset="1" stopColor="#ff7a1a" />
        </linearGradient>
      </defs>
      <g className="ring">
        <circle cx="24" cy="24" r="22" fill="#0b0b0d" stroke={`url(#${id})`} strokeWidth="2.4" strokeDasharray="118 20" strokeLinecap="round" />
      </g>
      <g className="r">
        <path d="M17 34V14h9.2a5.8 5.8 0 0 1 0 11.6H17M25 25.6 33 34" fill="none" stroke={`url(#${id})`} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Small CyberXSoft mark used in the footer credit. */
export function CyberXMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m10 10 12 12M22 10 10 22" stroke="#ff6a2b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
