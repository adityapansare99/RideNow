# 🚗 RideNow — Backend API Documentation

RideNow is a full-stack ride-hailing platform backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It supports real-time ride tracking, dynamic ML-based fare prediction, OTP verification, Razorpay payments, and a captain rating system.

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| Socket.IO | Real-time communication |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Google Maps API | Coordinates, distance, suggestions |
| Razorpay | Payment gateway |
| Nodemailer (SMTP) | OTP via email |
| Cloudinary | Profile image uploads |
| ML Model | Dynamic fare prediction |

---

## 📁 Project Structure

```
├── controller/
│   ├── captain.controller.js
│   ├── healthcheck.controller.js
│   ├── map.controller.js
│   ├── ride.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── validator.middleware.js
├── model/
│   ├── captain.model.js
│   ├── otp.model.js
│   ├── ride.model.js
│   └── user.model.js
├── route/
│   ├── captain.route.js
│   ├── healthcheck.route.js
│   ├── map.route.js
│   ├── ride.route.js
│   └── user.route.js
├── service/
│   ├── email.service.js
│   ├── map.service.js
│   ├── otpStore.js
│   └── ride.service.js
├── utils/
│   ├── apiError.js
│   ├── apiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── db/
│   └── index.js
├── app.js
├── socket.js
└── index.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
NODE_ENV=development

# MongoDB
dblink=mongodb+srv://<username>:<password>@cluster.mongodb.net/

# JWT
accesstoken=your_access_token_secret
refreshtoken=your_refresh_token_secret
accesstime=15m
refreshtime=7d

# Google Maps
GOOGLE_MAPS_API=your_google_maps_api_key

# Razorpay
RazorPayKey=your_razorpay_key
RazorPaySecretKey=your_razorpay_secret
Currency=INR

# SMTP (email OTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_from_address

# Cloudinary
cloud_name=your_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret

# ML Model
Model_link=your_ml_model_url

# Frontend Url
Fontend_URL=your_frontend_url
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

---

## 🌐 Base URL

```
http://localhost:8000
```

---

## 📦 Response Format

All API responses follow a consistent structure.

### ✅ Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Descriptive success message",
  "data": { }
}
```

### ❌ Error Response
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Descriptive error message",
  "errors": [],
  "data": null
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK — Successful request |
| `201` | Created — Resource successfully created |
| `400` | Bad Request — Invalid or missing input |
| `401` | Unauthorized — Missing or invalid token / wrong credentials |
| `402` | Payment Required — Payment not completed |
| `404` | Not Found — Resource does not exist |
| `409` | Conflict — Resource already exists |
| `500` | Internal Server Error — Server-side failure |
| `502` | Bad Gateway — External service failure (SMTP email, Google Maps, Razorpay) |

---

## 🔐 Authentication

Protected routes require a valid JWT access token passed as:
- **Cookie**: `accesstoken`
- **Header**: `Authorization: Bearer <token>`

> 🔒 = Protected route (requires auth token)

---

---

# 👤 User Endpoints — `/users`

---

## `POST /users/register`

Register a new user account.

**Request Body**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "mobile": "9876543210"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `firstname` | string | ✅ | min 3 characters |
| `lastname` | string | ❌ | min 3 characters |
| `email` | string | ✅ | valid email format |
| `password` | string | ✅ | min 6 characters |
| `mobile` | string | ✅ | 10 digits |

**Success Response `201`**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User created successfully",
  "data": {
    "userData": {
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john@example.com",
      "mobile": "9876543210",
      "_id": "64abc123..."
    },
    "accesstoken": "<JWT>",
    "refreshtoken": "<JWT>"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | All fields are required |
| `409` | User with this email already exists |
| `500` | User registration failed. Please try again |

---

## `POST /users/login`

Authenticate user and receive JWT tokens.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✅ | valid email |
| `password` | string | ✅ | min 6 characters |

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "successfully logged in",
  "data": {
    "user": {
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john@example.com",
      "mobile": "9876543210",
      "_id": "64abc123..."
    },
    "accesstoken": "<JWT>",
    "refreshtoken": "<JWT>"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | All fields are required |
| `404` | User not found |
| `401` | Invalid credentials. Please check your password |

---

## `POST /users/logout` 🔒

Logout user and clear auth cookies.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "logged out successfully",
  "data": {}
}
```

---

## `GET /users/profile` 🔒

Get the authenticated user's profile.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User profile",
  "data": {
    "user": {
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john@example.com",
      "mobile": "9876543210",
      "_id": "64abc123..."
    }
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `401` | Access token is missing |
| `404` | User profile not found |

---

## `PUT /users/edit-profile` 🔒

Update user's personal details and profile picture. Accepts `multipart/form-data`.

**Request Body**

| Field | Type | Required |
|-------|------|----------|
| `firstname` | string | ✅ |
| `lastname` | string | ✅ |
| `password` | string | ❌ |
| `image` | file | ❌ |

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "fullname": { "firstname": "John", "lastname": "Updated" },
    "email": "john@example.com"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | All fields are required |
| `404` | User not found |
| `502` | Failed to upload image. Please try again |

---

## `DELETE /users/delete-user` 🔒

Permanently delete the authenticated user's account.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `500` | Failed to delete user account. Please try again |

---

## `GET /users/ride-history` 🔒

Get all past rides for the authenticated user. Each completed ride also includes the captain's average rating.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride history retrieved successfully",
  "data": [
    {
      "_id": "64ride123...",
      "pickup": "Shivaji Nagar, Pune",
      "destination": "Hinjewadi, Pune",
      "fare": 250.00,
      "status": "completed",
      "captain": { "fullname": { "firstname": "Raj" }, "vehicle": {} },
      "captainAverageRating": {
        "avgRating": 4.5,
        "count": 28
      },
      "createdAt": "2024-01-01T09:00:00.000Z"
    }
  ]
}
```

> `captainAverageRating` is included only for `completed` rides.

---

## `POST /users/Generate-otp`

Send a 6-digit OTP to the given email address via SMTP (nodemailer). OTP is valid for **5 minutes**.

**Request Body**
```json
{
  "email": "user@example.com"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP sent successfully to your email",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | A valid email address is required |
| `502` | Failed to send OTP. Please try again later |

---

## `POST /users/verify-otp`

Verify the OTP sent to the user's email address.

**Request Body**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP verified successfully",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Email and OTP are required |
| `400` | Invalid or expired OTP. Please request a new one |

---

## `POST /users/refresh-token`

Refresh the access token using a valid refresh token.

**Request Body**
```json
{
  "refreshtoken": "<refresh_JWT>"
}
```

> Can also be passed via cookie `refreshtoken`.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "access token successful",
  "data": {
    "accesstoken": "<new_JWT>",
    "refreshtoken": "<new_JWT>"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `401` | Refresh token is missing |
| `401` | Refresh token is invalid or expired |
| `404` | User not found |

---

## `POST /users/captain-rating` 🔒

Get the average rating of a specific captain by their ID.

**Request Body**
```json
{
  "captainId": "64cap123..."
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Driver rating retrieved successfully",
  "data": {
    "avgRating": 4.5,
    "count": 28
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Captain not found |

---

---

# 🚕 Captain Endpoints — `/captains`

---

## `POST /captains/register`

Register a new captain account with vehicle details.

**Request Body**
```json
{
  "fullname": {
    "firstname": "Raj",
    "lastname": "Kumar"
  },
  "email": "raj@example.com",
  "password": "secret123",
  "mobile": "9876543210",
  "vehicle": {
    "color": "Black",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicletype": "car"
  }
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullname.firstname` | string | ✅ | min 3 characters |
| `fullname.lastname` | string | ❌ | min 3 characters |
| `email` | string | ✅ | valid email |
| `password` | string | ✅ | min 6 characters |
| `mobile` | string | ✅ | 10 digits |
| `vehicle.color` | string | ✅ | min 3 characters |
| `vehicle.plate` | string | ✅ | min 3 characters |
| `vehicle.capacity` | number | ✅ | min 1 |
| `vehicle.vehicletype` | string | ✅ | `car`, `auto`, `moto` |

**Success Response `201`**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "captain registered successfully",
  "data": {
    "captain": {
      "fullname": { "firstname": "Raj", "lastname": "Kumar" },
      "email": "raj@example.com",
      "mobile": "9876543210",
      "vehicle": { "color": "Black", "plate": "MH12AB1234", "capacity": 4, "vehicletype": "car" },
      "status": "inactive",
      "_id": "64cap123..."
    },
    "accesstoken": "<JWT>",
    "refreshtoken": "<JWT>"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `409` | Captain with this email already exists |
| `500` | Captain registration failed. Please try again |

---

## `POST /captains/login`

Authenticate captain and receive JWT tokens.

**Request Body**
```json
{
  "email": "raj@example.com",
  "password": "secret123"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "successfully logged in",
  "data": {
    "captain": {
      "fullname": { "firstname": "Raj", "lastname": "Kumar" },
      "email": "raj@example.com",
      "status": "inactive",
      "vehicle": { "color": "Black", "plate": "MH12AB1234", "capacity": 4, "vehicletype": "car" },
      "_id": "64cap123..."
    },
    "accesstoken": "<JWT>",
    "refreshtoken": "<JWT>"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | No captain found with this email |
| `401` | Invalid credentials. Please check your password |

---

## `POST /captains/logout` 🔒

Logout captain and clear auth cookies.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "logged out successfully",
  "data": {}
}
```

---

## `GET /captains/profile` 🔒

Get the authenticated captain's profile.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Captain profile fetched successfully",
  "data": {
    "captainData": {
      "fullname": { "firstname": "Raj", "lastname": "Kumar" },
      "email": "raj@example.com",
      "status": "inactive",
      "vehicle": { "color": "Black", "plate": "MH12AB1234", "capacity": 4, "vehicletype": "car" },
      "profilepic": "https://cloudinary.com/...",
      "_id": "64cap123..."
    }
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `401` | Access token is missing |
| `404` | Captain profile not found |

---

## `GET /captains/history` 🔒

Get captain's cumulative ride stats — total distance, time, and earnings — calculated directly from completed rides using MongoDB aggregation.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Captain stats fetched successfully",
  "data": {
    "totalDist": 124.5,
    "totalTime": 3.2,
    "totalEarning": 2450.00
  }
}
```

> `totalDist` in **km** | `totalTime` in **hours** | `totalEarning` in **₹**

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | Captain not found |

---

## `GET /captains/average-rating` 🔒

Get the captain's average rating calculated from all rated rides.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Average rating calculated successfully",
  "data": {
    "avgRating": 4.5,
    "count": 28
  }
}
```

> `avgRating` — cumulative average of all ratings received
> `count` — total number of rated rides

**Error Responses**

| Status | Message |
|--------|---------|
| `401` | Captain not found in request |

---

## `GET /captains/ride-history` 🔒

Get all past rides for the authenticated captain.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride history found",
  "data": [
    {
      "_id": "64ride123...",
      "pickup": "Shivaji Nagar, Pune",
      "destination": "Hinjewadi, Pune",
      "fare": 250.00,
      "status": "completed",
      "user": { "fullname": { "firstname": "John" } },
      "createdAt": "2024-01-01T09:00:00.000Z"
    }
  ]
}
```

---

## `PUT /captains/edit-profile` 🔒

Update captain's personal and vehicle details. Accepts `multipart/form-data`.

**Request Body**

| Field | Type | Required |
|-------|------|----------|
| `firstname` | string | ✅ |
| `lastname` | string | ✅ |
| `password` | string | ❌ |
| `vehicleColor` | string | ❌ |
| `vehicleType` | string | ❌ |
| `vehiclePlate` | string | ❌ |
| `vehicleCapacity` | number | ❌ |
| `profilepic` | file | ❌ |

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile updated successfully",
  "data": { }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `404` | Captain not found |
| `502` | Failed to upload profile picture. Please try again |

---

## `DELETE /captains/delete-captain` 🔒

Permanently delete the authenticated captain's account.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Captain account deleted successfully",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `500` | Failed to delete captain account. Please try again |

---

## `POST /captains/Generate-otp`

Send a 6-digit OTP to the captain's email address via SMTP (nodemailer). OTP is valid for **5 minutes**.

**Request Body**
```json
{
  "email": "captain@example.com"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP sent successfully to your email",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | A valid email address is required |
| `502` | Failed to send OTP. Please try again later |

---

## `POST /captains/verify-otp`

Verify the OTP sent to the captain's email address.

**Request Body**
```json
{
  "email": "captain@example.com",
  "otp": "123456"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP verified successfully",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Email and OTP are required |
| `400` | Invalid or expired OTP. Please request a new one |

---

---

# 🗺️ Map Endpoints — `/maps`

> All map endpoints require authentication 🔒

---

## `GET /maps/get-coordinates` 🔒

Get latitude and longitude for a given address using Google Maps Geocoding API.

**Query Parameters**

| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `address` | string | ✅ | min 3 characters |

**Example Request**
```
GET /maps/get-coordinates?address=Shivaji+Nagar,+Pune
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Coordinates fetched successfully",
  "data": {
    "ltd": 18.5204,
    "lng": 73.8567
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | No coordinates found for the given address |
| `502` | Unable to fetch coordinates from Maps API |

---

## `GET /maps/get-distance-time` 🔒

Get distance and travel time between two locations using Google Maps Distance Matrix API.

**Query Parameters**

| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `origin` | string | ✅ | min 3 characters |
| `destination` | string | ✅ | min 3 characters |

**Example Request**
```
GET /maps/get-distance-time?origin=Pune&destination=Mumbai
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Distance and time fetched successfully",
  "data": {
    "distance": 148000,
    "time": 9000
  }
}
```

> `distance` in **meters** | `time` in **seconds**

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | Unable to fetch distance and time for the given route |
| `502` | Unable to fetch distance and time from Maps API |

---

## `GET /maps/get-suggestions` 🔒

Get autocomplete address suggestions using Google Maps Places API.

**Query Parameters**

| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `input` | string | ✅ | min 3 characters |

**Example Request**
```
GET /maps/get-suggestions?input=Koregaon
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Suggestions fetched successfully",
  "data": [
    "Koregaon Park, Pune, Maharashtra, India",
    "Koregaon, Satara, Maharashtra, India"
  ]
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Search input is required |
| `404` | No suggestions found for the given input |
| `502` | Unable to fetch suggestions from Maps API |

---

---

# 🛺 Ride Endpoints — `/rides`

---

## `POST /rides/create-ride` 🔒 (User)

Create a new ride request. Notifies nearby captains via Socket.IO.

**Request Body**
```json
{
  "pickup": "Shivaji Nagar, Pune",
  "destination": "Hinjewadi, Pune",
  "vehicleType": "car"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `pickup` | string | ✅ | min 3 characters |
| `destination` | string | ✅ | min 3 characters |
| `vehicleType` | string | ✅ | `car`, `auto`, `moto` |

**Success Response `201`**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Ride created successfully",
  "data": {
    "_id": "64ride123...",
    "user": "64abc123...",
    "pickup": "Shivaji Nagar, Pune",
    "destination": "Hinjewadi, Pune",
    "fare": 250.00,
    "status": "pending",
    "duration": 1800,
    "distance": 15000
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | Unable to find coordinates for the pickup location |
| `500` | Unable to create ride. Please try again |

---

## `GET /rides/get-fare` 🔒 (User)

Get fare estimates for all vehicle types between two locations. Uses ML model for prediction with formula-based fallback.

**Query Parameters**

| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `pickup` | string | ✅ | min 3 characters |
| `destination` | string | ✅ | min 3 characters |

**Example Request**
```
GET /rides/get-fare?pickup=Shivaji+Nagar&destination=Hinjewadi
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Fare fetched successfully",
  "data": {
    "auto": 180.50,
    "car": 250.00,
    "moto": 120.00
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | Unable to calculate fare for the given route |

---

## `POST /rides/confirm` 🔒 (Captain)

Captain accepts a pending ride. Notifies the user and other nearby captains via Socket.IO.

**Request Body**
```json
{
  "rideId": "64ride123..."
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride confirmed successfully",
  "data": {
    "_id": "64ride123...",
    "status": "accepted",
    "captain": { },
    "user": { }
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | Ride not found |
| `500` | Unable to confirm ride. Please try again |

---

## `GET /rides/start-ride` 🔒 (Captain)

Start an accepted ride after verifying the user's OTP. Notifies the user via Socket.IO.

**Query Parameters**

| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `rideId` | string | ✅ | valid MongoDB ID |
| `otp` | string | ✅ | exactly 6 digits |

**Example Request**
```
GET /rides/start-ride?rideId=64ride123...&otp=482910
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride started successfully",
  "data": {
    "_id": "64ride123...",
    "status": "ongoing",
    "captain": { },
    "user": { }
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `400` | Invalid OTP. Please try again |
| `400` | Ride has not been accepted yet |
| `404` | Ride not found |
| `500` | Unable to start ride. Please try again |

---

## `POST /rides/end-ride` 🔒 (Captain)

End an ongoing ride. Notifies the user via Socket.IO.

**Request Body**
```json
{
  "rideId": "64ride123..."
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride ended successfully",
  "data": {
    "_id": "64ride123...",
    "status": "completed"
  }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `400` | Ride is not ongoing |
| `404` | Ride not found |
| `500` | Unable to end ride. Please try again |

---

## `POST /rides/cancel-ride` 🔒 (Captain)

Cancel a pending or accepted ride. Notifies the user via Socket.IO.

**Request Body**
```json
{
  "rideId": "64ride123..."
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride cancelled successfully",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Ride ID is required |
| `404` | Ride not found |
| `500` | Unable to cancel ride. Please try again |

---

## `POST /rides/rate` 🔒 (User)

Submit a star rating for a completed ride. Rating contributes to the captain's cumulative average.

**Request Body**
```json
{
  "rideId": "64ride123...",
  "rating": 4.5
}
```

| Field | Type | Required |
|-------|------|----------|
| `rideId` | string | ✅ |
| `rating` | number | ✅ |

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Rating submitted successfully",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Ride ID and rating are required |
| `500` | Unable to submit rating. Please try again |

---

## `POST /rides/ride-status` 🔒 (User)

Get the current status of a specific ride.

**Request Body**
```json
{
  "rideId": "64ride123..."
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride status fetched successfully",
  "data": "ongoing"
}
```

> Possible status values: `pending` | `accepted` | `ongoing` | `completed` | `cancelled`

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Ride ID is required |
| `404` | Ride not found |

---

## `POST /rides/makepayment` 🔒 (User)

Create a Razorpay payment order for a completed ride.

**Request Body**
```json
{
  "rideId": "64ride123..."
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "id": "order_xyz123",
    "amount": 25000,
    "currency": "INR",
    "receipt": "64ride123..."
  }
}
```

> `amount` is in **paise** (1 INR = 100 paise)

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Ride ID is required |
| `404` | Ride not found |
| `502` | Payment gateway error. Please try again later |

---

## `POST /rides/verifypayment` 🔒 (User)

Verify Razorpay payment status and update ride's payment record.

**Request Body**
```json
{
  "order_id": "order_xyz123"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Payment verified successfully",
  "data": { }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Order ID is required |
| `402` | Payment not completed. Please try again |
| `404` | Payment order not found |

---

---

# ❤️ Health Check

## `GET /`

Check if the server is up and running.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Server Running Fine",
  "data": {}
}
```

---

---

# 🔌 Socket.IO Events

The server uses **Socket.IO** for real-time communication between users and captains.

## Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ userId, userType: "user" \| "captain" }` | Register socket ID when user/captain connects |
| `update-location-captain` | `{ userId, location: { ltd, lng } }` | Captain updates their idle location |
| `update-captain-location-ride` | `{ userId, location: { ltd, lng }, rideId }` | Captain updates location during an active ride — user receives live tracking |

## Server → Client

| Event | Sent To | Description |
|-------|---------|-------------|
| `new-ride` | Nearby captains | New ride request is available |
| `ride-confirmed` | User | Captain has accepted the ride |
| `ride-started` | User | Captain has started the ride |
| `ride-ended` | User | Ride has been completed |
| `ride-cancelled` | User | Ride has been cancelled |
| `ride-already-confirmed` | Other captains | Ride was taken by another captain |
| `captain-location-update` | User | Captain's live location update during ride |
| `error` | Requester | Socket operation failed |

---

---

---

# 📋 Data Models

## User Model
```json
{
  "_id": "64abc123...",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "<hashed - bcrypt>",
  "mobile": "9876543210",
  "image": "<cloudinary_url or base64 default>",
  "socketId": "abc123...",
  "refreshtoken": "<JWT>",
  "createdAt": "2024-01-01T09:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullname.firstname` | string | ✅ | min 3 characters |
| `fullname.lastname` | string | ❌ | min 3 characters |
| `email` | string | ✅ | unique |
| `password` | string | ✅ | bcrypt hashed |
| `mobile` | string | ✅ | unique |
| `image` | string | ❌ | Cloudinary URL, has default avatar |
| `socketId` | string | ❌ | updated on socket connect |
| `refreshtoken` | string | ❌ | cleared on logout |

---

## Captain Model
```json
{
  "_id": "64cap123...",
  "fullname": {
    "firstname": "Raj",
    "lastname": "Kumar"
  },
  "email": "raj@example.com",
  "password": "<hashed - bcrypt>",
  "mobile": "9876543210",
  "status": "inactive",
  "profilepic": "<cloudinary_url or base64 default>",
  "socketId": "xyz456...",
  "refreshtoken": "<JWT>",
  "vehicle": {
    "color": "Black",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicletype": "car"
  },
  "location": {
    "ltd": 18.5204,
    "lng": 73.8567
  },
  "createdAt": "2024-01-01T09:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullname.firstname` | string | ✅ | min 3 characters |
| `fullname.lastname` | string | ✅ | min 3 characters |
| `email` | string | ✅ | unique, lowercase |
| `password` | string | ✅ | bcrypt hashed |
| `mobile` | string | ✅ | unique |
| `status` | string | ❌ | `active` or `inactive`, default `inactive` |
| `profilepic` | string | ❌ | Cloudinary URL, has default avatar |
| `socketId` | string | ❌ | updated on socket connect |
| `vehicle.color` | string | ✅ | min 3 characters |
| `vehicle.plate` | string | ✅ | min 3 characters |
| `vehicle.capacity` | number | ✅ | min 1 |
| `vehicle.vehicletype` | string | ✅ | `car`, `auto`, `moto` |
| `location.ltd` | number | ❌ | updated via socket |
| `location.lng` | number | ❌ | updated via socket |
| `refreshtoken` | string | ❌ | cleared on logout |

---

## Ride Model
```json
{
  "_id": "64ride123...",
  "user": "64abc123...",
  "captain": "64cap123...",
  "pickup": "Shivaji Nagar, Pune",
  "destination": "Hinjewadi, Pune",
  "fare": 250.00,
  "status": "completed",
  "duration": 1800,
  "distance": 15000,
  "paymentID": "pay_xyz...",
  "orderID": "order_xyz...",
  "signature": "...",
  "paymentStatus": false,
  "rating": 4.5,
  "isRated": true,
  "rateTime": "2024-01-01T10:00:00.000Z",
  "otp": "<hidden - select: false>",
  "createdAt": "2024-01-01T09:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user` | ObjectId | ✅ | ref: User |
| `captain` | ObjectId | ❌ | ref: Captain, set on confirm |
| `pickup` | string | ✅ | |
| `destination` | string | ✅ | |
| `fare` | number | ✅ | in ₹ |
| `status` | string | ❌ | `pending`, `accepted`, `ongoing`, `completed`, `cancelled` |
| `duration` | number | ❌ | in seconds |
| `distance` | number | ❌ | in meters |
| `paymentID` | string | ❌ | Razorpay payment ID |
| `orderID` | string | ❌ | Razorpay order ID |
| `paymentStatus` | boolean | ❌ | default `false` |
| `rating` | number | ❌ | default `0` |
| `isRated` | boolean | ❌ | default `false` |
| `rateTime` | Date | ❌ | when rating was submitted |
| `otp` | string | ✅ | hidden from responses by default |

**Ride Status Flow**
```
pending → accepted → ongoing → completed
                  ↘ cancelled
```

---

## Notes

- All timestamps follow **ISO 8601** format
- `distance` is always in **meters**, `time`/`duration` in **seconds**
- `totalDist` in captain stats is in **km**, `totalTime` in **hours**
- Fare amounts are in **INR (₹)**
- Payment `amount` from Razorpay is in **paise** (multiply fare × 100)
- OTP is valid for **5 minutes** and hashed before storage
- Captain stats are computed via MongoDB aggregation on the `Ride` collection
- Ride history includes captain's average rating for completed/ongoing rides
