# InteliFin TraderHub

TraderHub is now a full-stack MVP built with React + Vite on the frontend and Express + SQLite on the backend.

## MVP features implemented

- Email/password authentication with session tokens
- Protected dashboard routes by authenticated user
- Live crypto market feed (CoinGecko integration)
- Persistent portfolio holdings and summary
- Persistent trading journal entries
- Persistent alerts/signals management
- AI chat endpoint with OpenAI integration (fallback mode when no key is set)
- Security controls: input validation, helmet, CORS, rate limiting, audit logs
- Health endpoint for monitoring: `GET /api/health`

## Tech stack

- Frontend: React, TypeScript, Vite, React Query, Tailwind
- Backend: Express, TypeScript, SQLite (`sqlite3` + `sqlite`), Zod validation
- Tests: Vitest, Testing Library, Supertest

## Local development

```sh
npm install
npm run dev
```

This starts:
- Frontend at `http://localhost:8080`
- Backend at `http://localhost:4000`

Vite proxies `/api` requests to the backend.

## Environment variables

Create a `.env` file in the repository root:

```env
PORT=4000
DB_PATH=server/data/traderhub.db
CLIENT_ORIGIN=http://localhost:8080
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is not set, the AI endpoint returns a safe fallback response.

## Scripts

- `npm run dev` - run client and server together
- `npm run dev:client` - run frontend only
- `npm run dev:server` - run backend only
- `npm run start:server` - start backend without watcher
- `npm run build` - frontend production build
- `npm run test` - run tests
- `npm run lint` - run ESLint

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/markets`
- `GET/POST/DELETE /api/portfolio/holdings`
- `GET /api/portfolio/summary`
- `GET/POST/DELETE /api/journal`
- `GET/POST /api/alerts`
- `PATCH /api/alerts/:id/dismiss`
- `DELETE /api/alerts/:id`
- `POST /api/ai/chat`
- `GET /api/health`

## Deployment artifacts

- `Dockerfile` for containerized app runtime
- `docker-compose.yml` for local orchestration
- GitHub Actions workflow in `.github/workflows/ci.yml`

## Notes

There are pre-existing lint findings in legacy UI files unrelated to this MVP; tests and build should still run.
