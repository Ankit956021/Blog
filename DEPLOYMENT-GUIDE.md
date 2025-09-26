# BlogSpot - Appwrite Deployment Guide

## 🚀 Deployment Options for Appwrite Blog Application

### **Option 1: Vercel (Recommended for Full-Stack)**

#### Backend Deployment (API Routes)
1. **Create `vercel.json` in root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "APPWRITE_ENDPOINT": "https://nyc.cloud.appwrite.io/v1",
    "APPWRITE_PROJECT_ID": "68d683d6000d13d40634",
    "APPWRITE_API_KEY": "@appwrite_api_key",
    "APPWRITE_DATABASE_ID": "blog",
    "NODE_ENV": "production"
  }
}
```

#### Steps:
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Add Environment Variables:**
   ```bash
   vercel env add APPWRITE_API_KEY
   # Paste your API key when prompted
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

---

### **Option 2: Netlify (Static + Functions)**

#### Create Netlify Functions for API
1. **Create `netlify/functions/` directory**
2. **Create `netlify.toml`:**
```toml
[build]
  functions = "netlify/functions"
  publish = "frontend"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Steps:
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

---

### **Option 3: Railway (Full Backend + Frontend)**

#### Create `railway.json`:
```json
{
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Steps:
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize:**
   ```bash
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

---

### **Option 4: Render (Free Tier Available)**

#### Create `render.yaml`:
```yaml
services:
  - type: web
    name: blogspot-api
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: APPWRITE_ENDPOINT
        value: https://nyc.cloud.appwrite.io/v1
      - key: APPWRITE_PROJECT_ID
        value: 68d683d6000d13d40634
      - key: APPWRITE_DATABASE_ID
        value: blog
      - key: NODE_ENV
        value: production

  - type: static
    name: blogspot-frontend
    buildCommand: echo "Static files ready"
    staticPublishPath: ./frontend
```

---

### **Quick Deployment Commands**

#### For Vercel:
```bash
# एक command में सब कुछ
npm install -g vercel
vercel login
vercel env add APPWRITE_API_KEY
vercel --prod
```

#### For Netlify:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

#### For Railway:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

### **Environment Variables Setup**

सभी platforms पर ये environment variables set करना होगा:

```env
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=68d683d6000d13d40634
APPWRITE_API_KEY=your_secret_api_key
APPWRITE_DATABASE_ID=blog
APPWRITE_COLLECTION_BLOGS=blogs
APPWRITE_COLLECTION_COMMENTS=comments
APPWRITE_COLLECTION_CATEGORIES=categories
APPWRITE_COLLECTION_USERS=users
APPWRITE_COLLECTION_SUPPORT=support
APPWRITE_COLLECTION_CAREERS=careers
APPWRITE_BUCKET_ID=blog_images
NODE_ENV=production
PORT=3001
```

---

### **Pre-Deployment Checklist**

✅ **Database Collections Created** in Appwrite Console
✅ **Permissions Set** properly for all collections
✅ **Storage Bucket Created** for images
✅ **API Keys** are working
✅ **CORS Settings** updated in Appwrite (add your domain)
✅ **Frontend Config** updated with production URLs

---

### **Post-Deployment**

1. **Update CORS in Appwrite:**
   - Go to Settings → CORS
   - Add your deployed domain (e.g., `https://yourdomain.vercel.app`)

2. **Test All Endpoints:**
   - Health check: `https://yourdomain.com/api/health`
   - Blogs: `https://yourdomain.com/api/blogs`

3. **Update Frontend URLs:**
   - Change API base URL in frontend to production URL

---

### **Recommended: Vercel Deployment**

सबसे आसान और reliable option है Vercel। मैं आपके लिए setup करूं?