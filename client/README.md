# Lagaam client (React)

Front end of the Lagaam website: React 19, React Router, Vite and Three.js (the 3D hero).
The Express + MongoDB side of the MERN stack lives in the `server/` folder next to this one. See the [root README](../README.md).

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
- The demo lives on the `demo/raftar-3d-theme` branch. `main` holds the same React project.

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
- `src/components/` is split into `layout/` (Layout, Header, Footer), `ui/` (shared pieces such as cards, carousel and subscribe buttons), `video/` (video cards) and `effects/` (wave background, 3D hero, loading intro).
- `src/hooks/` holds `useRail` (carousels), `useTextDecode` (heading decode) and `useTitle`.
- `src/styles/global.css` is the one stylesheet.

## Notes

- Videos only play an intro (first 45 seconds, 15 for Shorts). Change it per video with `preview: [start, end]` in `data.js`.
- The logo is `src/assets/lagaam-logo.png`, cropped from the original Lagaam logo. The artwork is dark burgundy, so it sits on a white plate on the dark theme.
- The colour scheme comes from the logo (burgundy `#650a34`). The tokens are at the top of `global.css`.
- The YouTube handle, social links and contact email in `data.js` are the channel's real addresses, so they still say raftar.
- The membership tiers on the Support page are placeholders.
