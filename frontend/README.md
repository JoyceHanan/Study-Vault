# Study Vault - Backend

Backend API for **Study Vault**, a collaborative learning platform where students can upload notes, share resources, discuss doubts, collaborate through a whiteboard, and communicate in real time.

---

## Features

- User Authentication (JWT + Google Login)
- Profile Management
- Resource Upload & Download
- Topic-wise Resource Organization
- Upvote / Downvote System
- Doubt Discussion Forum
- Real-time Chat
- Real-time Collaborative Whiteboard
- Bookmark Resources
- Notifications
- Report System
- Cloudinary File Upload
- Socket.IO Integration

---


backend
│
├── API
│   ├── userAPI.js
│   ├── resourceAPI.js
│   ├── doubtAPI.js
│   ├── chatAPI.js
│   ├── bookmarkAPI.js
│   ├── notificationAPI.js
│   ├── whiteboardAPI.js
│   └── reportAPI.js
│
├── models
│   ├── userModel.js
│   ├── resourceModel.js
│   ├── doubtModel.js
│   ├── chatModel.js
│   ├── bookmarkModel.js
│   ├── notificationModel.js
│   ├── reportModel.js
│   └── whiteboardModel.js
│
├── middleware
│   ├── verifyToken.js
│   └── multer.js
│
├── config
│   ├── cloudinary.js
│   └── uploadToCloudinary.js
│
├── socket
│   └── socket.js
│
├── .env
├── package.json
└── server.js

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- Google OAuth

### Real-Time Features
- Socket.IO

### File Upload
- Multer
- Cloudinary

### Security
- bcrypt
- cookie-parser
- CORS

---

## Installation

Clone repository:

```bash
git clone <repository-url>
cd backend