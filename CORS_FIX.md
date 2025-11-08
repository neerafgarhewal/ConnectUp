# 🔧 CORS Error Fix - Action Required

## Current Issue
```
Access to XMLHttpRequest at 'https://connectup-backend.onrender.com/api/v1/students/login' 
from origin 'https://connectup-frontend.onrender.com' has been blocked by CORS policy
```

## Root Cause
The backend's CORS configuration doesn't allow requests from your frontend domain.

## ✅ Fix Steps

### Step 1: Update Backend CORS
1. Go to Render Dashboard
2. Click on **connectup-backend-4w1g** service
3. Go to **Environment** tab
4. Find or add `FRONTEND_URL` variable
5. Set value to: `https://connectup-frontend.onrender.com`
6. Click **Save Changes** (backend will restart automatically)

### Step 2: Verify Frontend API URL
1. Go to **connectup-frontend** service
2. Go to **Environment** tab
3. Verify `VITE_API_URL` is set to: `https://connectup-backend-4w1g.onrender.com/api/v1`
4. If not, update it and click **Save Changes**

### Step 3: Wait for Services to Restart
- Backend restart: ~30 seconds
- Frontend rebuild (if changed): ~2 minutes

### Step 4: Test
1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to: https://connectup-frontend.onrender.com/login
3. Try logging in
4. Should work! ✅

## Additional Issues Fixed

### Missing Images
- Created `/frontend/public/images/` directory
- Add `hero-dashboard.png` to this folder for the landing page
- Or replace the image reference in `HeroSection.tsx`

## How CORS Works

```
Frontend (connectup-frontend.onrender.com)
    ↓ Makes request to
Backend (connectup-backend-4w1g.onrender.com)
    ↓ Checks CORS
Is frontend URL in FRONTEND_URL env var?
    ✅ Yes → Allow request
    ❌ No → Block with CORS error
```

## Verification Checklist

- [ ] Backend `FRONTEND_URL` = `https://connectup-frontend.onrender.com`
- [ ] Frontend `VITE_API_URL` = `https://connectup-backend-4w1g.onrender.com/api/v1`
- [ ] Backend service restarted
- [ ] Frontend service rebuilt (if env var changed)
- [ ] Browser cache cleared
- [ ] Login works without CORS error

## If Still Not Working

Check backend logs:
1. Render Dashboard → connectup-backend-4w1g → Logs
2. Look for CORS-related messages
3. Verify the backend is actually running and connected to MongoDB

Check frontend console:
1. F12 → Console tab
2. Should see successful API requests (200 status)
3. No more CORS errors
