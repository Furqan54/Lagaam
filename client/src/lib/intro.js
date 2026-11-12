// The page-load intro (logo, progress counter, curtain lift) runs once per full page load, not on in-app navigation.
// Text decoding, number decoding and card reveals all wait for `intro.done`, so the page assembles itself
// as the curtain lifts instead of animating unseen underneath it.
// With reduced motion there is no intro and `intro.done` is already resolved.
const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const introActive = !reduced;

let resolve;
export const intro = { done: introActive ? new Promise((r) => { resolve = r; }) : Promise.resolve() };

export const finishIntro = () => resolve?.();

// Safety net: if the intro component never mounts, never leave the page waiting.
if (introActive && typeof window !== 'undefined') setTimeout(finishIntro, 6000);
