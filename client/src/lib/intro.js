// A hook for the page-load intro (added later). Anything that should wait for the intro to finish
// awaits `intro.done`. With no intro running it is already resolved, so nothing waits.
export const intro = { done: Promise.resolve() };
