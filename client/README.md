# Raftar client (React)

Front end of the Raftar website: React 19, React Router, Vite and Three.js (the 3D hero).
The Express + MongoDB side of the MERN stack will live in a `server/` folder next to this one.

## Run it

```bash
cd client
npm install
npm run dev      # http://localhost:5180
npm run build    # production build into dist/
```

## Deploying to Vercel

- Import the repo, set **Root Directory** to `client`, preset **Vite** (build `npm run build`, output `dist`).
- `vercel.json` sends every route to `index.html`, so refreshing on `/videos` or `/about` works.
- The demo lives on the `demo/raftar-3d-theme` branch. `main` is the original Lagaam landing page and stays as it is.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home with the 3D hero |
| `/videos` | All videos (filters and search are kept in the URL) |
| `/documentaries`, `/podcasts`, `/shorts` | Content pages |
| `/watch/:id` | Intro-only player for one video, then a link to YouTube |
| `/about`, `/support`, `/contact` | Company pages |

## Where things are

- `src/data/data.js` has the video list, channel links and stats. This is what the Express API will serve later.
- `src/components/` holds the shared pieces: header, footer, cards, carousel, hero art, subscribe buttons.
- `src/hooks/` holds `useRail` (carousels with an optional auto-loop) and `useTitle`.
- `src/styles/global.css` is the one stylesheet.

## Notes

- Videos only play an intro (first 45 seconds, 15 for Shorts). Change it per video with `preview: [start, end]` in `data.js`.
- The logo is a stand-in until the official Raftar file is available.
- The membership tiers on the Support page are placeholders.
