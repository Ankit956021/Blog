#!/bin/bash

# Appwrite Deployment Script for BlogSpot
echo "🚀 BlogSpot Appwrite Deployment"
echo "================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Load environment variables
if [ -f backend/.env ]; then
    echo -e "${BLUE}🔧 Loading environment variables...${NC}"
    source backend/.env
else
    echo -e "${RED}❌ backend/.env file not found!${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Preparing deployment packages...${NC}"

# Create deployment directory
mkdir -p deployment
rm -rf deployment/*

# Copy backend files
echo -e "${YELLOW}📂 Copying backend files...${NC}"
cp -r backend deployment/
rm -f deployment/backend/.env

# Copy frontend files
echo -e "${YELLOW}📂 Copying frontend files...${NC}"
cp -r frontend deployment/

# Create production environment file
echo -e "${YELLOW}🔐 Creating production environment...${NC}"
cat > deployment/backend/.env << EOF
APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT}
APPWRITE_PROJECT_ID=${APPWRITE_PROJECT_ID}
APPWRITE_API_KEY=${APPWRITE_API_KEY}
APPWRITE_DATABASE_ID=${APPWRITE_DATABASE_ID}
APPWRITE_COLLECTION_BLOGS=${APPWRITE_COLLECTION_BLOGS}
APPWRITE_COLLECTION_COMMENTS=${APPWRITE_COLLECTION_COMMENTS}
APPWRITE_COLLECTION_CATEGORIES=${APPWRITE_COLLECTION_CATEGORIES}
APPWRITE_COLLECTION_USERS=${APPWRITE_COLLECTION_USERS}
APPWRITE_COLLECTION_SUPPORT=${APPWRITE_COLLECTION_SUPPORT}
APPWRITE_COLLECTION_CAREERS=${APPWRITE_COLLECTION_CAREERS}
APPWRITE_BUCKET_ID=${APPWRITE_BUCKET_ID}
PORT=3001
NODE_ENV=production
EOF

# Install dependencies
echo -e "${YELLOW}📦 Installing production dependencies...${NC}"
cd deployment/backend
npm install --production
cd ../..

echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd deployment/frontend
npm install --production
cd ../..

# Create Docker files for Appwrite Functions
echo -e "${YELLOW}🐳 Creating Dockerfile for backend...${NC}"
cat > deployment/backend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Start the application
CMD ["node", "server.js"]
EOF

# Create function deployment package
echo -e "${YELLOW}📦 Creating function deployment package...${NC}"
cd deployment/backend
tar -czf ../backend-function.tar.gz .
cd ../..

# Create static site package for frontend
echo -e "${YELLOW}📦 Creating frontend static package...${NC}"
cd deployment/frontend
tar -czf ../frontend-static.tar.gz .
cd ../..

echo -e "${GREEN}✅ Deployment packages created successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Manual Deployment Steps:${NC}"
echo ""
echo -e "${YELLOW}1. Backend (Appwrite Functions):${NC}"
echo "   • Go to your Appwrite Console: https://cloud.appwrite.io/console/project/${APPWRITE_PROJECT_ID}"
echo "   • Navigate to Functions section"
echo "   • Create a new function:"
echo "     - Name: blogspot-api"
echo "     - Runtime: Node.js 18"
echo "     - Upload: deployment/backend-function.tar.gz"
echo "     - Entry Point: server.js"
echo "   • Set environment variables in the function"
echo ""
echo -e "${YELLOW}2. Frontend (Static Hosting):${NC}"
echo "   • Deploy frontend to a static hosting service:"
echo "   • Option A - Vercel:"
echo "     - Connect your GitHub repo"
echo "     - Set build directory to 'frontend'"
echo "   • Option B - Netlify:"
echo "     - Drag and drop 'deployment/frontend' folder"
echo "   • Option C - Appwrite Storage (for static files):"
echo "     - Upload files to a public bucket"
echo ""
echo -e "${YELLOW}3. Database & Collections:${NC}"
echo "   • Verify all collections exist in Appwrite Console"
echo "   • Check permissions are set correctly"
echo "   • Test API endpoints"
echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"
echo ""
echo -e "${BLUE}📁 Deployment files created in:${NC}"
echo "   • deployment/backend-function.tar.gz (for Appwrite Functions)"
echo "   • deployment/frontend-static.tar.gz (for static hosting)"
echo ""
echo -e "${YELLOW}🔧 Quick Deploy Commands:${NC}"
echo "   Backend Function URL will be: https://[PROJECT-ID].appwrite.global/"
echo "   Update frontend API URLs after function deployment"