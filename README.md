# Study Vault

Study Vault is a collaborative learning platform where students can upload and
share notes/resources, ask and answer doubts, bookmark useful material,
collaborate in real-time study rooms with chat and a shared whiteboard, and
track their progress from a personal dashboard.

The project is a monorepo with two apps:

```
Study-Vault/
├── frontend/   React 19 + Vite + Tailwind CSS (client)
└── backend/    Node.js + Express + MongoDB (API + Socket.IO)
```

For detailed setup instructions, see:

- [`frontend/README.md`](./frontend/README.md) — running the client, available routes
- [`backend/README.md`](./backend/README.md) — running the API, environment
  variables, route reference

---

## Features

- Email/password authentication (JWT access + refresh tokens, httpOnly cookies)
- Profile management (with avatar upload via Cloudinary)
- Upload, browse, search and download study resources
- Upvote / downvote and bookmark resources
- Doubts/discussion forum on each resource
- Real-time chat (Socket.IO)
- Real-time collaborative whiteboard
- Notifications
- Report system for inappropriate content
- Personal dashboard (uploads, bookmarks, downloads, points, badges)

---

## Tech Stack

**Frontend**
- React 19, React Router 7, Vite 8
- Tailwind CSS 4
- Zustand (state management)
- react-hook-form, react-hot-toast
- Socket.IO client

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (access + refresh tokens) via httpOnly cookies
- bcrypt (password hashing)
- Cloudinary + Multer (file uploads)
- Socket.IO (chat + whiteboard)

---

## Prerequisites

- **Node.js 22+** (required by Mongoose 9 / Firebase Admin / Vite 8)
- **MongoDB** running locally (or a MongoDB Atlas connection string)

---


See [`backend/README.md`](./backend/README.md) and
[`frontend/README.md`](./frontend/README.md) for what each variable means 


## Authentication Overview

Study Vault supports two sign-in methods, both of which result in the same
session: an httpOnly `token` (access token, ~1h) and `refreshToken` (~7 days)
cookie pair issued by the backend.

| Method | Flow |
| --- | --- |
| Email / Password | `Register` → `POST /user-api/register` → `Login` → `POST /user-api/login` |

---

## Project Structure

```
Study-Vault/
├── backend/
│   ├── API/              # Express routers (user, resource, doubt, chat, ...)
│   ├── config/           # Cloudinary 
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose schemas
│   ├── socket/            # Socket.IO handlers
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/    # Pages & UI components
    │   ├── store/         # Zustand auth store
    │   └── styles/        # Shared style tokens
    └── index.html
```

### Deployment link
  https://study-vault-eight-ruddy.vercel.app/
