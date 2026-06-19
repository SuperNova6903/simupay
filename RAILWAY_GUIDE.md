# 🚂 Railway Backend Deployment - Step-by-Step Guide

## 📌 Prerequisites

- ✅ GitHub account with SimuPay pushed (you just did this!)
- ✅ MongoDB Atlas URI ready: `mongodb+srv://siddhantjagtap767_db_user:simupay12345@cluster0.7je9cqo.mongodb.net/simupay?retryWrites=true&w=majority&appName=Cluster0`
- ✅ A JWT secret key (we'll use: `myverysecretkey`)

---

## 🎯 Step 1: Sign Up / Log In to Railway

1. **Open** → https://railway.app
2. Click **"Sign Up"** (or log in if you have an account)
3. Click **"Continue with GitHub"** (easiest option)
4. **Authorize** Railway to access your GitHub account
5. You'll land on your Railway dashboard

---

## 📦 Step 2: Create New Railway Project from GitHub

1. In Railway dashboard, click **"New Project"** (top right)
2. Select **"Deploy from GitHub Repo"**
3. Click **"Configure GitHub App"** if you haven't connected yet
4. **Search** for your repository: `simupay` or `SimuPay`
5. **Select** the repository
6. Railway auto-detects it's a Node.js project ✨

---

## ⚙️ Step 3: Configure Deployment Settings

After selecting the repo, you'll see **Deployment Configuration**:

### Option A: Auto-Deploy (Recommended)

- Railway will automatically deploy when you push to `main`
- Keep **"Automatically deploy on new commits"** checked

### Option B: Manual Deploy

- You manually trigger deploys in Railway dashboard

**Choose Option A for now** (auto-deploy is easier)

---

## 🔐 Step 4: Add Environment Variables

This is CRITICAL! Your backend needs these variables to connect to MongoDB.

### Where to Add Variables:

1. After clicking Deploy, you'll see your **Project Dashboard**
2. Look for your **backend service** (it will appear as a card)
3. Click on the backend service card
4. Go to **"Variables"** tab at the top

### Variables to Add:

Copy each line exactly:

```
MONGO_URI=mongodb+srv://siddhantjagtap767_db_user:simupay12345@cluster0.7je9cqo.mongodb.net/simupay?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=myverysecretkey

PORT=5000

NODE_ENV=production
```

### How to Add Each Variable:

1. Click **"Add Variable"** button
2. **Key**: `MONGO_URI`
3. **Value**: Paste the MongoDB URI (the long string above)
4. Click ✅ to save
5. Repeat for `JWT_SECRET`, `PORT`, `NODE_ENV`

✅ **After all 4 variables are added, you'll see them listed**

---

## 🚀 Step 5: Deploy!

### Method 1: Auto Deploy (Simplest)

1. Variables saved? ✅
2. Railway automatically triggers a build
3. Watch the **Build Logs** (you'll see them scroll by)
4. **Wait 3-5 minutes** for deployment to complete

### Method 2: Manual Deploy

1. If auto-deploy isn't active, click **"Deploy"** button
2. Confirm deployment

### What to See:

```
✓ Installing dependencies
✓ Building application
✓ Starting server on port 5000
✓ MongoDB connected
```

---

## 🎉 Step 6: Get Your Backend URL

Once deployed successfully:

1. In the backend service card, look for **"URL"** section
2. It will look like: `https://simupay-production-xxxx.railway.app`
3. **Copy this URL** - you'll need it for the frontend!

### Where to Find It:

- Backend service card → Top section
- Usually highlighted in blue
- Click icon to copy to clipboard

---

## ✅ Step 7: Test Your Backend

### Test the Backend is Running:

1. **Open a new browser tab**
2. Visit: `https://your-backend-url.railway.app/api/auth/user`
3. You should see an error like: `{"error":"No token provided"}`
   - ✅ This means the backend is working!
   - ❌ If you get "Cannot GET", backend isn't responding

### Quick Test Commands (Optional):

```bash
# Replace with your actual Railway URL
curl https://your-backend-url.railway.app/api/auth/user

# Should return: {"error":"No token provided"}
```

---

## 🔍 Troubleshooting

### Problem: Build Fails

**Error in Build Logs:**

```
Cannot find module 'express'
```

**Solution:**

- Check `backend/package.json` has all dependencies
- Most likely: dependencies weren't installed
- Go to Railway → backend service → **Rebuild** button

---

### Problem: MongoDB Connection Error

**Error in Logs:**

```
MongoDB connection error: MongoServerSelectionError
```

**Solutions:**

1. Verify `MONGO_URI` is exactly correct (no extra spaces)
2. Check MongoDB Atlas cluster is **Active** (not paused)
3. In MongoDB Atlas:
   - Go to **Network Access**
   - Add IP: `0.0.0.0/0` (allows all IPs)
   - This is safe for testing

---

### Problem: Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

- Railway handles this - just redeploy
- Or change PORT in variables to 5001

---

### Problem: Deploy Stuck / Shows "Waiting"

**Solution:**

1. Wait 10 minutes for initial build
2. If still stuck, click **"View Logs"**
3. Look for errors in the logs
4. If no errors after 15 mins, restart:
   - Backend card → **Settings** → **Restart**

---

## 📊 Monitoring Your Deployment

### View Live Logs:

1. Backend service card
2. Click **"View Logs"** button
3. See real-time output from your server

### Common Healthy Logs:

```
Server running on port 5000
MongoDB connected
Request from client: POST /api/auth/register
```

---

## 💾 Save This URL!

Once you have your Railway backend URL, **save it somewhere**:

```
My Backend URL: ___________________________________
```

**You'll need this for the frontend deployment** in the next step!

---

## ✨ Next Steps (After Backend is Live)

1. ✅ Backend is deployed on Railway
2. 🔄 Copy your backend URL from Railway
3. → Update `frontend/.env.production` with the URL
4. → Deploy frontend to Vercel (next step)

---

## 📚 Railway Useful Links

- Dashboard: https://railway.app/dashboard
- Documentation: https://docs.railway.app
- GitHub Integration: https://docs.railway.app/guides/github-integration

---

## 🎯 Quick Checklist

- [ ] Logged into Railway with GitHub
- [ ] Created new project from SimuPay GitHub repo
- [ ] Added 4 environment variables (MONGO_URI, JWT_SECRET, PORT, NODE_ENV)
- [ ] Deployment completed successfully
- [ ] Backend URL is copied (https://...)
- [ ] Tested backend URL in browser (got "No token" error = success!)
- [ ] Saved backend URL for next step

---

**You're doing great! 🚀 The hard part is done. Your backend is live!**

Once your backend is working, let me know and we'll deploy the frontend to Vercel.
