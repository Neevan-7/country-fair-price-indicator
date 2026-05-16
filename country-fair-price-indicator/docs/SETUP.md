# Project Setup and Configuration Guide

## Complete Setup Instructions

### Step 1: Initial Setup

```bash
# Navigate to project directory
cd country-fair-price-indicator

# Create necessary directories
mkdir -p backend/logs frontend/dist

# Set file permissions (Linux/Mac)
chmod +x build.sh
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# Edit the following:
# - DB credentials
# - JWT secrets
# - CORS origins
```

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api/v1
EOF
```

### Step 4: Database Initialization

```bash
# From backend directory
npm run migrate

# Optional: Seed initial data
npm run db:seed
```

### Step 5: Run Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

### Step 6: Docker Setup (Alternative)

```bash
# From project root
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Environment Configuration

### Backend Environment (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=country_fair_price_db
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_min_32_chars
JWT_EXPIRATION=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@countryfairprice.com

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# AWS Configuration
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Feature Flags
FEATURE_REAL_TIME_UPDATES=true
FEATURE_USER_VERIFICATION=true
FEATURE_PREMIUM_FEATURES=false
```

### Frontend Environment (.env.local)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## Package Dependencies

### Backend Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| typeorm | ^0.3.17 | ORM for database |
| pg | ^8.11.3 | PostgreSQL driver |
| jsonwebtoken | ^9.1.2 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| redis | ^4.6.11 | Redis client |
| socket.io | ^4.7.2 | WebSocket support |
| joi | ^17.11.0 | Schema validation |
| winston | ^3.11.0 | Logging |

### Frontend Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI library |
| vite | ^5.0.8 | Build tool |
| react-router-dom | ^6.20.0 | Routing |
| axios | ^1.6.2 | HTTP client |
| zustand | ^4.4.1 | State management |
| tailwindcss | ^3.3.6 | Styling |
| leaflet | ^1.9.4 | Maps |
| recharts | ^2.10.3 | Charts |

---

## Database Setup

### PostgreSQL Installation

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### Create Database

```sql
-- Connect as postgres user
CREATE DATABASE country_fair_price_db;
CREATE USER cfpi_user WITH PASSWORD 'secure_password';
ALTER ROLE cfpi_user SET client_encoding TO 'utf8';
ALTER ROLE cfpi_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE cfpi_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE country_fair_price_db TO cfpi_user;
```

### Redis Installation

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows:**
Use WSL or Docker

---

## Build & Compilation

### Backend Build

```bash
cd backend

# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

### Frontend Build

```bash
cd frontend

# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Full Application Build

```bash
# From project root
bash build.sh
```

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## Linting & Code Quality

### Backend Linting

```bash
cd backend

# Check linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

### Frontend Linting

```bash
cd frontend

# Check linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

### Type Checking

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run type-check
```

---

## Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Test connection
psql -h localhost -U postgres -d country_fair_price_db
```

### npm install Failed

```bash
# Clear npm cache
npm cache clean --force

# Remove lock files
rm package-lock.json

# Reinstall
npm install
```

### Docker Issues

```bash
# Remove all containers
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start again
docker-compose up -d
```

---

## Performance Tuning

### PostgreSQL Optimization

```sql
-- Add indexes
CREATE INDEX idx_prices_product ON prices(product);
CREATE INDEX idx_prices_location ON prices(location);
CREATE INDEX idx_prices_created_at ON prices(created_at);
CREATE INDEX idx_users_email ON users(email);

-- Analyze
ANALYZE;

-- Vacuum
VACUUM ANALYZE;
```

### Node.js Optimization

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### Redis Optimization

```bash
# Monitor Redis
redis-cli MONITOR

# Check memory usage
redis-cli INFO memory

# Clear cache (development only)
redis-cli FLUSHALL
```

---

For detailed setup help, see the individual README files in backend/ and frontend/ directories.
