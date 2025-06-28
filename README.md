# upTime Backend - Appointment Booking System

A Node.js/Express.js backend application for managing appointment bookings for service-based businesses like clinics, salons, and parlors.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Business Logic Flow](#business-logic-flow)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

upTime Backend is a RESTful API service that enables:
- **Multi-role user management** (User, Shopkeeper, Admin)
- **Shop registration and management**
- **Appointment booking with conflict prevention**
- **OTP-based mobile authentication**
- **Role-based access control**

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   upTime API    │    │   MongoDB       │
│                 │    │                 │    │                 │
│ • Mobile App    │◄──►│ • Express.js    │◄──►│ • User          │
│ • Web App       │    │ • JWT Auth      │    │ • Shop          │
│ • Admin Panel   │    │ • Validation    │    │ • Appointment   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features

### 🔐 Authentication & Authorization
- **OTP-based mobile authentication**
- **JWT token management**
- **Role-based access control**
- **Session management**

### 🏪 Shop Management
- **Shop registration** (Shopkeepers only)
- **Shop search and filtering**
- **Business hours management**
- **Slot duration configuration**

### 📅 Appointment System
- **Time slot booking**
- **Conflict prevention**
- **Status management** (Pending, Confirmed, Cancelled, Completed)
- **Past appointment protection**

### 👥 User Management
- **Multi-role support** (User, Shopkeeper, Admin)
- **User verification system**
- **Profile management**

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 8.1.0 | Database |
| **Mongoose** | 8.1.0 | ODM |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **express-validator** | 7.2.1 | Input validation |
| **cors** | 2.8.5 | Cross-origin requests |
| **dotenv** | 16.4.1 | Environment management |

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd upTimeBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/uptime
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:5000/
   # Expected: {"message": "APIs running successfully"}
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. User Management

#### Request OTP
```http
POST /user/requestOtp
Content-Type: application/json

{
  "mobile": "1234567890",
  "role": "user" // "user", "shopkeeper", or "admin"
}
```

#### Verify OTP & Login
```http
POST /user/verifyOtp
Content-Type: application/json

{
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "mobile": "1234567890",
    "role": "user",
    "isVerified": true
  }
}
```

#### Logout
```http
POST /user/logout
Authorization: Bearer <token>
```

#### Get All Users (Admin Only)
```http
GET /user/all?page=1&limit=10
Authorization: Bearer <admin-token>
```

### 2. Shop Management

#### Create Shop (Shopkeeper Only)
```http
POST /shop
Authorization: Bearer <shopkeeper-token>
Content-Type: application/json

{
  "name": "Beauty Salon",
  "contact": "1234567890",
  "type": "salon",
  "address": "123 Main St, City",
  "openingTime": "09:00",
  "closingTime": "18:00",
  "slotDuration": 30
}
```

#### Get All Shops
```http
GET /shop?page=1&limit=10&type=salon
Authorization: Bearer <token>
```

#### Get Shop by ID
```http
GET /shop/:id
Authorization: Bearer <token>
```

#### Update Shop (Shopkeeper Only)
```http
PUT /shop/:id
Authorization: Bearer <shopkeeper-token>
Content-Type: application/json

{
  "name": "Updated Salon Name",
  "openingTime": "10:00"
}
```

#### Search Shops
```http
GET /shop/search/query?query=salon&page=1&limit=10
```

### 3. Appointment Management

#### Create Appointment
```http
POST /appointment
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "shop": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2024-01-15T10:00:00.000Z",
  "timeSlot": "10:00-10:30"
}
```

#### Get Appointments by Shop
```http
GET /appointment/:shopId?status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Update Appointment Status (Shopkeeper Only)
```http
PATCH /appointment/:id/status
Authorization: Bearer <shopkeeper-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  mobile: String (unique, required),
  role: enum["user", "shopkeeper", "admin"] (required),
  otp: String,
  otpExpiry: Date,
  isVerified: Boolean (default: false),
  token: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Schema
```javascript
{
  name: String (required),
  contact: String (required),
  type: enum["clinic", "salon", "parlor", "other"] (required),
  address: String (required),
  owner: ObjectId (ref: User, required),
  openingTime: String (required),
  closingTime: String (required),
  slotDuration: Number (default: 30),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Schema
```javascript
{
  user: ObjectId (ref: User, required),
  shop: ObjectId (ref: Shop, required),
  date: Date (required),
  timeSlot: String (required),
  status: enum["pending", "confirmed", "cancelled", "completed"] (default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as Database

    C->>A: POST /user/requestOtp
    A->>D: Find/Create User
    A->>D: Save OTP & Expiry
    A->>C: OTP Sent Response

    C->>A: POST /user/verifyOtp
    A->>D: Verify OTP
    A->>A: Generate JWT Token
    A->>D: Update User Token
    A->>C: Login Success + Token

    Note over C,A: Subsequent requests
    C->>A: Request with Bearer Token
    A->>A: Verify JWT Token
    A->>D: Validate User Session
    A->>C: Protected Resource
```

## 📊 Business Logic Flow

### Appointment Booking Flow
```mermaid
flowchart TD
    A[User Requests Appointment] --> B{Validate Input}
    B -->|Invalid| C[Return Error]
    B -->|Valid| D[Check Time Slot Availability]
    D -->|Not Available| E[Return Conflict Error]
    D -->|Available| F[Create Appointment]
    F --> G[Save to Database]
    G --> H[Return Success Response]
```

### Shop Management Flow
```mermaid
flowchart TD
    A[Shopkeeper Creates Shop] --> B{Validate Role}
    B -->|Not Shopkeeper| C[Return Access Denied]
    B -->|Shopkeeper| D[Validate Shop Data]
    D -->|Invalid| E[Return Validation Error]
    D -->|Valid| F[Create Shop]
    F --> G[Link to Owner]
    G --> H[Save to Database]
    H --> I[Return Success Response]
```

## 📁 Project Structure

```
upTimeBackend/
├── Controllers/                 # Business logic handlers
│   ├── User/
│   │   └── userController.js   # User authentication & management
│   ├── Shop/
│   │   └── shopController.js   # Shop CRUD operations
│   └── Appointment/
│       └── appointmentController.js # Appointment management
├── Models/                      # Database schemas
│   ├── User.js                 # User model with JWT methods
│   ├── Shop.js                 # Shop model
│   └── Appointment.js          # Appointment model
├── Middleware/                  # Custom middleware
│   ├── authMiddleware.js       # JWT authentication
│   ├── adminOnly.js            # Admin role validation
│   ├── shopKeeperOnly.js       # Shopkeeper role validation
│   ├── shopValidator.js        # Shop data validation
│   ├── appointmentValidator.js # Appointment data validation
│   └── validateRquest.js       # Request validation handler
├── Routes/                      # API route definitions
│   ├── index.js                # Main router
│   └── api/
│       ├── index.js            # API versioning
│       └── v1/
│           ├── index.js        # V1 route aggregator
│           ├── user.js         # User routes
│           ├── shop.js         # Shop routes
│           └── appointment.js  # Appointment routes
├── db/
│   └── Connect.js              # MongoDB connection
├── index.js                    # Application entry point
├── package.json                # Dependencies & scripts
└── README.md                   # This documentation
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |

## 🧪 Testing

### Manual Testing

1. **Test OTP Flow**
   ```bash
   # Request OTP
   curl -X POST http://localhost:5000/api/v1/user/requestOtp \
     -H "Content-Type: application/json" \
     -d '{"mobile": "1234567890", "role": "user"}'
   
   # Verify OTP (use "123456" as OTP)
   curl -X POST http://localhost:5000/api/v1/user/verifyOtp \
     -H "Content-Type: application/json" \
     -d '{"mobile": "1234567890", "otp": "123456"}'
   ```

2. **Test Shop Creation**
   ```bash
   # Create shop (use token from login)
   curl -X POST http://localhost:5000/api/v1/shop \
     -H "Authorization: Bearer <your-token>" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Salon",
       "contact": "1234567890",
       "type": "salon",
       "address": "Test Address",
       "openingTime": "09:00",
       "closingTime": "18:00"
     }'
   ```

### API Testing Tools
- **Postman**: Import the collection from `docs/postman-collection.json`
- **Insomnia**: Use the provided workspace
- **Thunder Client**: VS Code extension for API testing

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uptime
   JWT_SECRET=your-super-secure-production-secret
   ```

2. **PM2 Deployment**
   ```bash
   npm install -g pm2
   pm2 start index.js --name "uptime-backend"
   pm2 save
   pm2 startup
   ```

3. **Docker Deployment**
   ```bash
   docker build -t uptime-backend .
   docker run -p 5000:5000 uptime-backend
   ```

### Environment-Specific Configurations

| Environment | Database | Logging | CORS |
|-------------|----------|---------|------|
| Development | Local MongoDB | Console | All origins |
| Staging | Staging MongoDB | File | Specific origins |
| Production | Production MongoDB | Cloud logging | Specific origins |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section below

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MONGO_URI in .env
   - Check MongoDB service status
   - Ensure network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Ensure data types match schema

4. **Permission Denied**
   - Verify user role
   - Check middleware order
   - Ensure proper authentication

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team 