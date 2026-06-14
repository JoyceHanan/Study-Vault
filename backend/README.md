# Study Vault — Backend

Backend API for **Study Vault**, a collaborative learning platform where
students can upload notes, share resources, discuss doubts, collaborate
through a whiteboard, and communicate in real time.

---

## Features

- User authentication — email/password (JWT + bcrypt) 
- Profile management
- Resource upload & download (Cloudinary)
- Topic-wise resource organization & search
- Upvote / downvote system
- Doubt discussion forum
- Real-time chat (Socket.IO)
- Real-time collaborative whiteboard
- Bookmark resources
- Notifications
- Report system
- Personal dashboard (uploads, bookmarks, downloads, points, badges)

---

## Tech Stack

| Category | Tech |
| --- | --- |
| Server | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | JWT (access + refresh cookies), bcrypt|
| Real-time | Socket.IO |
| File uploads | Multer, Cloudinary |
| Security | cookie-parser, CORS |

---

## Prerequisites

- **Node.js 22+**
- A running **MongoDB** instance (local or Atlas)

---

## Installation

```bash
cd backend
npm install
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DB_URL` | MongoDB connection string |
| `PORT` | Port the API listens on (default `5000`) |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH` | Secret used to sign refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (file uploads) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |


> Use long random strings for `JWT_SECRET` / `JWT_REFRESH` in production.


## Running the Server

```bash
npm start
```

This runs `node server.js`, which:

1. Loads environment variables (`dotenv`)
2. Connects to MongoDB
3. Starts the Express + Socket.IO HTTP server on `PORT` (default `5000`)

The server expects the frontend to run at `http://localhost:5173` (configured
in the CORS / Socket.IO setup in `server.js`).

---

## Project Structure

```
backend/
├── API/                 # Express routers, mounted in server.js
├── config/
│   ├── cloudinary.js     # Cloudinary client setup
│   ├── cloudinaryUpload.js
│   ├── firebaseAdmin.js  # Firebase Admin SDK (Google sign-in)
│   └── multer.js
├── middleware/
│   └── verifyToken.js    # JWT auth middleware (reads "token" cookie)
├── models/                # Mongoose schemas
├── socket/
│   └── socket.js          # Socket.IO chat/whiteboard handlers
└── server.js
```

---

## API Routes

All routes are mounted under their prefix in `server.js`.

### `/user-api` — Authentication & Profile

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create an account with email + password |
| POST | `/login` | Log in with email + password |
| GET | `/logout` | Clear auth cookies |
| GET | `/check-auth` | Check if the current session is valid |
| POST | `/refresh` | Refresh the access token using the refresh token cookie |
| GET | `/profile` | Get the logged-in user's profile (auth required) |
| PUT | `/update-profile` | Update name/photo/college/branch/semester (auth required) |
| PUT | `/password` | Change password |
| GET | `/dashboard` | Dashboard stats: uploads, bookmarks, downloads, points, badges (auth required) |
| GET | `/downloads` | List downloaded resources (auth required) |
| GET | `/saved-resources` | List bookmarked resources (auth required) |

### `/resource-api` — Resources

| Method | Route | Description |
| --- | --- | --- |
| POST | `/upload` | Upload a new resource |
| GET | `/` | List all resources |
| GET | `/search` | Search resources |
| GET | `/:id` | Get a single resource |
| PUT | `/:id` | Update a resource |
| DELETE | `/:id` | Delete a resource |
| POST | `/:id/upvote` | Upvote a resource |
| POST | `/:id/downvote` | Downvote a resource |
| GET | `/download/:id` | Download a resource |

### `/doubt-api` — Doubts / Discussion

| Method | Route | Description |
| --- | --- | --- |
| POST | `/create` | Post a new doubt |
| GET | `/` | List doubts |
| GET | `/resource/:resourceId` | List doubts for a resource |
| GET | `/:id` | Get a single doubt |
| POST | `/reply/:id` | Reply to a doubt |
| PUT | `/solve/:id` | Mark a doubt as solved |
| DELETE | `/:id` | Delete a doubt |

### `/bookmark-api` — Bookmarks

| Method | Route | Description |
| --- | --- | --- |
| POST | `/add` | Bookmark a resource |
| DELETE | `/remove/:resourceId` | Remove a bookmark |
| GET | `/` | List bookmarks |

### `/whiteboard-api` — Study Rooms / Whiteboard

| Method | Route | Description |
| --- | --- | --- |
| POST | `/create-room` | Create a study room |
| GET | `/rooms` | List study rooms |
| POST | `/request-join/:id` | Request to join a room |
| POST | `/accept/:id/:userId` | Accept a join request |
| POST | `/deny/:id/:userId` | Deny a join request |
| POST | `/leave/:id` | Leave a room |

### `/chat-api` — Chat

| Method | Route | Description |
| --- | --- | --- |
| POST | `/send` | Send a message |
| GET | `/:roomId` | Get messages for a room |
| PUT | `/:messageId` | Edit a message |
| DELETE | `/:messageId` | Delete a message |

### `/notification-api` — Notifications

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | List notifications |
| PUT | `/mark-read/:id` | Mark a notification as read |
| POST | `/room-share` | Notify users of a room invite |

### `/report-api` — Reports

| Method | Route | Description |
| --- | --- | --- |
| POST | `/create` | Submit a report |
| GET | `/` | List reports |

---

## Authentication Notes

- Successful login/register sets two httpOnly cookies:
  `token` (short-lived access token) and `refreshToken` (long-lived).
- `verifyToken` middleware reads the `token` cookie and attaches the decoded
  payload to `req.user`.
- `/user-api/refresh` issues a new access token using the refresh token
  cookie — the frontend's `authStore.checkAuth()` calls this automatically if
  the access token has expired.
- Google sign-in users (`googleAuth: true`) get a random, never-used password
  hash so the schema's `password` requirement is satisfied — they can only
  log in via `/google-login`.
