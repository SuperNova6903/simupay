# 🚀 Quick Deployment Checklist

## Pre-Deployment Checklist

- [ ] You have a GitHub account
- [ ] You have a Railway account (free at railway.app)
- [ ] You have a Vercel account (free at vercel.com)
- [ ] MongoDB Atlas is set up with your connection string
- [ ] You have the MongoDB URI and JWT_SECRET ready

## Step-by-Step Commands

### 1. Initialize Git & Push to GitHub

```bash
cd /Users/siddhantjagtap/Desktop/proj/SimuPay/SimuPay

# Initialize git (if not already initialized)
git init
git add .
git commit -m "Initial commit - SimuPay deployment ready"
git branch -M main

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/SimuPay.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy Backend to Railway

1. Visit: https://railway.app
2. Sign up / Log in
3. Click "New Project" → "Deploy from GitHub Repo"
4. Select your SimuPay repository
5. Railway auto-configures for Node.js
6. Add these variables in Railway dashboard → Variables:
   ```
   MONGO_URI=mongodb+srv://siddhantjagtap767_db_user:simupay12345@cluster0.7je9cqo.mongodb.net/simupay?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=myverysecretkey
   PORT=5000
   NODE_ENV=production
   ```
7. Click "Deploy"
8. **Copy your Railway Backend URL** (looks like: `https://simupay-prod-xxxx.railway.app`)

### 3. Update Frontend with Backend URL

```bash
# Edit this file
# frontend/.env.production

# Replace the URL with your Railway backend URL:
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```

Then push the changes:
```bash
git add frontend/.env.production
git commit -m "Add production backend URL"
git push origin main
```

### 4. Deploy Frontend to Vercel

1. Visit: https://vercel.com
2. Sign up / Log in with GitHub
3. Click "Add New" → "Project"
4. Select your SimuPay repository
5. Configure:
   - **Framework Preset**: React
   - **Root Directory**: `frontend`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app
   ```
7. Click "Deploy"
8. **Your app is live!** 🎉

## After Deployment

- Visit your Vercel URL (https://your-app.vercel.app)
- Create an account to test
- Simulate payments
- Check transaction history

## Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- Your Backend: (will show in Railway dashboard)
- Your Frontend: (will show in Vercel dashboard)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API calls fail | Verify REACT_APP_API_URL matches your Railway backend |
| MongoDB connection error | Check MONGO_URI in Railway variables |
| Build fails on Vercel | Clear Vercel cache and redeploy |

---

For detailed instructions, see: `DEPLOYMENT_GUIDE.md`
