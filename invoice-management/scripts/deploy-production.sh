#!/bin/bash

set -e

echo "🚀 Invoice Management System - Production Deployment Script"
echo "============================================================"
echo ""

if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

echo "✅ Environment file found"
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔍 Running type checks..."
npm run typecheck:all

echo ""
echo "🏗️  Building frontend..."
npm run build

echo ""
echo "🏗️  Building backend..."
npm run build:backend

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Test locally: npm run preview (frontend) & npm run start:backend (backend)"
echo "   2. Deploy using one of these methods:"
echo "      - Docker: npm run docker:build && npm run docker:run"
echo "      - Vercel: vercel --prod"
echo "      - VPS: Copy dist/ and packages/backend/dist/ to your server"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
