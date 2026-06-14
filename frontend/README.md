# Study Vault — Frontend

The React client for **Study Vault**, a collaborative learning platform where
students browse/upload resources, ask doubts, bookmark material, and
collaborate in real-time study rooms with chat and a shared whiteboard.

---

## Tech Stack

- **React 19** + **React Router 7**
- **Vite 8** (dev server / build)
- **Tailwind CSS 4**
- **Zustand** — global auth/app state (`src/store/authStore.js`)
- **react-hook-form** — form handling & validation
- **react-hot-toast** — toast notifications
- **Axios** — API requests (cookie-based auth)
- **Socket.IO client** — chat & whiteboard

---

## Prerequisites

- **Node.js 22+**
- The [backend](../backend/README.md) running at `http://localhost:5000`
- A **Firebase project** with the **Google** sign-in provider enabled (for
  "Continue with Google")

---

## Installation

```bash
cd frontend
npm install
```

---



## Running the App

```bash
npm run dev
```

Opens the app at **http://localhost:5173**. Make sure the backend is also
running (`cd ../backend && npm start`) — the frontend's `authStore.js` sends
all API requests to `http://localhost:5000` with `withCredentials: true`.

Other scripts:

```bash
npm run build     # production build (dist/)
npm run preview   # preview the production build
npm run lint      # run ESLint
```

---

## Routes / Pages

| Path | Component | Description |
| --- | --- | --- |
| `/` | `Home` | Landing page |
| `/login` | `Login` | Email/password sign-in|
| `/register` | `Register` | Create an account|
| `/dashboard` | `Dashboard` | Personal stats: uploads, bookmarks, downloads, points |
| `/profile` | `Profile` | View/edit profile, change password, upload avatar |
| `/resources` | `Resources` | Browse & search resources |
| `/resources/:id` | `ResourceDetails` | Resource detail, doubts, upvote/downvote |
| `/upload-resource` | `UploadResource` | Upload a new resource |
| `/whiteboards` | `WhiteboardRooms` | List/create study rooms |
| `/whiteboard/:id` | `Whiteboard` | Collaborative whiteboard |
| `/chat/:roomId` | `ChatRoom` | Real-time chat for a study room |

---

## Authentication Flow

`src/store/authStore.js` (Zustand) holds `currentUser`, `isAuthenticated`,
`loading` and `error`, and exposes:

- `login(credentials)` — `POST /user-api/login`
- `register(userData)` — `POST /user-api/register`
- `logout()`, `checkAuth()`, `refreshToken()`, `getProfile()`,
  `updateProfile()`, `getDashboard()`



`RootLayout.jsx` calls `checkAuth()` once on mount to restore a session from
cookies (and silently refreshes the access token if it has expired).

---

## Toast Notifications

`react-hot-toast` is mounted once in `App.jsx`:

```jsx
<Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  containerStyle={{ zIndex: 99999 }}
  toastOptions={{ duration: 3000, ... }}
/>
```

Use it anywhere with:

```js
import { toast } from "react-hot-toast";

toast.success("Saved!");
toast.error("Something went wrong");
```

> `<Toaster />` must stay mounted near the root (it already is, in `App.jsx`)
> — don't add a second `<Toaster />` inside individual pages, or notifications
> may not appear consistently.

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatRoom.jsx        # Real-time chat for a study room
│   │   ├── Dashboard.jsx       # User dashboard (stats, uploads, bookmarks)
│   │   ├── Footer.jsx          # Site footer
│   │   ├── Header.jsx          # Navbar / site header
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Sign in
│   │   ├── Profile.jsx         # User profile & settings
│   │   ├── Register.jsx        # Sign up 
│   │   ├── ResourceDetails.jsx # Single resource view + doubts
│   │   ├── Resources.jsx       # Browse/search resources
│   │   ├── RootLayout.jsx      # App shell (Header + Outlet + Footer)
│   │   ├── UploadResource.jsx  # Upload a new resource
│   │   ├── Whiteboard.jsx      # Collaborative whiteboard
│   │   └── WhiteboardRooms.jsx # List/create study rooms
│   ├── store/
│   │   └── authStore.js   # Zustand auth store (login/register/logout/...)
│   ├── styles/
│   │   └── common.js      # Shared Tailwind style tokens
│   ├── App.jsx             # Routes + <Toaster />
│   └── main.jsx
└── index.html
```
