# Country Fair Price Indicator - Production Web Application

> **A comprehensive solution to protect tourists and consumers from market scams through fair price detection and community awareness.**

## 🎯 Project Overview

The Country Fair Price Indicator is a production-grade web application designed to protect tourists and consumers from being overcharged in local markets, especially in countries known for tourist scams. Users can report prices, compare them with fair market values, and identify potentially fraudulent transactions.

### Key Features

- **Price Reporting**: Report prices encountered in local markets
- **Fair Price Detection**: Automated estimation of fair market prices
- **Location-Based Intelligence**: Identify high-risk markets and scam hotspots
- **Community Verification**: Crowdsourced price validation
- **Trust Scoring**: User reputation system
- **Real-time Updates**: WebSocket support for live data
- **Responsive Design**: Mobile-first approach
- **Scalable Architecture**: Multi-layer enterprise design

## 📋 System Architecture

### Tech Stack

#### Backend
- **Runtime**: Node.js 20+ (TypeScript)
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Authentication**: JWT
- **API**: RESTful with WebSocket support

#### Frontend
- **Library**: React 18
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Maps**: Leaflet/React-Leaflet
- **Charts**: Recharts

#### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: TypeORM
- **Logging**: Winston
- **Monitoring**: Health checks, metrics

### Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│      (React Frontend - Vite)            │
└────────────────┬────────────────────────┘
                 │ HTTP/WebSocket
┌────────────────▼────────────────────────┐
│         API Gateway Layer               │
│    (Express.js + Middleware Stack)      │
├─────────────────────────────────────────┤
│ Auth │ Validation │ Rate Limit │ CORS   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Business Logic Layer            │
│      (Services & Controllers)           │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Data Access Layer               │
│      (TypeORM Repositories)             │
├─────────────────────────────────────────┤
│ PostgreSQL │ Redis Cache │ Migrations   │
└─────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 16+ (local development)
- Redis 7+ (local development)

### Quick Start with Docker

```bash
# Clone and navigate to project
cd country-fair-price-indicator

# Build and start all services
docker-compose up -d

# Application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Local Development Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with local database credentials
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Project Structure

```
country-fair-price-indicator/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Application entry point
│   │   ├── config/               # Configuration files
│   │   ├── models/               # Database entities
│   │   ├── controllers/          # Route handlers
│   │   ├── services/             # Business logic
│   │   ├── middleware/           # Express middleware
│   │   ├── utils/                # Utility functions
│   │   ├── database/             # Migrations & seeders
│   │   └── types/                # TypeScript definitions
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Main component
│   │   ├── pages/                # Route pages
│   │   ├── components/           # Reusable components
│   │   ├── services/             # API client functions
│   │   ├── store/                # Zustand state
│   │   ├── hooks/                # Custom React hooks
│   │   ├── styles/               # CSS/Tailwind
│   │   └── types/                # TypeScript types
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── Dockerfile
├── docs/
│   ├── README.md                 # This file
│   ├── ARCHITECTURE.md           # Detailed architecture
│   ├── API_DOCUMENTATION.md      # API specs
│   └── DEPLOYMENT.md             # Deployment guide
├── docker-compose.yml
├── .gitignore
└── build.sh
```

## 📚 Database Schema

### User Entity
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  userType ENUM('TOURIST', 'LOCAL', 'MERCHANT', 'ADMIN'),
  trustScore INTEGER DEFAULT 100,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Price Entity
```sql
CREATE TABLE prices (
  id UUID PRIMARY KEY,
  product VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  reportedPrice DECIMAL(10,2) NOT NULL,
  estimatedFairPrice DECIMAL(10,2),
  overchargePercentage DECIMAL(5,2),
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  reportedBy UUID REFERENCES users(id),
  status ENUM('PENDING', 'VERIFIED', 'REJECTED', 'SCAM'),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Location Entity
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  marketName VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  riskLevel ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  averageOverchargePercentage DECIMAL(5,2)
);
```

## 🔐 Security Features

1. **Authentication**: JWT-based authentication with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Joi schema validation on all endpoints
4. **Password Security**: bcryptjs with salt rounds (12)
5. **HTTPS Ready**: SSL/TLS configuration included
6. **CORS Protection**: Configurable CORS headers
7. **Rate Limiting**: Ready for rate limit middleware
8. **SQL Injection Prevention**: Parameterized queries via TypeORM
9. **XSS Protection**: Helmet.js security headers
10. **Data Encryption**: Support for sensitive data encryption

## 📊 Scalability Considerations

### Database Optimization
- Indexed columns on frequently queried fields
- Connection pooling configured
- Query optimization through TypeORM
- Support for database read replicas

### Caching Strategy
- Redis for session storage
- Cache invalidation on data updates
- Distributed caching support

### API Optimization
- Response compression (gzip)
- Pagination support
- Lazy loading capabilities
- GraphQL-ready architecture

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Service worker support
- Progressive enhancement

### Horizontal Scalability
- Stateless backend design
- Load balancer compatible
- Containerized deployment
- Database connection pooling
- Session storage in Redis

## 📈 Performance Monitoring

### Logging
- Structured logging with Winston
- Log rotation and retention
- Error tracking with stack traces

### Metrics
- Request duration tracking
- API response time monitoring
- Database query performance
- Cache hit rates

### Health Checks
- Database connectivity
- Redis availability
- Service health endpoints

## 🧪 Testing Setup

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📦 Building for Production

### Build Backend
```bash
cd backend
npm install
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```

### Using Docker Compose (Recommended)
```bash
docker-compose -f docker-compose.yml up -d
```

## 🌍 Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secure_password
JWT_SECRET=your_secret_key
REDIS_HOST=redis
REDIS_PORT=6379
```

### Frontend (.env.local)
```
VITE_API_URL=https://api.example.com/api/v1
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment (AWS/GCP/Azure)
- Use managed database services
- Use managed Redis services
- Deploy containers to Kubernetes or managed container services
- Configure CDN for static assets
- Set up monitoring and alerting

## 📞 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token

### Prices
- `GET /api/v1/prices/search` - Search prices by product
- `GET /api/v1/prices/location/:lat/:lng` - Get prices by location
- `GET /api/v1/prices/average` - Get average price
- `POST /api/v1/prices/report` - Report a price

### Locations
- `GET /api/v1/locations` - Get all locations
- `GET /api/v1/locations/:id` - Get location details

### Users
- `GET /api/v1/users/profile/:id` - Get user profile

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@countryfairprice.com
- Documentation: See `/docs` folder

---

**Made with ❤️ to protect tourists and consumers worldwide**
