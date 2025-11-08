# MongoDB Connection Issue - Solution Guide

## Current Problem
The application cannot connect to MongoDB Atlas. The error you're seeing:
```
Operation `students.insertOne()` buffering timed out after 10000ms
```

This means the backend server is running, but it cannot establish a connection to the MongoDB Atlas database.

## Why This Happens
1. **Network/Firewall Issues**: Your network may be blocking MongoDB Atlas connections
2. **IP Whitelist**: Your current IP address is not whitelisted in MongoDB Atlas
3. **Cluster Paused**: The MongoDB Atlas cluster might be paused or inactive
4. **VPN/Proxy**: VPN or proxy settings might be interfering

## Solution Options

### Option 1: Fix MongoDB Atlas Connection (Recommended for Production)

#### Step 1: Check MongoDB Atlas Cluster Status
1. Go to https://cloud.mongodb.com/
2. Login with your credentials
3. Navigate to your cluster (Cluster0)
4. Check if the cluster is **Active** (not paused)

#### Step 2: Whitelist Your IP Address
1. In MongoDB Atlas, go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Choose one of:
   - **Add Current IP Address** (for your specific IP)
   - **Allow Access from Anywhere** (0.0.0.0/0) - **Only for development!**
4. Click **Confirm**
5. Wait 1-2 minutes for changes to propagate

#### Step 3: Verify Connection String
Your current connection string in `.env`:
```
mongodb+srv://admin:vedansH%2B00%23@cluster0.rdhurcy.mongodb.net/connectup?retryWrites=true&w=majority&appName=Cluster0
```

Make sure:
- Username: `admin`
- Password: `vedansH+00#` (URL encoded as `vedansH%2B00%23`)
- Cluster: `cluster0.rdhurcy.mongodb.net`

#### Step 4: Test Connection
After whitelisting your IP, restart the backend server:
```bash
cd c:\Projects\Final\ConnectUp\backend
npm run dev
```

Look for: `✅ Connected to MongoDB successfully!`

### Option 2: Install Local MongoDB (For Development)

If you can't access MongoDB Atlas, install MongoDB locally:

#### Step 1: Install MongoDB Community Edition
1. Download from: https://www.mongodb.com/try/download/community
2. Choose Windows version
3. Run the installer
4. Choose "Complete" installation
5. Install MongoDB as a Windows Service

#### Step 2: Verify Installation
```bash
mongod --version
```

#### Step 3: Update .env File
Change the MONGODB_URI in `c:\Projects\Final\ConnectUp\backend\.env`:
```env
MONGODB_URI=mongodb://localhost:27017/connectup
```

#### Step 4: Restart Backend
```bash
cd c:\Projects\Final\ConnectUp\backend
npm run dev
```

### Option 3: Use MongoDB Atlas with Different Network

If your current network blocks MongoDB Atlas:
1. Try using mobile hotspot
2. Try a different WiFi network
3. Disable VPN if you're using one
4. Check with your network administrator

## Verify Connection

After applying any solution, check the health endpoint:
```bash
curl http://localhost:5000/api/v1/health
```

You should see:
```json
{
  "status": "success",
  "message": "Server is running",
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

If `readyState` is `1`, you're connected! ✅

## Current Server Status

- ✅ Backend Server: Running on port 5000
- ✅ Frontend Server: Running on port 5173
- ❌ Database: Disconnected (readyState: 0)

## Need Help?

If you continue to have issues:
1. Check MongoDB Atlas status page: https://status.mongodb.com/
2. Review MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
3. Check your firewall settings
4. Try the local MongoDB option above
