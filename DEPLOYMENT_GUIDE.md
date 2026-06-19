# 🚀 Deployment Guide for SimuPay

## Prerequisites
- ✅ MongoDB Atlas account (you have this)
- ✅ GitHub account
- ✅ Railway account (free - create at railway.app)
- ✅ Vercel account (free - create at vercel.com)

---

## 📝 Step 1: Prepare Your Code (Local)

### 1.1 Update Backend CORS Settings
Your backend already has CORS enabled. Verify in `backend/server.js`:
```javascript
app.use(cors());
```

### 1.2 Create `.env.production` for Frontend
Already created at `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```
*(You'll update the URL after deploying the backend)*

---

## 🌐 Step 2: Deploy Backend to Railway

### 2.1 Push Code to GitHub
```bash
cd SimuPay
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SimuPay.git
git push -u origin main
```

### 2.2 Deploy to Railway
1. Go to **railway.app** → Sign up/Log in
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Connect your GitHub account and select `SimuPay` repository
4. Railway will auto-detect Node.js project
5. Configure Environment Variables:
   - Go to **Variables** tab
   - Add:
     ```
     MONGO_URI=mongodb+srv://siddhantjagtap767_db_user:simupay12345@cluster0.7je9cqo.mongodb.net/simupay?retryWrites=true&w=majority&appName=Cluster0
     JWT_SECRET=myverysecretkey
     PORT=5000
     NODE_ENV=production
     ```

### 2.3 Deploy Backend
- Click **"Deploy"**
- Wait for build completion (2-3 minutes)
- Your backend URL will be like: `https://simupay-production-xxxx.railway.app`
- **Copy this URL** - you'll need it for frontend

✅ **Backend is live!**

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API URL
1. Open `frontend/.env.production`
2. Replace the URL:
   ```env
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```

### 3.2 Push Updated Code to GitHub
```bash
git add frontend/.env.production
git commit -m "Update backend API URL for production"
git push origin main
```

### 3.3 Deploy Frontend to Vercel
1. Go to **vercel.com** → Sign up/Log in
2. Click **"Add New..."** → **"Project"**
3. Select your `SimuPay` GitHub repository
4. Configure:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Environment Variables** (optional):
     ```
     REACT_APP_API_URL=https://your-railway-backend-url.railway.app
     ```
5. Click **"Deploy"**
6. Wait for build completion (1-2 minutes)
7. Your frontend URL: `https://simupay-xxxx.vercel.app`

✅ **Frontend is live!**

---

## ✨ Step 4: Test Your Deployment

1. Visit: `https://your-simupay-frontend.vercel.app`
2. Try to **Register** a new user
3. **Login** with your credentials
4. Test **Payment Simulation**
5. Check **Transaction History**

---

## 🔒 Important Security Notes

⚠️ **Before Production:**
1. **Change JWT_SECRET** to a strong random key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Then update in Railway Variables

2. **Rotate MongoDB Password** on Atlas (optional but recommended)

3. **Add your domain** to MongoDB Atlas IP Whitelist:
   - Go to Atlas → Network Access
   - Allow IP `0.0.0.0/0` (or your Vercel IPs for better security)

---

## 🐛 Troubleshooting

### Frontend shows "Failed to fetch"
- Verify `REACT_APP_API_URL` is correct in Vercel environment variables
- Check Railway backend is running (check logs in Railway dashboard)
- Ensure CORS is enabled in backend

### MongoDB connection error
- Verify `MONGO_URI` is correct in Railway variables
- Check MongoDB Atlas cluster is active
- Ensure IP whitelist allows connections

### Build fails on Vercel
- Clear cache: Vercel dashboard → Settings → Git → Redeploy
- Check `frontend/package.json` has all dependencies

---

## 📊 Free Tier Limits

| Service | Free Limit | Notes |
|---------|-----------|-------|
| **Railway** | $5/month credits | Enough for small projects |
| **Vercel** | Unlimited deploys | Generous free tier |
| **MongoDB Atlas** | 512 MB storage | Good for testing |

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- MERN Deployment: https://mern-stack.com

---

## 🎉 You're Done!

Your SimuPay app is now live on the internet! Share your Vercel URL with friends. 🚀

