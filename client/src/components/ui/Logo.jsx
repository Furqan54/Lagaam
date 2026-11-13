import logo from '../../assets/lagaam-logo.png';

/** The real Lagaam logo on a light plate (the artwork is dark burgundy, so it needs a light surface on the dark theme). */
export function Logo() {
  return (
    <span className="logo-plate">
      <img className="logo-img" src={logo} alt="Lagaam" width="143" height="36" />
    </span>
  );
}

/** Small CyberXSoft mark used in the footer credit. */
export function CyberXMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m10 10 12 12M22 10 10 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
