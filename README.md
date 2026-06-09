# Task Manager

![CI](https://github.com/matheuspina-dev/task-manager-fullstack/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/matheuspina-dev/task-manager-fullstack)

Fullstack task management app with user authentication. Users register, log in, and manage personal tasks with filtering by status and priority.

**Backend:** [task-manager-api.fly.dev](https://task-manager-api.fly.dev) (Fly.io)
**Frontend:** [task-manager-fullstack.vercel.app](https://task-manager-fullstack.vercel.app) (Vercel)

---

## Architecture

```
client (React + Vite)
  └── axios ──► server (Node.js + Express 5)
                  ├── passport-local (session auth)
                  ├── mongoose ──► MongoDB
                  └── routes: /api/v1/users, /api/v1/tasks
```

Auth flow: passport-local strategy with express-session. The client holds a session cookie; all task routes require an active session.

---

## Stack

| Layer    | Tech                                          |
|----------|-----------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router  |
| Backend  | Node.js 20, Express 5, Passport.js            |
| Database | MongoDB 7 via Mongoose                        |
| Auth     | Passport local + express-session + bcrypt     |
| Tests    | Jest 29, Supertest, mongodb-memory-server     |
| CI/CD    | GitHub Actions, Fly.io, Vercel                |

---

## Local dev (Docker)

Requires Docker and Docker Compose.

```bash
cp server/.env.example server/.env
# edit server/.env — set SESSION_SECRET at minimum
docker compose up
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## Local dev (manual)

### Prerequisites

- Node 20+
- MongoDB running locally or a MongoDB Atlas URI

### Server

```bash
cd server
cp .env.example .env
# fill in MONGO_URI and SESSION_SECRET
npm install
npm run start
```

### Client

```bash
cd client
npm install
npm run dev
```

---

## Environment variables

`server/.env.example` lists every variable. Required:

| Variable         | Description                             |
|------------------|-----------------------------------------|
| `MONGO_URI`      | MongoDB connection string               |
| `SESSION_SECRET` | Secret for express-session cookie       |
| `PORT`           | Port the server binds to (default 3000) |
| `CLIENT_ORIGIN`  | Frontend URL for CORS allow-list        |

---

## Tests

```bash
cd server
npm test            # run all tests
npm run test:coverage  # coverage report (threshold: 70% lines)
```

Tests use `mongodb-memory-server` — no external database required.

---

## Deploy

### Backend (Fly.io)

```bash
fly launch --config fly.toml
fly secrets set MONGO_URI="..." SESSION_SECRET="..."
fly deploy
```

### Frontend (Vercel)

Import the repo on [vercel.com](https://vercel.com). Set the root directory to `client`. Add the `VITE_API_URL` environment variable pointing to your Fly.io app URL.

---

## API routes

| Method | Path                    | Auth | Description         |
|--------|-------------------------|------|---------------------|
| POST   | /api/v1/users/register  | no   | Create account      |
| POST   | /api/v1/users/login     | no   | Log in              |
| GET    | /api/v1/tasks           | yes  | List user tasks     |
| POST   | /api/v1/tasks           | yes  | Create task         |
| GET    | /api/v1/tasks/:id       | yes  | Get task by id      |
| PATCH  | /api/v1/tasks/:id       | yes  | Update task         |
| DELETE | /api/v1/tasks/:id       | yes  | Delete task         |

---

## License

MIT
