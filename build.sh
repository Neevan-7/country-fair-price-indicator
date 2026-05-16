# Root build script
#!/bin/bash

echo "🏗️  Building Country Fair Price Indicator Application"
echo "=================================================="

# Create logs directory
mkdir -p logs

# Build backend
echo "📦 Building backend..."
cd backend
npm install
npm run build
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
echo ""
echo "To run with Docker Compose:"
echo "  docker-compose up -d"
echo ""
echo "To run locally:"
echo "  - Backend: cd backend && npm start"
echo "  - Frontend: cd frontend && npm run preview"
