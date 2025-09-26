#!/bin/bash

echo "🚂 BlogSpot Railway Deployment Script"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

echo -e "${BLUE}🔑 Login to Railway...${NC}"
railway login

echo -e "${BLUE}🎯 Initialize Railway project...${NC}"
railway init

echo -e "${BLUE}🔐 Setting environment variables...${NC}"
railway variables set APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
railway variables set APPWRITE_PROJECT_ID=68d683d6000d13d40634
railway variables set APPWRITE_DATABASE_ID=blog
railway variables set APPWRITE_COLLECTION_BLOGS=blogs
railway variables set APPWRITE_COLLECTION_COMMENTS=comments
railway variables set APPWRITE_COLLECTION_CATEGORIES=categories
railway variables set APPWRITE_COLLECTION_USERS=users
railway variables set APPWRITE_COLLECTION_SUPPORT=support
railway variables set APPWRITE_COLLECTION_CAREERS=careers
railway variables set APPWRITE_BUCKET_ID=blog_images
railway variables set NODE_ENV=production
railway variables set PORT=3001

echo "Please enter your Appwrite API key:"
read -s APPWRITE_API_KEY
railway variables set APPWRITE_API_KEY=$APPWRITE_API_KEY

echo -e "${GREEN}🚀 Deploying to Railway...${NC}"
railway up

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}🌐 Your app is now live on Railway!${NC}"