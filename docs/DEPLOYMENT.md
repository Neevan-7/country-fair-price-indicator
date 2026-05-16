# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Domain name (for production)
- SSL certificates (for production)
- AWS/GCP/Azure account (optional, for cloud deployment)

## Local Development Deployment

### Using Docker Compose

1. **Clone the repository**
```bash
git clone <repository-url>
cd country-fair-price-indicator
```

2. **Create environment files**
```bash
cp backend/.env.example backend/.env
```

3. **Update backend/.env with local settings**
```env
NODE_ENV=development
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=country_fair_price_db
JWT_SECRET=your_local_jwt_secret
REDIS_HOST=redis
```

4. **Start services**
```bash
docker-compose up -d
```

5. **Verify services**
```bash
# Check services
docker-compose ps

# View logs
docker-compose logs -f backend
```

6. **Access applications**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## Production Deployment

### AWS ECS Deployment

1. **Push images to ECR**
```bash
# Build images
docker-compose build

# Tag images
docker tag country-fair-price-indicator-backend:latest \
  <aws_account_id>.dkr.ecr.<region>.amazonaws.com/cfpi-backend:latest

docker tag country-fair-price-indicator-frontend:latest \
  <aws_account_id>.dkr.ecr.<region>.amazonaws.com/cfpi-frontend:latest

# Push to ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/cfpi-backend:latest
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/cfpi-frontend:latest
```

2. **Setup RDS Database**
```bash
# Create PostgreSQL RDS instance with:
- Multi-AZ: Yes
- Backup retention: 30 days
- Enhanced monitoring enabled
- Automated backups enabled
```

3. **Setup ElastiCache for Redis**
```bash
# Create Redis cluster with:
- Multi-AZ: Yes
- Automatic failover: Yes
- Encryption in transit: Yes
- Encryption at rest: Yes
```

4. **Create ECS Task Definitions and Services**
- See AWS documentation for task definition setup

### Kubernetes Deployment

1. **Create Kubernetes manifests** (helm charts recommended)
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cfpi-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cfpi-backend
  template:
    metadata:
      labels:
        app: cfpi-backend
    spec:
      containers:
      - name: backend
        image: your-registry/cfpi-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: cfpi-secrets
              key: db-host
        # Add more environment variables
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
```

2. **Deploy with Helm**
```bash
helm install cfpi ./helm-chart \
  --namespace production \
  --create-namespace
```

### Manual VPS Deployment

1. **SSH to server**
```bash
ssh user@your-domain.com
```

2. **Install Docker**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
```

3. **Clone repository**
```bash
git clone <repository-url>
cd country-fair-price-indicator
```

4. **Create production env file**
```bash
cat > backend/.env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=db.example.com
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=\$(openssl rand -base64 32)
JWT_SECRET=\$(openssl rand -base64 32)
EOF
```

5. **Start with docker-compose**
```bash
docker-compose -f docker-compose.yml up -d
```

6. **Setup Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name api.countryfairprice.com;
    
    location / {
        proxy_pass http://backend:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}

server {
    listen 80;
    server_name app.countryfairprice.com;
    
    location / {
        proxy_pass http://frontend:3000;
    }
}
```

7. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.countryfairprice.com -d app.countryfairprice.com
```

## Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:5000/health

# Check database connection
docker-compose exec backend npm run migrate
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# View with timestamps
docker-compose logs -f --timestamps
```

### Backups
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres country_fair_price_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres country_fair_price_db < backup.sql
```

### Updates
```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

## Security Checklist

- [ ] Update all environment secrets in production
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Enable database encryption
- [ ] Setup automated backups
- [ ] Enable monitoring and alerting
- [ ] Configure VPN access if needed
- [ ] Setup rate limiting
- [ ] Enable CORS restrictions
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Performance Optimization

1. **Database Optimization**
   - Add missing indexes
   - Vacuum and analyze tables regularly
   - Monitor slow queries

2. **Caching Strategy**
   - Configure Redis expiration
   - Implement cache warming
   - Monitor cache hit rates

3. **CDN Setup**
   - Serve static assets from CDN
   - Configure cache headers
   - Use compression

4. **Load Balancing**
   - Setup load balancer
   - Configure health checks
   - Implement auto-scaling

## Troubleshooting

### Database connection fails
```bash
# Check connectivity
docker-compose exec backend nc -zv postgres 5432

# Check logs
docker-compose logs postgres
```

### Redis connection fails
```bash
docker-compose exec backend redis-cli -h redis ping
```

### Port already in use
```bash
# Kill process on port
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Out of memory
```bash
# Check Docker stats
docker stats

# Increase memory limit in docker-compose.yml
```

---

For more help, contact: devops@countryfairprice.com
