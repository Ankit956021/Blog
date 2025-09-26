#!/bin/bash

echo "🚀 BlogSpot Appwrite Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json not found! Make sure you're in the project root directory.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "✅ Appwrite database collections created?"
echo "✅ Permissions set in Appwrite console?"
echo "✅ Storage bucket created?"
echo "✅ API key is working?"

read -p "Continue with deployment? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 1
fi

echo -e "${BLUE}🔐 Setting up environment variables...${NC}"
echo "Please provide your Appwrite API key:"
read -s APPWRITE_API_KEY

if [ -z "$APPWRITE_API_KEY" ]; then
    echo -e "${RED}❌ API key is required!${NC}"
    exit 1
fi

# Add environment variables to Vercel
echo -e "${YELLOW}📝 Adding environment variables to Vercel...${NC}"
echo $APPWRITE_API_KEY | vercel env add APPWRITE_API_KEY production

echo -e "${BLUE}🏗 Building project...${NC}"
npm run build

echo -e "${GREEN}🚀 Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}📊 Check your deployment at: https://vercel.com/dashboard${NC}"

echo -e "${YELLOW}📋 Post-deployment tasks:${NC}"
echo "1. Update CORS settings in Appwrite console with your new domain"
echo "2. Test all API endpoints"
echo "3. Create sample blog posts"

echo -e "${GREEN}🎉 Your BlogSpot application is now live!${NC}"