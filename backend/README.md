# 🔧 GigFlow Backend

Node.js + Express backend for the GigFlow freelance marketplace platform.

## Overview

RESTful API built with Express.js, MongoDB, and Socket.io for real-time features. Includes JWT authentication, MongoDB transactions for data consistency, and comprehensive error handling.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Password Hashing**: bcrypt
- **Security**: CORS, cookie-parser, helmet

---

## Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── auth.controller.js    # Authentication handlers
│   ├── gigs.controller.js    # Gig management
│   └── bids.controller.js    # Bid management & hiring
│
├── models/               # MongoDB schemas
│   ├── user.model.js        # User schema
│   ├── gig.model.js         # Gig schema
│   └── bid.model.js         # Bid schema
│
├── routes/               # API routes
│   ├── auth.routes.js       # /api/auth/*
│   ├── gigs.routes.js       # /api/gigs/*
│   └── bids.routes.js       # /api/bids/*
│
├── middleware/           # Custom middleware
│   └── auth.middleware.js   # JWT verification
│
├── sockets/              # Socket.io handlers
│   └── socket.handlers.js   # Real-time events
│
├── utils/                # Utilities
│   ├── errorHandler.js      # Error handling
│   └── asyncHandler.js      # Async wrapper
│
├── seed.js              # Database seeding
├── server.js            # Entry point
├── package.json
└── .env.example

```

---

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env

```

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
DB_NAME=gigflow

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

```

---

## Running the Server

### Development Mode

```bash
npm run dev

```

### Production Mode

```bash
npm start

```

### Seed Database

```bash
node seed.js

```

---

## Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}

```

### Gig Model

```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  hiredFreelancerId: ObjectId (ref: User, optional),
  status: Enum ['open', 'assigned'],
  createdAt: Date,
  updatedAt: Date
}

```

### Bid Model

```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  proposedPrice: Number,
  status: Enum ['pending', 'hired', 'rejected'],
  createdAt: Date,
  updatedAt: Date
}

```

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

## Authentication

### JWT with HttpOnly Cookies

1.  User logs in with email/password
2.  Server generates JWT token
3.  Token stored in HttpOnly cookie (secure, no XSS)
4.  Token sent with each request
5.  Middleware verifies token

### Protected Routes

Use `protect` middleware:

```javascript
router.get("/profile", protect, getUserProfile);
```

---

## Real-time Features (Socket.io)

### Socket Events

#### Client → Server

- `register-user` - Register socket with userId
- `deregister-user` - Remove socket connection

#### Server → Client

- `bid-hired` - Notify freelancer when hired

  ```javascript
  {  message: "You have been hired for [Project Name]!",  gigId: "...",  gigTitle: "...",  bidId: "..."}

  ```

### Usage

```javascript
// Server emits to specific user
io.to(socketId).emit("bid-hired", payload);
```

---

## Advanced Features

### MongoDB Transactions (Race Condition Prevention)

The hiring logic uses MongoDB transactions to ensure atomicity:

```javascript
// Start transaction
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Update bid to 'hired'
  // 2. Reject all other bids
  // 3. Update gig status to 'assigned'

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

This prevents:

- Two freelancers being hired simultaneously
- Race conditions when multiple admins click "Hire"

---

## Testing

### Seed Database

```bash
node seed.js

```

Creates:

- 5 test users
- 10 gigs (mix of open/assigned)
- 25+ bids

### Test with curl

**Register User**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'

```

**Login**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password123"}' \
  -c cookies.txt

```

**Get Gigs**

```bash
curl http://localhost:8080/api/gigs

```

**Create Gig (Authenticated)**

```bash
curl -X POST http://localhost:8080/api/gigs \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Gig","description":"Description","budget":50000}'

```

---

## Development

### Install Dependencies

```bash
npm install

```

### Available Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node seed.js"
}
```

### Add nodemon for development

```bash
npm install --save-dev nodemon

```

---

## Error Handling

Centralized error handling with custom error class:

```javascript
// Usage in controllers
if (!gig) {
  return next(new ErrorResponse("Gig not found", 404));
}
```

All errors are caught and formatted consistently.

---

## Deployment

### Environment Variables (Production)

```env
PORT=8080
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=gigflow
JWT_SECRET=strong-random-secret-here
JWT_EXPIRE=7d
CLIENT_URL=https://yourdomain.com

```

### Recommended Platforms

- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **AWS EC2** - Full control
- **DigitalOcean** - Simple droplets

### MongoDB Atlas

Use MongoDB Atlas for production database:

1.  Create cluster at mongodb.com
2.  Get connection string
3.  Update MONGO_URI in .env

---

## Monitoring

### Logging

Add morgan for HTTP logging:

```bash
npm install morgan

```

```javascript
const morgan = require("morgan");
app.use(morgan("dev"));
```

### Health Check

```bash
curl http://localhost:8080/health

```

---

## Security Best Practices

✅ Passwords hashed with bcrypt  
✅ JWT stored in HttpOnly cookies  
✅ CORS configured  
✅ MongoDB injection prevention  
✅ Input validation  
✅ Rate limiting (recommended)  
✅ Helmet.js (recommended)

---
