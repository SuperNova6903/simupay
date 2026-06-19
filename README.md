# SimuPay - Payment Simulation Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for simulating payment transactions. SimuPay allows users to register, login, and simulate payment transactions with virtual money.

## Features

- User authentication (Register/Login with JWT)
- Payment simulation
- Transaction history
- Dashboard with balance tracking

## Tech Stack

- **Frontend**: React 18, React Router DOM, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
simupay/
├── backend/              # Express.js backend API
│   ├── middleware/      # Auth & validation middleware
│   ├── models/           # Mongoose models (User, Transaction)
│   ├── routes/          # API routes (auth, simulate, transaction)
│   ├── utils/            # Utility functions
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── App.js       # Main App component
│   │   └── App.css      # Global styles
│   └── package.json     # Frontend dependencies
├── package.json         # Root package.json
└── .gitignore           # Git ignore file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Create `.env` file in backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Start backend server:
   ```bash
   cd backend
   npm start
   ```

6. Start frontend (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

The frontend will open at `http://localhost:3000` and the backend runs at `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction

### Simulation
- `POST /api/simulate/payment` - Simulate payment

## Deployment

### 🚀 Deploy for FREE (Complete Guides Included!)

We provide complete step-by-step deployment guides:

#### **Backend: Render.com (FREE)**
- See: `RENDER_DEPLOYMENT_GUIDE.md`
- ✅ Completely free tier
- ✅ GitHub auto-deploy
- ✅ Perfect for Node.js apps
- ✅ No credit card required (for free tier)

#### **Frontend: Vercel.com (FREE)**
- See: `VERCEL_FRONTEND_GUIDE.md`
- ✅ Unlimited free deployments
- ✅ Global CDN included
- ✅ GitHub auto-deploy
- ✅ Blazing fast React hosting

#### **Database: MongoDB Atlas (FREE)**
- ✅ 512 MB storage
- ✅ Fully managed
- ✅ Perfect for prototyping

### Quick Start Deployment

```bash
# 1. Push code to GitHub (if not done)
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy Backend to Render
# → Follow: RENDER_DEPLOYMENT_GUIDE.md

# 3. Deploy Frontend to Vercel
# → Follow: VERCEL_FRONTEND_GUIDE.md
```

### Deployment Options

| Platform | Service | Cost | Guide |
|----------|---------|------|-------|
| **Render** | Backend (Node.js) | FREE ✅ | `RENDER_DEPLOYMENT_GUIDE.md` |
| **Vercel** | Frontend (React) | FREE ✅ | `VERCEL_FRONTEND_GUIDE.md` |
| **MongoDB Atlas** | Database | FREE ✅ | Included in guides |

**Total Cost: $0** - Your app is live on the internet!

### Alternative Options
- Backend: Heroku (paid), Railway (paid), Fly.io
- Frontend: Netlify, AWS Amplify


## Author

Siddhant Jagtap
