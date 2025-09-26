# 🚀 Appwrite Deployment Guide for BlogSpot

## Step-by-Step Deployment Process

### 1. 🖥️ Backend Deployment (Appwrite Functions)

1. **Go to Appwrite Console**:
   ```
   https://cloud.appwrite.io/console/project/68d683d6000d13d40634
   ```

2. **Create Function**:
   - Click on "Functions" in the left sidebar
   - Click "Create Function"
   - Fill in details:
     ```
     Name: blogspot-api
     Runtime: Node.js 18.0
     Entry Point: server.js
     ```

3. **Upload Code**:
   - Upload the file: `deployment/backend-function.tar.gz`
   - Wait for deployment to complete

4. **Set Environment Variables**:
   ```
   APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=68d683d6000d13d40634
   APPWRITE_API_KEY=standard_e335431fa40fc66dd8a87937ad12f1d47f841bae9989b3d2cf5f4e52cd7af7f7bcf3d0dad55cbd7fffdef3b6fdceb7ba2598f2a40e4ac6c411b82c692eaa7b4e83e13be1db4885f4380468adc2282bc106c311f84a52d45d135880850cb25ab760eccce0681e5ef67ad460beb3bcc5f3bd52a61a491b7c2b433cc3dc9fedbd5c
   APPWRITE_DATABASE_ID=blog
   APPWRITE_COLLECTION_BLOGS=blogs
   APPWRITE_COLLECTION_COMMENTS=comments
   APPWRITE_COLLECTION_CATEGORIES=categories
   APPWRITE_COLLECTION_USERS=users
   APPWRITE_COLLECTION_SUPPORT=support
   APPWRITE_COLLECTION_CAREERS=careers
   APPWRITE_BUCKET_ID=blog_images
   PORT=3001
   NODE_ENV=production
   ```

5. **Get Function URL**:
   - After deployment, copy the function URL
   - It will look like: `https://68d683d6000d13d40634.appwrite.global/`

### 2. 🌐 Frontend Deployment Options

#### Option A: Vercel (Recommended)
1. Go to https://vercel.com
2. Import your GitHub project: `Ankit956021/Blog`
3. Set build settings:
   ```
   Framework: Other
   Root Directory: frontend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   ```
4. Deploy!

#### Option B: Netlify
1. Go to https://netlify.com
2. Drag and drop the `deployment/frontend` folder
3. Or connect your GitHub repo and set build directory to `frontend`

#### Option C: GitHub Pages
1. Go to your repository settings
2. Enable GitHub Pages
3. Set source to `frontend` folder

### 3. 🔗 Update API URLs in Frontend

After backend function is deployed, update the API URL in your frontend:

1. Edit `frontend/assets/js/appwrite-config.js`
2. Replace the API base URL with your function URL:
   ```javascript
   const API_BASE_URL = 'https://YOUR-FUNCTION-URL.appwrite.global';
   ```

### 4. 🗄️ Verify Database Collections

Go to Appwrite Console and verify these collections exist:
- ✅ blogs
- ✅ comments  
- ✅ categories
- ✅ users
- ✅ support
- ✅ careers

### 5. 🔐 Set Up Storage Bucket

1. Go to Storage in Appwrite Console
2. Create bucket with ID: `blog_images`
3. Set permissions for file uploads

## 🎯 Quick Deploy Summary

1. **Backend**: Upload `deployment/backend-function.tar.gz` to Appwrite Functions
2. **Frontend**: Deploy to Vercel/Netlify from GitHub repo
3. **Update**: Change API URL in frontend to function URL
4. **Test**: Verify all endpoints work

## 🚀 Your URLs After Deployment

- **Backend API**: `https://68d683d6000d13d40634.appwrite.global/`
- **Frontend**: `https://your-project.vercel.app` (or chosen platform)
- **Admin Panel**: `https://your-project.vercel.app/pages/admin.html`

## 🔧 Environment Variables for Frontend Deployment

If your frontend platform asks for environment variables:
```
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=68d683d6000d13d40634
```

---

## 🎉 You're All Set!

Your BlogSpot application will be fully deployed on Appwrite backend with your chosen frontend hosting platform!