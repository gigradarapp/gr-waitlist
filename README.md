# Buzo Waitlist

Public acquisition and waitlist surface for Buzo, a Singapore-first AI nightlife concierge.

This repo exists to show early go-to-market motion beside the main product. The full app answers "what is worth going to tonight?" The waitlist explains the value in one screen, shows a product demo video, embeds the signup form, and gives judges evidence that the product has a distribution path beyond the hackathon demo.

## Judge TL;DR

| Question | Answer |
| --- | --- |
| What does this repo prove? | Buzo is not only an engineering demo. It has a public acquisition surface and a clear waitlist CTA. |
| What user pain is shown? | People spend too much time checking scattered event sources before deciding where to go. |
| What is the offer? | "The AI friend who always knows what's on tonight." |
| What should judges inspect? | `src/App.tsx`, `public/demo.mp4`, `src/tally.ts`, `api/tally-count.js`, and the README setup. |
| What is protected? | Tally API keys stay server-side in the Vercel function. No Tally bearer key is exposed through `VITE_*`. |

## Public Evaluation Repositories

| Repository | Role |
| --- | --- |
| [`gr-frontend`](https://github.com/gigradarapp/gr-frontend) | React/Vite mobile-web app and main product surface. |
| [`gr-backend`](https://github.com/gigradarapp/gr-backend) | Cloudflare Workers API for auth, events, planning, AI, payments, weather, and media helpers. |
| [`gr-architecture`](https://github.com/gigradarapp/gr-architecture) | Architecture, data ownership, environments, rollout notes, and contracts. |
| [`gr-waitlist`](https://github.com/gigradarapp/gr-waitlist) | This repo: public waitlist and early acquisition surface. |

## Live Links

| Surface | URL |
| --- | --- |
| Waitlist | `https://gr-waitlist.vercel.app/` |
| Hosted app | `https://gr-frontend-dev.vercel.app/` |
| Hosted API health | `https://gr-backend-dev.gigradar.workers.dev/health` |

## What To Review First

1. `src/App.tsx` for the full landing page, waitlist CTA, demo video, credibility block, and live counter.
2. `public/demo.mp4` for the product teaser displayed in the phone frame.
3. `src/tally.ts` and `src/config/tally.ts` for Tally embed initialization.
4. `api/tally-count.js` for server-side Tally count fetching without exposing the API key.
5. `src/tallyCount.test.ts` for the counter client test.

## Product Role

The waitlist supports the public story:

```text
User
  -> gr-waitlist (learn, watch demo, join waitlist)
  -> gr-frontend (use Discover, Ask Buzo, Plan, Profile)
  -> gr-backend (auth, events, AI, planning, billing)
```

It is intentionally separate from the full app so acquisition copy can move quickly while the core product keeps a focused mobile-app shell.

## Production Readiness Snapshot

| Signal | Evidence |
| --- | --- |
| Public deployment | `https://gr-waitlist.vercel.app/` |
| Clear conversion path | Single primary CTA opens the Tally waitlist embed. |
| Demo artifact | `public/demo.mp4` shows the product concept in the first-scroll experience. |
| Secret boundary | `TALLY_API_KEY` is read by `api/tally-count.js`; no browser-exposed `VITE_TALLY_API_KEY`. |
| Graceful fallback | If the count API is unavailable, the UI falls back to the configured seed count. |
| Minimal runtime | React/Vite app with a small Vercel serverless function for count aggregation. |

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Vite serves the landing page at `http://localhost:5173`.

Local Vite does not run the Vercel `api/tally-count.js` function by default. The UI will gracefully use the configured fallback count unless you run the project through Vercel local tooling.

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `TALLY_API_KEY` | Vercel serverless function only | Optional server-side key used by `api/tally-count.js` to read completed submission count. |

Do not prefix the Tally key with `VITE_`. Vite exposes `VITE_*` variables in the browser bundle.

The Tally form ID is derived from `TALLY_EMBED_URL` in `src/config/tally.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Vite on port 5173. |
| `npm run build` | Type-check and build static assets. |
| `npm run preview` | Preview the production build. |
| `npm test` | Run Vitest once. |
| `npm run test:watch` | Run tests in watch mode. |

## Deploy

Deploy on Vercel:

1. Build command: `npm run build`
2. Output directory: `dist`
3. Add server-side env var `TALLY_API_KEY` only if the live signup count should come from Tally.
4. Keep the Tally embed URL in `src/config/tally.ts` aligned with the production form.

## Public Repo Hygiene

- Do not commit `.env`, API keys, downloaded submission data, or private strategy notes.
- Keep `public/demo.mp4`, `public/logo-wordmark.png`, and `public/founder.jpg` as intentional public assets.
- Keep waitlist copy focused on user value: fewer tabs, less manual curation, faster decisions.
- Link judges to `gr-frontend`, `gr-backend`, and `gr-architecture` for the full product and system.
