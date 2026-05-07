# HN Reader — MERN Stack App

A full-stack Hacker News scraper and reader built with MongoDB, Express, React, and Node.js.

## Live

Deploy: https://anilhn-app.vercel.app/

## Features

- **Web Scraper** — Scrapes top 10 stories from Hacker News on server start and via API
- **JWT Authentication** — Register/login with secure token-based auth
- **Story Feed** — Paginated list of stories sorted by points
- **Bookmarks** — Authenticated users can bookmark/unbookmark stories
- **Protected Routes** — Bookmarks page requires authentication

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Scraper | Axios + Cheerio |

## Project Structure

```
hn-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scraperController.js
│   │   └── storyController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Story.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── scraperRoutes.js
│   │   └── storyRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js / Navbar.css
    │   │   ├── StoryCard.js / StoryCard.css
    │   │   └── Pagination.js / Pagination.css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── BookmarksPage.js
    │   │   ├── StoryDetailPage.js
    │   │   └── Pages.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/aniljiA1/anilhn-app.git
cd hn-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://aniljiA1:anil12345@cluster0.za9amvj.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev    # development (with nodemon)
npm start      # production
```

The server will:
- Connect to MongoDB
- Automatically scrape Hacker News top 10 stories
- Start listening on port 5000

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5004/api

```

Start the frontend:

```bash
npm start
```

The app opens at `http://localhost:3004`

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user + bookmarks | Yes |

**Register body:**
```json
{ "username": "johndoe", "email": "john@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

### Stories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/stories` | Get all stories (paginated, sorted by points) | No |
| GET | `/api/stories?page=1&limit=10` | Paginated stories | No |
| GET | `/api/stories/:id` | Get a single story | No |
| POST | `/api/stories/:id/bookmark` | Toggle bookmark | Yes |

### Scraper

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/scrape` | Trigger a new scrape | No |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `JWT_EXPIRES_IN` | JWT expiration duration | `7d` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API base URL |

## Deployment

### Backend (Render)

Deploy: https://anilhn-app.onrender.com/api/health

### Frontend (Vercel)

Deploy: https://anilhn-app.vercel.app

### Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get the connection string
3. Set as `MONGODB_URI` in backend env vars


----

## Author
**Anil Kumar**


   
