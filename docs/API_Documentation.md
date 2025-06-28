# upTime Backend - API Documentation

## 📋 Overview

This document provides comprehensive API documentation for the upTime Backend service. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:5000/api/v1`

## 🔐 Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "token": "jwt-token" // Only for auth endpoints
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 👤 User Management

### 1. Request OTP

**Endpoint**: `POST /user/requestOtp`

**Description**: Request an OTP for mobile number verification

**Request Body**:
```json
{
  "mobile": "1234567890",
  "role": "user" // "user", "shopkeeper", or "admin"
}
```

**Response**:
```json
{
  "message": "OTP sent"
}
```

**Status Codes**:
- `200`: OTP sent successfully
- `400`: Mobile number missing or invalid role
- `500`: Server error

---

### 2. Verify OTP & Login

**Endpoint**: `POST /user/verifyOtp`

**Description**: Verify OTP and complete login process

**Request Body**:
```json
{
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "mobile": "1234567890",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Login successful
- `400`: Invalid or expired OTP
- `500`: Server error

---

### 3. Logout

**Endpoint**: `POST /user/logout`

**Description**: Logout user and invalidate current session

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200`: Logout successful
- `401`: Unauthorized
- `500`: Server error

---

### 4. Get All Users (Admin Only)

**Endpoint**: `GET /user/all`

**Description**: Retrieve all users with pagination (Admin only)

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response**:
```json
{
  "page": 1,
  "limit": 10,
  "totalUsers": 25,
  "totalPages": 3,
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "mobile": "1234567890",
      "role": "user",
      "isVerified": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Users retrieved successfully
- `401`: Unauthorized
- `403`: Access denied (Admin only)
- `500`: Server error

## 🏪 Shop Management

### 1. Create Shop (Shopkeeper Only)

**Endpoint**: `POST /shop`

**Description**: Create a new shop (Shopkeeper only)

**Headers**:
```
Authorization: Bearer <shopkeeper-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Beauty Salon",
  "contact": "1234567890",
  "type": "salon",
  "address": "123 Main Street, City, State",
  "openingTime": "09:00",
  "closingTime": "18:00",
  "slotDuration": 30
}
```

**Field Descriptions**:
- `name`: Shop name (required)
- `contact`: Contact number (required, must be valid mobile)
- `type`: Shop type - "clinic", "salon", "parlor", "other" (required)
- `address`: Shop address (required)
- `openingTime`: Opening time in HH:MM format (required)
- `closingTime`: Closing time in HH:MM format (required)
- `slotDuration`: Appointment slot duration in minutes (optional, default: 30)

**Response**:
```json
{
  "message": "Shop created successfully",
  "shop": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Beauty Salon",
    "contact": "1234567890",
    "type": "salon",
    "address": "123 Main Street, City, State",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "openingTime": "09:00",
    "closingTime": "18:00",
    "slotDuration": 30,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Status Codes**:
- `201`: Shop created successfully
- `400`: Validation error
- `401`: Unauthorized
- `403`: Access denied (Shopkeeper only)
- `500`: Server error

---

### 2. Get All Shops

**Endpoint**: `GET /shop`

**Description**: Retrieve all shops with filtering and pagination

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `type` (optional): Filter by shop type
- `owner` (optional): Filter by owner ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response**:
```json
{
  "page": 1,
  "limit": 10,
  "totalShops": 15,
  "totalPages": 2,
  "shops": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Beauty Salon",
      "contact": "1234567890",
      "type": "salon",
      "address": "123 Main Street, City, State",
      "owner": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe"
      },
      "openingTime": "09:00",
      "closingTime": "18:00",
      "slotDuration": 30,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Shops retrieved successfully
- `401`: Unauthorized
- `500`: Server error

---

### 3. Get Shop by ID

**Endpoint**: `GET /shop/:id`

**Description**: Retrieve a specific shop by ID

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "shop": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Beauty Salon",
    "contact": "1234567890",
    "type": "salon",
    "address": "123 Main Street, City, State",
    "owner": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe"
    },
    "openingTime": "09:00",
    "closingTime": "18:00",
    "slotDuration": 30,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Shop retrieved successfully
- `401`: Unauthorized
- `404`: Shop not found
- `500`: Server error

---

### 4. Update Shop (Shopkeeper Only)

**Endpoint**: `PUT /shop/:id`

**Description**: Update shop details (Shopkeeper only)

**Headers**:
```
Authorization: Bearer <shopkeeper-token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "Updated Salon Name",
  "contact": "9876543210",
  "type": "parlor",
  "address": "456 New Street, City, State",
  "openingTime": "10:00",
  "closingTime": "19:00",
  "slotDuration": 45
}
```

**Response**:
```json
{
  "message": "Shop updated successfully",
  "shop": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Updated Salon Name",
    "contact": "9876543210",
    "type": "parlor",
    "address": "456 New Street, City, State",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "openingTime": "10:00",
    "closingTime": "19:00",
    "slotDuration": 45,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Shop updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `403`: Access denied (Shopkeeper only)
- `404`: Shop not found
- `500`: Server error

---

### 5. Delete Shop (Admin Only)

**Endpoint**: `DELETE /shop/:id`

**Description**: Delete a shop (Admin only)

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "message": "Shop deleted successfully"
}
```

**Status Codes**:
- `200`: Shop deleted successfully
- `401`: Unauthorized
- `403`: Access denied (Admin only)
- `404`: Shop not found
- `500`: Server error

---

### 6. Get Shops by Owner

**Endpoint**: `GET /shop/owner/:ownerId`

**Description**: Retrieve all shops owned by a specific user

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Beauty Salon",
    "contact": "1234567890",
    "type": "salon",
    "address": "123 Main Street, City, State",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "openingTime": "09:00",
    "closingTime": "18:00",
    "slotDuration": 30,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

**Status Codes**:
- `200`: Shops retrieved successfully
- `401`: Unauthorized
- `500`: Server error

---

### 7. Search Shops

**Endpoint**: `GET /shop/search/query`

**Description**: Search shops by name or type

**Query Parameters**:
- `query` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response**:
```json
{
  "query": "salon",
  "page": 1,
  "limit": 10,
  "totalResults": 5,
  "totalPages": 1,
  "shops": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Beauty Salon",
      "contact": "1234567890",
      "type": "salon",
      "address": "123 Main Street, City, State",
      "owner": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe"
      },
      "openingTime": "09:00",
      "closingTime": "18:00",
      "slotDuration": 30,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Search completed successfully
- `400`: Search query required
- `500`: Server error

## 📅 Appointment Management

### 1. Create Appointment

**Endpoint**: `POST /appointment`

**Description**: Book a new appointment

**Headers**:
```
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "shop": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2024-01-20T10:00:00.000Z",
  "timeSlot": "10:00-10:30"
}
```

**Field Descriptions**:
- `shop`: Shop ID (required, must be valid MongoDB ObjectId)
- `date`: Appointment date in ISO 8601 format (required)
- `timeSlot`: Time slot in HH:MM-HH:MM format (required)

**Response**:
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "user": "60f7b3b3b3b3b3b3b3b3b3b3",
    "shop": "60f7b3b3b3b3b3b3b3b3b3b3",
    "date": "2024-01-20T10:00:00.000Z",
    "timeSlot": "10:00-10:30",
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Status Codes**:
- `201`: Appointment created successfully
- `400`: Validation error
- `401`: Unauthorized
- `409`: Time slot already booked
- `500`: Server error

---

### 2. Get Appointments by Shop

**Endpoint**: `GET /appointment/:shopId`

**Description**: Retrieve all appointments for a specific shop

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): Filter by appointment status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response**:
```json
{
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "user": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "mobile": "1234567890"
      },
      "shop": "60f7b3b3b3b3b3b3b3b3b3b3",
      "date": "2024-01-20T10:00:00.000Z",
      "timeSlot": "10:00-10:30",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Appointments retrieved successfully
- `401`: Unauthorized
- `500`: Server error

---

### 3. Update Appointment Status (Shopkeeper Only)

**Endpoint**: `PATCH /appointment/:id/status`

**Description**: Update appointment status (Shopkeeper only)

**Headers**:
```
Authorization: Bearer <shopkeeper-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "status": "confirmed"
}
```

**Valid Status Values**:
- `pending`: Initial status
- `confirmed`: Appointment confirmed
- `cancelled`: Appointment cancelled
- `completed`: Appointment completed

**Response**:
```json
{
  "message": "Appointment confirmed successfully",
  "appointment": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "user": "60f7b3b3b3b3b3b3b3b3b3b3",
    "shop": "60f7b3b3b3b3b3b3b3b3b3b3",
    "date": "2024-01-20T10:00:00.000Z",
    "timeSlot": "10:00-10:30",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Status updated successfully
- `400`: Invalid status or past appointment
- `401`: Unauthorized
- `403`: Access denied (Shopkeeper only)
- `404`: Appointment not found
- `500`: Server error

## 🚨 Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `200` | Success | - |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input data, validation errors |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | Insufficient permissions for the operation |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource conflict (e.g., time slot already booked) |
| `422` | Unprocessable Entity | Validation errors in request body |
| `500` | Internal Server Error | Server-side error |

## 📝 Validation Rules

### User Validation
- `mobile`: Required, must be valid mobile number
- `role`: Required, must be "user", "shopkeeper", or "admin"

### Shop Validation
- `name`: Required, non-empty string
- `contact`: Required, valid mobile number
- `type`: Required, must be "clinic", "salon", "parlor", or "other"
- `address`: Required, non-empty string
- `openingTime`: Required, HH:MM format
- `closingTime`: Required, HH:MM format
- `slotDuration`: Optional, positive integer

### Appointment Validation
- `shop`: Required, valid MongoDB ObjectId
- `date`: Required, valid ISO 8601 date
- `timeSlot`: Required, non-empty string
- `status`: Optional, must be "pending", "confirmed", "cancelled", or "completed"

## 🔄 Rate Limiting

Currently, the API doesn't implement rate limiting. Consider implementing rate limiting for production use.

## 📊 Pagination

All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "page": 1,
  "limit": 10,
  "totalItems": 100,
  "totalPages": 10,
  "data": [...]
}
```

---

**Last Updated**: January 2024  
**API Version**: v1  
**Documentation Version**: 1.0.0 