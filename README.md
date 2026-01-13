# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace where clients can post gigs and freelancers can submit bids. Built with modern technologies and real-time features.

## Project Overview

GigFlow is a mini-freelance marketplace platform where:

- **Clients** can post jobs (Gigs) and review bids from freelancers
- **Freelancers** can browse available gigs and submit bids
- **Real-time notifications** when freelancers get hired
- **Transaction safety** ensures only one freelancer can be hired per gig

## Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI + Custom Components
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HttpOnly cookies
- **Real-time**: Socket.io
- **Security**: bcrypt, CORS, cookie-parser

---

## 📁 Project Structure

```
gigflow/
├── backend/                 # Node.js + Express backend
│   ├── controllers/         # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── sockets/            # Socket.io handlers
│   ├── utils/              # Helper functions
│   ├── seed.js            # Database seeding script
│   └── server.js          # Entry point
│
├── frontend/
│   ├── app/                # Next.js 13+ App Router
│   ├── components/         # Reusable components
│   ├── store/             # Redux store and slices
│   ├── lib/               # Utilities and API clients
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript types
│
└── README.md (this file)

```

---

## Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd gigflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

```

---

## Environment Setup

### Backend (.env)

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017
DB_NAME=gigflow
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080

```

---

## Database Seeding

Populate your database with sample data:

```bash
cd backend
node seed.js

```

**Test Credentials:**

- Email: `alice@example.com` | Password: `Password123`
- Email: `bob@example.com` | Password: `Password123`

---

## Running the Application

### Start MongoDB

```bash
mongod

```

### Start Backend

```bash
cd backend
node server.js

```

Backend runs on `http://localhost:8080`

### Start Frontend

```bash
cd frontend
npm run dev

```

Frontend runs on `http://localhost:3000`

---

## Testing

### Test User Credentials

All users have password: `Password123`

- alice@example.com
- bob@example.com
- charlie@example.com
- diana@example.com
- ethan@example.com

### Test Real-time Notifications

1.  Open two browser windows
2.  Login as different users
3.  User A: Post a gig
4.  User B: Submit a bid
5.  User A: Hire the freelancer
6.  User B receives instant notification! 🎉

---

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user

### Gig Endpoints

- `GET /api/gigs` - Get all gigs (with search)
- `GET /api/gigs/:id` - Get single gig
- `POST /api/gigs` - Create new gig
- `PATCH /api/gigs/:id` - Update gig
- `DELETE /api/gigs/:id` - Delete gig
- `GET /api/gigs/my-gigs` - Get user's gigs

### Bid Endpoints

- `POST /api/bids` - Create a bid
- `GET /api/bids/:gigId` - Get all bids for a gig (owner only)
- `GET /api/bids/my-bids` - Get user's bids
- `PATCH /api/bids/:bidId/hire` - Hire freelancer
- `DELETE /api/bids/:bidId` - Delete/withdraw bid

---

## Quick Start

1.  **Clone and Install**

```bash
git clone <repo-url>
cd gigflow
cd backend && npm install
cd ../frontend && npm install

```

2.  **Setup Environment**

```bash
# Backend .env
cp .env.example .env

# Frontend .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

```

3.  **Seed Database**

```bash
cd backend
node seed.js

```

4.  **Run Application**

```bash
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
cd frontend && npm run dev

```

5.  **Login**

- URL: http://localhost:3000
- Email: alice@example.com
- Password: Password123

---
