# Lagaam

Website for Lagaam, the Raftar YouTube channel (@raftartv), built for the client Lagaam through MediaBuzz Global.
It is a MERN project: the React client is finished, and the Express + MongoDB server is laid out and waiting for its features.

## Structure

```
Lagaam/
├── client/          React front end (everything the visitor sees)
│   ├── public/
│   ├── src/
│   │   ├── assets/        logo and images
│   │   ├── components/
│   │   │   ├── layout/    Layout, Header, Footer
│   │   │   ├── ui/        Icon, Logo, Reveal, Counter, Rail, Subscribe, CtaBand, PageHero, TiltCard
│   │   │   ├── video/     video cards and rows
│   │   │   └── effects/   WaveBackground, HeroScene (3D ring), Intro
│   │   ├── data/          video list, channel links and stats
│   │   ├── hooks/         useRail, useTextDecode, useTitle
│   │   ├── lib/           small helpers (intro timing)
│   │   ├── pages/         one file per route
│   │   └── styles/        global.css
│   ├── index.html
│   ├── vercel.json
│   └── package.json
├── server/          Express + MongoDB back end (placeholder folders only for now)
│   ├── src/
│   │   ├── config/        database and environment setup
│   │   ├── controllers/   request handlers
│   │   ├── middleware/    auth, validation, errors
│   │   ├── models/        Mongoose schemas
│   │   ├── routes/        API routes
│   │   ├── services/      business logic
│   │   └── utils/         shared helpers
│   └── tests/
└── package.json     scripts that run the client from the repo root
```

## Run the client

```bash
cd client
npm install
npm run dev      # http://localhost:5180
```

Or from the repo root, after `npm install` inside `client/`:

```bash
npm run dev
npm run build
```

More detail (pages, deployment, how the previews work) is in [client/README.md](client/README.md).

## Server

The `server/` folder only holds empty placeholder folders (kept in Git with a `.gitkeep` file each).
Nothing runs there yet. The API will be added feature by feature once the features are decided.

## Branches and tags

- `main`: the current site. The converted React project lives here.
- `demo/raftar-3d-theme`: the branch Vercel deploys from.
- `experiments/lagaam-new-features`: where new ideas are tried before they reach `main`.
- Tag `lagaam-stable-v1`: the approved React version, to restore if anything goes wrong.
- Tag `legacy-landing-page`: the original plain HTML landing page, before the React conversion.
