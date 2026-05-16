# API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.countryfairprice.com/api/v1
```

## Authentication

### Request Headers
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "userType": "TOURIST" | "LOCAL" | "MERCHANT"
}

Response (201):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "TOURIST"
    }
  }
}
```

### Login
```
POST /auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}
  }
}
```

### Refresh Token
```
POST /auth/refresh

Request Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}
  }
}
```

---

## Price Endpoints

### Report a Price
```
POST /prices/report

Headers:
Authorization: Bearer {token}

Request Body:
{
  "product": "Suitcase",
  "category": "Luggage",
  "reportedPrice": 7000,
  "location": "Jaipur Local Market",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "shopName": "Kumar Bags",
  "description": "Brown leather suitcase",
  "images": ["url1", "url2"]
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "product": "Suitcase",
    "reportedPrice": 7000,
    "estimatedFairPrice": 700,
    "overchargePercentage": 900,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Search Prices by Product
```
GET /prices/search?product=suitcase&location=Jaipur

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": "Suitcase",
      "reportedPrice": 7000,
      "estimatedFairPrice": 700,
      "overchargePercentage": 900,
      "location": "Jaipur Local Market",
      "status": "VERIFIED"
    }
  ],
  "count": 1
}
```

### Get Prices by Location
```
GET /prices/location/26.9124/75.7873?radius=5

Response (200):
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### Get Average Price
```
GET /prices/average?product=suitcase&location=Jaipur

Response (200):
{
  "success": true,
  "data": {
    "averagePrice": 8000
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errors": {
    "email": ["Invalid email format"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

Coming soon. Rate limits will be:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- 1000 requests per day for bulk operations
