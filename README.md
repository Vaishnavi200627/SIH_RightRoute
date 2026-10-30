# RightRoute

Privacy-first crisis navigator for cybercrime in India. Given a short intake, RightRoute selects a pre-written route from a versioned rule file and shows the user exactly why that route was chosen.

## What it does

- Routes four crisis categories: **NCII**, **financial fraud**, **account takeover**, **stalking**.
- Every route shows the rule ID, the priority, the conditions that matched, and the reasoning behind the route.
- Local SHA-256 hashing so a user can keep an integrity reference for a file without uploading it.
- All routes point to official resources — NCRP, CERT-In, StopNCII, Take It Down (NCMEC).

## What it does not do

- It does not store intake answers.
- It does not upload files. Hashing runs in the browser via Web Crypto.
- It does not produce court-admissible evidence. It produces a personal integrity reference.
- It is not legal advice.

## Structure
src/data/crisis-rules.json The ruleset. This is the policy layer.
src/data/resources.json Every official resource, keyed by ID.
src/lib/engine.js Reads the ruleset, matches intake, returns route + why.
src/lib/hash.js SHA-256 via Web Crypto.
src/lib/analytics.js Fire-and-forget ping. Sends only category + language.
server/ Optional. Serves the ruleset and anonymous counters.

text

## Running it

Backend (optional, for the Impact Dashboard):

```bash
cd server
npm install
npm start
Frontend:

bash
npm install
npm run dev
Frontend runs at http://localhost:5173. If the backend is not running, the app still works — the engine runs client-side.

Ruleset
The ruleset lives in src/data/crisis-rules.json. Rules are sorted by descending priority; the first rule whose when block fully matches the intake is selected. To add a route, add an object there. No code changes required.

Deployment
Frontend: Vercel. Set VITE_API_URL to your Render backend URL.

Backend: Render. Root directory must be the repo root, not server/, because the server reads the ruleset from ../src/data/crisis-rules.json.

License
MIT.

text


### 6. `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f766e"/>
  <text x="32" y="42" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="700" text-anchor="middle" fill="#ffffff">RR</text>
</svg>


