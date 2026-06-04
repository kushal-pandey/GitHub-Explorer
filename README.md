# GitHub Repo Explorer

A full-stack web application that lets you search any GitHub username and explore their public profile and repositories — built with Node.js (Express) on the backend and React (Vite) on the frontend.

> **Exercise 3** from the Studio Graphene Full Stack Developer Assessment.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://git-hub-explorer-ten-teal.vercel.app/` 
| Backend (Railway) | `https://github-explorer-production-c6c6.up.railway.app/`

---

## Features

- Search any GitHub username and see their avatar, name, bio, follower/following counts, and public repo count
- Browse all public repositories with name, description, primary language, star count, and last-updated date
- Sort repos by ⭐ Stars, 🔤 Name, or 🕐 Last Updated
- Expand any repo card to see open issues count and default branch
- Load more repos (pagination — GitHub returns 30 per page)
- Server-side in-memory cache: same username within 60 seconds returns cached data, no extra GitHub API call
- Clear error handling for unknown usernames, rate-limit responses, and network failures
- Loading skeleton states while data is in flight
- Responsive on mobile

### Bonus
- Recently searched usernames stored in `localStorage`
- Language distribution chart (Recharts pie chart) across all repos

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Backend runtime | Node.js 18+ | Stable LTS, broad ecosystem |
| Backend framework | Express 4 | Minimal, well-documented, easy to reason about |
| HTTP client (server) | node-fetch | Lightweight, native-fetch-compatible |
| Server cache | node-cache | Simple TTL-based in-memory cache, zero config |
| CORS | cors | One-liner Express middleware |
| Env vars | dotenv | Standard .env loading |
| Frontend bundler | Vite + React | Fast HMR, modern defaults, no CRA overhead |
| Styling | Tailwind CSS | Utility-first, responsive out of the box |
| Charts | Recharts | Composable React chart library |
| HTTP client (client) | axios | Cleaner error handling than raw fetch |

---

## Project Structure

```
github-repo-explorer/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx       # Username input + submit
│   │   │   ├── UserProfile.jsx     # Avatar, bio, stats
│   │   │   ├── RepoList.jsx        # Sorted/filtered repo list
│   │   │   ├── RepoCard.jsx        # Single repo, expandable
│   │   │   ├── LanguageChart.jsx   # Recharts pie chart
│   │   │   ├── SkeletonLoader.jsx  # Loading placeholders
│   │   │   └── RecentSearches.jsx  # localStorage history
│   │   ├── hooks/
│   │   │   └── useGitHub.js        # Data-fetching hook
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── routes/
│   │   └── github.js           # /api/github/:username route
│   ├── middleware/
│   │   └── errorHandler.js     # Centralised error responses
│   ├── cache.js                # node-cache singleton (60s TTL)
│   ├── index.js                # App entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## How to Run Locally

> **Prerequisites:** Node.js 18 or higher installed. That's it.

### 1. Clone the repository

```bash
git clone https://github.com/kushal-pandey/GitHub-Explorer.git
cd github-repo-explorer
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and (optionally) add a GitHub Personal Access Token.  
Without a token the GitHub API allows **60 requests/hour** per IP.  
With a token it jumps to **5,000 requests/hour**.

```env
PORT=5000
GITHUB_TOKEN=ghp_your_token_here   # optional but recommended
```

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### 3. Set up the frontend (in a new terminal)

```bash
cd client
npm install
cp .env.example .env
```

Open `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Open the app

Navigate to `http://localhost:5173` and search for any GitHub username (e.g. `torvalds`, `gaearon`, `sindresorhus`).

---

## API Documentation

All routes are prefixed with `/api`.

### `GET /api/github/:username`

Fetches a GitHub user's profile and first page of public repositories.

**URL params**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | ✅ | GitHub username to look up |

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number for repo pagination |
| `per_page` | number | `30` | Repos per page (max 100) |

**Success response — 200 OK**

```json
{
  "user": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "avatar_url": "https://avatars.githubusercontent.com/u/1024025",
    "bio": "Linux and Git",
    "followers": 224000,
    "following": 0,
    "public_repos": 6
  },
  "repos": [
    {
      "id": 2325298,
      "name": "linux",
      "description": "Linux kernel source tree",
      "language": "C",
      "stargazers_count": 190000,
      "updated_at": "2024-06-01T10:00:00Z",
      "open_issues_count": 0,
      "default_branch": "master",
      "html_url": "https://github.com/torvalds/linux"
    }
  ],
  "cached": false
}
```

**Error responses**

| Status | Body | When |
|--------|------|------|
| `404` | `{ "error": "User not found" }` | Username doesn't exist on GitHub |
| `429` | `{ "error": "GitHub rate limit exceeded. Try again later." }` | GitHub API rate limit hit |
| `500` | `{ "error": "Internal server error" }` | Unexpected server failure |

---

### `GET /health`

Simple health check endpoint used by Railway/Render to confirm the server is alive.

**Response — 200 OK**

```json
{ "status": "ok" }
```

---

## Dependencies — Full List

### Backend (`server/package.json`)

```bash
npm install express cors dotenv node-fetch node-cache
npm install --save-dev nodemon
```

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.19 | HTTP server framework |
| `cors` | ^2.8 | Allows frontend origin to call the API |
| `dotenv` | ^16 | Loads `.env` variables into `process.env` |
| `node-fetch` | ^3 | Makes HTTP requests to the GitHub API |
| `node-cache` | ^5 | In-memory TTL cache (60 s) |
| `nodemon` | ^3 (dev) | Auto-restarts server on file changes |

### Frontend (`client/package.json`)

```bash
npm create vite@latest client -- --template react
cd client
npm install axios recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18 | UI library |
| `react-dom` | ^18 | DOM renderer |
| `axios` | ^1.6 | HTTP requests to backend with clean error handling |
| `recharts` | ^2.12 | Language distribution pie chart |
| `tailwindcss` | ^3 (dev) | Utility-first CSS framework |
| `vite` | ^5 (dev) | Fast build tool and dev server |

---

## Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) and sign up (free tier available).
2. Click **New Project → Deploy from GitHub repo** and select your repository.
3. Choose the `server` folder as the **root directory** (Railway lets you set this in settings).
4. Add environment variables in the Railway dashboard:
   - `PORT` → Railway sets this automatically; you don't need to set it manually.
   - `GITHUB_TOKEN` → paste your GitHub PAT here.
5. Railway detects `package.json` and runs `npm start` automatically.
6. Once deployed, copy the public URL (e.g. `https://your-app.up.railway.app`).

**`server/package.json` scripts required:**
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free).
2. Click **Add New → Project** and import your GitHub repository.
3. Set the **Root Directory** to `client`.
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` → `https://your-railway-url.up.railway.app`
5. Click **Deploy**. Vercel auto-detects Vite and builds correctly.
6. Once live, test it in an incognito window before submitting.

> ⚠️ Make sure your Railway backend has CORS configured to allow your Vercel frontend URL.

---

## What Works

- ✅ Full profile display (avatar, bio, follower/following/repo counts)
- ✅ Repo list with name, description, language badge, stars, last-updated
- ✅ Sort by stars / name / last updated
- ✅ Expandable repo cards (open issues, default branch)
- ✅ Pagination / Load More
- ✅ 60-second server-side cache
- ✅ Loading skeleton states
- ✅ 404 / rate-limit / network error handling
- ✅ Recently searched list (localStorage)
- ✅ Language distribution pie chart
- ✅ Mobile responsive

## What I Would Build Next (Next Steps)

- **Authentication**: Let users log in with GitHub OAuth so the token is per-user and rate limits are far higher.
- **Persistent cache**: Replace in-memory cache with Redis so it survives server restarts and works across multiple instances.
- **Debounced search-as-you-type**: Currently requires pressing Enter/Submit; debouncing would feel snappier.
- **Repo search/filter**: Filter repos by language or keyword within a profile.
- **Tests**: Add Jest unit tests for the cache module and the GitHub route error-handling logic. The two most important edge cases are the 404 path and the rate-limit path.
- **Rate-limit headers**: Expose `X-RateLimit-Remaining` from GitHub to the frontend so the user can see how many requests they have left.

---

## Honesty Notes

- AI tools (Claude) were used to assist with boilerplate and structuring. Every line has been read, understood, and intentionally included.
- The in-memory cache resets on server restart — acceptable for this exercise, but Redis would be correct for production.
- GitHub's unauthenticated rate limit is 60 req/hr. Adding a `GITHUB_TOKEN` is strongly recommended for reviewers testing the live demo.