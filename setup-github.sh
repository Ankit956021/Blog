#!/bin/bash

echo "🚀 BlogSpot GitHub + Vercel Deployment"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📂 Setting up Git repository...${NC}"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}🔧 Initializing Git repository...${NC}"
    git init
fi

# Add all files
echo -e "${YELLOW}📝 Adding files to Git...${NC}"
git add .

# Commit
echo -e "${YELLOW}💾 Creating initial commit...${NC}"
git commit -m "🚀 BlogSpot with Appwrite Integration

Features:
- Full-stack blog application
- Appwrite backend integration
- Blog posts, comments, support system
- Career applications
- User authentication
- Admin panel
- Responsive design

Ready for deployment on Vercel/Netlify"

echo -e "${GREEN}✅ Git repository setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Create a new repository on GitHub"
echo "2. Copy the remote URL"
echo "3. Run: git remote add origin <your-github-url>"
echo "4. Run: git push -u origin main"
echo ""
echo -e "${YELLOW}🌐 Then deploy on:${NC}"
echo "• Vercel: https://vercel.com (recommended)"
echo "• Netlify: https://netlify.com"
echo ""
echo -e "${BLUE}🔐 Don't forget to add environment variables:${NC}"
echo "APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1"
echo "APPWRITE_PROJECT_ID=68d683d6000d13d40634"
echo "APPWRITE_API_KEY=your_secret_key"
echo "APPWRITE_DATABASE_ID=blog"
echo ""
echo -e "${GREEN}🎉 Your BlogSpot is ready for deployment!${NC}"