# 🎨 Render Backend Deployment - Complete Guide

## 📌 Prerequisites
- ✅ GitHub account with SimuPay pushed
- ✅ MongoDB Atlas URI: `mongodb+srv://siddhantjagtap767_db_user:simupay12345@cluster0.7je9cqo.mongodb.net/simupay?retryWrites=true&w=majority&appName=Cluster0`
- ✅ JWT Secret: `myverysecretkey`
- ✅ Free Render account

---

## 🎯 Why Render?

| Feature | Railway | Render |
|---------|---------|--------|
| Free Tier | $5/month credits (limited) | ✅ **Completely FREE** |
| Node.js Support | ✅ Yes | ✅ Yes |
| GitHub Integration | ✅ Yes | ✅ Yes |
| Sleep on Inactivity | ✅ Yes | ✅ Yes |
| Build Time | Fast | Fast |

**Render is 100% free for testing and small projects!** 🎉

---

## 🚀 Step 1: Sign Up to Render

1. **Open** → https://render.com
2. Click **"Sign Up"**
3. Choose **"Sign Up with GitHub"** (easiest)
4. **Authorize** Render to access your GitHub account
5. Complete your profile if prompted
6. You'll land on the **Render Dashboard**

---

## 📦 Step 2: Create New Web Service from GitHub

### In Render Dashboard:

1. Click **"New+"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect Repository"** or **"Public Git Repository"**
4. Search for: `SimuPay` or your repository name
5. **Select** your simupay repository
6. Click **"Connect"**

---

## ⚙️ Step 3: Configure Deployment Settings

After connecting the repository, you'll see the configuration form:

### Basic Settings:

| Setting | Value |
|---------|-------|
| **Name** | `simupay-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |

### Important:
- **Root Directory**: Leave empty (Render uses repo root)
- **Plan**: Select **"Free"** ✅

### Visual Walkthrough:
```
┌─ Name: simupay-backend
├─ Environment: Node
├─ Region: Oregon
├─ Branch: main
├─ Build Command: cd backend && npm install
├─ Start Command: cd backend && npm start
└─ Plan: Free (selected)
```

---

## 🔐 Step 4: Add Environment Variables

This is **CRITICAL**! Your backend needs these variables.

### Where to Add:

1. In the configuration form, scroll down to **"Environment"** section
2. Look for **"Environment Variables"** or **"Add Environment Variable"**

### Add These Variables:

```
Key: MONGO_URI
Value: mongodb+srv://siddhantjagtap767_db_user:simupay12345@cluster0.7je9cqo.mongodb.net/simupay?retryWrites=true&w=majority&appName=Cluster0
```

```
Key: JWT_SECRET
Value: myverysecretkey
```

```
Key: NODE_ENV
Value: production
```

### How to Add Each:
1. Click **"Add Environment Variable"** button
2. Enter **Key** (e.g., `MONGO_URI`)
3. Enter **Value** (the corresponding value from above)
4. Press **Enter** or click ✅
5. Repeat for all 3 variables

**You should see all 3 variables listed before deploying!**

---

## 🚀 Step 5: Deploy Your Backend

1. **Scroll to bottom** of configuration form
2. Click **"Create Web Service"** button
3. Render starts building your backend!
4. **Watch the build logs** (they scroll in real-time)
5. **Wait 5-10 minutes** for deployment to complete

### What Success Looks Like:
```
✓ Installing dependencies
✓ Building application
✓ Starting server on port 3000
✓ MongoDB connected
✓ Service is live!
```

---

## 🎉 Step 6: Get Your Backend URL

Once deployed successfully:

1. You'll see your **Service URL** at the top of the page
2. It looks like: `https://simupay-backend-xxxxx.onrender.com`
3. **This is your backend URL!** Copy it.

### Where to Find It:
- Top of your service page
- Blue link
- Click to copy button

---

## ✅ Step 7: Test Your Backend

### Test the Backend is Working:

1. **Open a new browser tab**
2. Visit: `https://your-render-url.onrender.com/api/auth/user`
3. **Expected Response:**
   ```json
   {"error":"No token provided"}
   ```
   ✅ This means backend is working!

### If You Get an Error:
- ❌ `Cannot GET /api/auth/user` → Backend isn't responding
- ❌ `MongoDB connection error` → Check MONGO_URI variable
- ❌ `Service Unavailable` → Build failed, check logs

---

## 🔍 Troubleshooting

### Problem: Build Fails
**Error in Build Logs:**
```
Cannot find module 'express'
```

**Solution:**
1. Check `backend/package.json` exists with all dependencies
2. Verify **Build Command**: `cd backend && npm install`
3. Click **"Manual Deploy"** to retry

---

### Problem: MongoDB Connection Error
**Error in Logs:**
```
MongoServerSelectionError: connect ENOTFOUND
```

**Solutions:**
1. Verify `MONGO_URI` is exactly correct (copy-paste carefully)
2. Check MongoDB Atlas cluster is **Active** (not paused)
3. In MongoDB Atlas Dashboard:
   - Go to **Network Access**
   - Add IP: `0.0.0.0/0` (allows all IPs)
   - This is safe for testing

---

### Problem: Service Keeps Restarting
**Error:**
```
Service restarted unexpectedly
```

**Solution:**
1. Check logs for actual error messages
2. Verify all environment variables are set
3. Look for missing dependencies in `package.json`
4. Try manual restart: **"Manual Deploy"** button

---

### Problem: Slow Startup Time
**Issue:** First request takes 30+ seconds

**Normal on free tier!** Render puts free services to sleep after inactivity.
- First request wakes it up (cold start)
- Subsequent requests are fast
- ✅ This is expected behavior

---

## 🔄 Auto-Deploy from GitHub

**Render automatically redeploys when you push to GitHub!**

When you push changes:
```bash
git add .
git commit -m "Update backend code"
git push origin main
```

Render detects the push and automatically rebuilds within 1-2 minutes.

### To Check Deployment Status:
1. Go to your service in Render
2. Look for **"Deploys"** tab
3. See status of all deployments
4. Click on deployment to see logs

---

## 📊 Monitoring & Logs

### View Live Logs:
1. In your service page
2. Scroll to **"Logs"** section
3. See real-time output

### Common Healthy Logs:
```
Server running on port 3000
MongoDB connected
GET /api/auth/user - 200
```

### Enable Email Alerts (Optional):
1. Service Settings → **Notifications**
2. Enable alerts for deployment failures
3. Get emails when something goes wrong

---

## 💾 Save Your Backend URL

Once you have your Render backend URL, **SAVE IT**:

```
My Render Backend URL: ___________________________________
```

**You'll need this for frontend deployment!**

---

## ⚡ Free Tier Limits

| Limit | Value |
|-------|-------|
| **Monthly Hours** | 750 hours (enough for one service) |
| **Build Minutes** | Unlimited |
| **Memory** | 512 MB shared |
| **Sleep** | Auto-sleep after 15 minutes of inactivity |

---

## 🎯 Next Steps

1. ✅ Backend deployed on Render
2. ✅ Backend URL copied
3. → Update `frontend/.env.production` with backend URL
4. → Deploy frontend to Vercel

---

## 📚 Render Resources

- **Render Dashboard**: https://dashboard.render.com
- **Render Documentation**: https://render.com/docs
- **Environment Variables**: https://render.com/docs/environment-variables
- **Free Tier Info**: https://render.com/pricing

---

## ✨ Quick Checklist

- [ ] Signed up to Render with GitHub
- [ ] Created new Web Service from SimuPay repository
- [ ] Configured build and start commands correctly
- [ ] Added 3 environment variables (MONGO_URI, JWT_SECRET, NODE_ENV)
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment to complete (5-10 minutes)
- [ ] Tested backend URL in browser
- [ ] Saved backend URL for next step
- [ ] Verified MongoDB Atlas allows connections

---

**Your backend is now live and completely FREE! 🎉**

Once you have your Render URL, let me know and we'll deploy the frontend to Vercel!
