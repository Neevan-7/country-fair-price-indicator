# Architecture Documentation

## System Overview

The Country Fair Price Indicator is built on a microservices-ready, scalable architecture that can grow from a single container deployment to a full Kubernetes cluster.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN / Cache Layer                    │
│                    (CloudFlare / CloudFront)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Load Balancer                             │
│              (NGINX / AWS ALB / GCP LB)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐   ┌────▼───┐   ┌───▼──┐
    │Front │   │Backend │   │API   │
    │end   │   │Server  │   │Server│
    │:3000 │   │:5000   │   │:5000 │
    └──────┘   └────┬───┘   └──────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──────┐ ┌──▼───┐    ┌──▼───┐
    │PostgreSQL│ │Redis │    │Search│
    │Database  │ │Cache │    │Index │
    │(RDS)     │ │ (EC) │    │(ES)  │
    └──────────┘ └──────┘    └──────┘
```

## Layered Architecture

### 1. Presentation Layer
**Technology**: React 18 + TypeScript

Components:
- `App.tsx` - Main application component
- `pages/` - Route-based pages
- `components/` - Reusable UI components
- `store/` - Zustand state management

Responsibilities:
- Render user interface
- Handle user interactions
- Client-side routing
- Form validation
- State management

### 2. API Gateway Layer
**Technology**: Express.js + Middleware Stack

Components:
- Routing configuration
- CORS middleware
- Authentication middleware
- Request validation
- Error handling
- Rate limiting
- Logging

Responsibilities:
- Route incoming requests
- Apply cross-cutting concerns
- Validate requests
- Handle errors gracefully
- Log all activities

### 3. Business Logic Layer
**Technology**: Node.js Services

Components:
- `services/authService.ts` - User authentication
- `services/priceService.ts` - Price management
- `services/locationService.ts` - Location intelligence

Responsibilities:
- Implement business rules
- Data transformation
- Complex calculations
- Integration logic
- Third-party API calls

### 4. Data Access Layer
**Technology**: TypeORM + PostgreSQL

Components:
- Entity repositories
- Query builders
- Database migrations
- Seeding scripts

Responsibilities:
- Database CRUD operations
- Query optimization
- Transaction management
- Schema management

### 5. Data Storage Layer
**Technology**: PostgreSQL + Redis

Components:
- PostgreSQL: Primary data store
- Redis: Cache and sessions
- File storage: S3 (future)

---

## Scalability Features

### Horizontal Scalability

1. **Stateless Design**
   - No session data stored in memory
   - Sessions stored in Redis
   - Can run multiple instances

2. **Load Balancing**
   - Multiple backend instances
   - Database connection pooling
   - Redis cluster support

3. **Caching Strategy**
   - Redis for hot data
   - HTTP caching headers
   - CDN for static assets

### Vertical Scalability

1. **Database**
   - Connection pooling
   - Query optimization
   - Index strategies

2. **Memory Management**
   - Efficient data structures
   - Garbage collection tuning
   - Memory limits

### Performance Optimization

1. **API Optimization**
   ```
   - Pagination (limit: 100)
   - Lazy loading
   - Field selection
   - Compression (gzip)
   ```

2. **Database Optimization**
   ```
   - Strategic indexing
   - Query optimization
   - Connection pooling (max: 20)
   ```

3. **Frontend Optimization**
   ```
   - Code splitting
   - Lazy loading
   - Image optimization
   - Service workers
   ```

---

## Security Architecture

### Authentication Flow
```
User Login → JWT Generation → Token Storage → Authenticated Requests
                                                    ↓
                                            Token Validation
                                                    ↓
                                        Grant/Deny Access
```

### Authorization Flow
```
Authenticated Request → Extract User Role → Check Permissions → Allow/Deny
```

### Data Protection
- **In Transit**: HTTPS/TLS encryption
- **At Rest**: Database encryption, encrypted fields
- **Secrets**: Environment variables, secret management

### Input Validation
```
Request → Joi Schema → Sanitization → Processing
            ↓
          Invalid → Error Response
```

---

## Database Design

### Normalized Schema

```
users
├── id (PK)
├── email (UNIQUE)
├── passwordHash
├── userType (INDEX)
└── timestamps

prices
├── id (PK)
├── product
├── reportedPrice
├── estimatedFairPrice
├── reportedBy (FK → users)
├── location
├── latitude, longitude
├── status (INDEX)
└── timestamps

locations
├── id (PK)
├── marketName (UNIQUE INDEX)
├── city, state, country
├── latitude, longitude
├── riskLevel
└── timestamps

reviews
├── id (PK)
├── content
├── priceId (FK → prices)
├── authorId (FK → users)
└── timestamps
```

### Key Indexes
- `users.email` - Fast user lookup
- `prices.product` - Product search
- `prices.status` - Filter by verification status
- `prices.createdAt` - Recent data queries
- `locations.marketName` - Market lookup
- `reviews.priceId` - Review retrieval

---

## Deployment Strategies

### Development
- Docker Compose with all services
- Local PostgreSQL and Redis
- Hot reload enabled

### Staging
- Containerized deployment
- Managed database service
- Managed cache service
- Load balancer

### Production
- Kubernetes cluster
- Auto-scaling enabled
- Multi-region deployment
- Blue-green deployment strategy
- Automated backups
- Disaster recovery setup

---

## Monitoring & Observability

### Metrics Collection
- Request response times
- Database query performance
- Cache hit rates
- Error rates
- User activity

### Logging Strategy
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized log aggregation
- Log retention: 30 days

### Alerting
- High error rates (>5%)
- Database connection failures
- Memory usage >80%
- Disk space <10%
- API response time >2s

---

## Data Flow

### Price Reporting Flow
```
1. User submits price report
2. Frontend validates data
3. Request sent to backend with auth token
4. Backend validates input
5. Service calculates fair price
6. Data stored in PostgreSQL
7. Location risk level updated
8. Cache invalidated
9. Response sent to frontend
10. Real-time update via WebSocket (future)
```

### Price Search Flow
```
1. User enters search criteria
2. Check Redis cache first
3. If cache miss → Query PostgreSQL
4. Apply filters and sorting
5. Paginate results
6. Cache results (5 min TTL)
7. Return to frontend
8. Frontend renders results
```

---

## Future Enhancements

1. **Microservices Migration**
   - Separate authentication service
   - Separate search service
   - Separate analytics service

2. **Real-time Features**
   - WebSocket connections
   - Live price updates
   - Instant notifications

3. **AI/ML Integration**
   - Fraud detection
   - Price prediction
   - Anomaly detection

4. **Advanced Analytics**
   - Dashboard analytics
   - Trend analysis
   - Market intelligence

5. **Mobile Applications**
   - Native iOS app
   - Native Android app
   - Offline capabilities

---

For questions about architecture, contact: architecture@countryfairprice.com
