# RideNow Backend API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Most endpoints require a JWT access token. Pass it either as:
- Cookie: `accesstoken`
- Header: `Authorization: Bearer <token>`

---

## Response Format

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Descriptive success message",
  "data": { }
}
```

### Error Response
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

## Status Codes Used

| Code | Meaning |
|------|---------|
| `200` | OK — successful GET, PUT, DELETE |
| `201` | Created — successful POST that creates a resource |
| `400` | Bad Request — invalid or missing input |
| `401` | Unauthorized — missing or invalid token / wrong credentials |
| `402` | Payment Required — payment not completed |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — resource already exists (e.g. duplicate email) |
| `500` | Internal Server Error — server-side failure |
| `502` | Bad Gateway — external service failure (Twilio, Google Maps, Razorpay) |

---

## User Endpoints `/users`

---

### `POST /users/register`
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

| Field | Type | Required | Rules |
|-------|------|----------|-------|
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
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "mobile": "9876543210",
    "_id": "64abc123..."
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

### `POST /users/login`
Authenticate user and receive tokens.

**Request Body**
```json
{
  "email": "john@example.com",
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
    "user": {
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john@example.com",
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

### `GET /users/profile` 🔒
Get authenticated user's profile.

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

### `POST /users/logout` 🔒
Logout user and clear tokens.

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

### `PUT /users/edit-profile` 🔒
Update user profile. Accepts `multipart/form-data` for image upload.

**Request Body**
```json
{
  "firstname": "John",
  "lastname": "Updated",
  "password": "newpassword123"
}
```

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
  "data": { }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | All fields are required |
| `404` | User not found |
| `502` | Failed to upload image. Please try again |

---

### `DELETE /users/delete-user` 🔒
Permanently delete user account.

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

### `GET /users/ride-history` 🔒
Get all past rides for the authenticated user.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride history retrieved successfully",
  "data": [ ]
}
```

---

### `POST /users/Generate-otp`
Send OTP to user's mobile number.

**Request Body**
```json
{
  "mobile": "9876543210"
}
```

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP sent successfully to your mobile number",
  "data": null
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | A valid 10-digit mobile number is required |
| `502` | Failed to send OTP. Please try again later |

---

### `POST /users/verify-otp`
Verify the OTP sent to user's mobile.

**Request Body**
```json
{
  "mobile": "9876543210",
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
| `400` | Mobile number and OTP are required |
| `400` | Invalid or expired OTP. Please request a new one |

---

## Captain Endpoints `/captains`

---

### `POST /captains/register`
Register a new captain account.

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

| Field | Type | Required | Rules |
|-------|------|----------|-------|
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
  "message": "Captain registered successfully",
  "data": {
    "captain": { },
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

### `POST /captains/login`
Authenticate captain and receive tokens.

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
  "message": "Captain logged in successfully",
  "data": {
    "captain": { },
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

### `GET /captains/profile` 🔒
Get authenticated captain's profile.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Captain profile fetched successfully",
  "data": {
    "captain": {
      "fullname": { "firstname": "Raj", "lastname": "Kumar" },
      "email": "raj@example.com",
      "status": "inactive",
      "vehicle": { "color": "Black", "plate": "MH12AB1234", "capacity": 4, "vehicletype": "car" },
      "_id": "64abc123..."
    }
  }
}
```

---

### `POST /captains/logout` 🔒
Logout captain and clear tokens.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Captain logged out successfully",
  "data": {}
}
```

---

### `GET /captains/history` 🔒
Get captain's total ride stats.

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

---

### `GET /captains/ride-history` 🔒
Get all past rides for the authenticated captain.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride history fetched successfully",
  "data": [ ]
}
```

---

### `PUT /captains/edit-profile` 🔒
Update captain profile. Accepts `multipart/form-data`.

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

---

### `DELETE /captains/delete-captain` 🔒
Permanently delete captain account.

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Captain account deleted successfully",
  "data": null
}
```

---

### `POST /captains/Generate-otp`
Send OTP to captain's mobile number.

**Request Body**
```json
{
  "mobile": "9876543210"
}
```

**Success Response `200`** — same as user OTP endpoint.

---

### `POST /captains/verify-otp`
Verify OTP for captain's mobile.

**Request Body**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Success Response `200`** — same as user OTP endpoint.

---

## Map Endpoints `/maps` 🔒

All map endpoints require authentication.

---

### `GET /maps/get-coordinates`
Get latitude and longitude for a given address.

**Query Parameters**

| Param | Type | Required | Rules |
|-------|------|----------|-------|
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

### `GET /maps/get-distance-time`
Get distance and travel time between two locations.

**Query Parameters**

| Param | Type | Required | Rules |
|-------|------|----------|-------|
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

> `distance` is in **meters**, `time` is in **seconds**

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | Unable to fetch distance and time for the given route |
| `502` | Unable to fetch distance and time from Maps API |

---

### `GET /maps/get-suggestions`
Get autocomplete address suggestions.

**Query Parameters**

| Param | Type | Required | Rules |
|-------|------|----------|-------|
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

## Ride Endpoints `/rides`

---

### `POST /rides/create-ride` 🔒 (User)
Create a new ride request.

**Request Body**
```json
{
  "pickup": "Shivaji Nagar, Pune",
  "destination": "Hinjewadi, Pune",
  "vehicleType": "car"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
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
    "user": "64abc123...",
    "pickup": "Shivaji Nagar, Pune",
    "destination": "Hinjewadi, Pune",
    "fare": 250.00,
    "status": "pending",
    "duration": 1800,
    "distance": 15000,
    "_id": "64ride123..."
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

### `GET /rides/get-fare` 🔒 (User)
Get fare estimates for all vehicle types.

**Query Parameters**

| Param | Type | Required | Rules |
|-------|------|----------|-------|
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

### `POST /rides/confirm` 🔒 (Captain)
Captain confirms and accepts a ride.

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
  "data": { }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `404` | Ride not found |
| `500` | Unable to confirm ride. Please try again |

---

### `GET /rides/start-ride` 🔒 (Captain)
Start a ride after OTP verification.

**Query Parameters**

| Param | Type | Required | Rules |
|-------|------|----------|-------|
| `rideId` | string | ✅ | valid MongoDB ID |
| `otp` | string | ✅ | exactly 6 digits |

**Success Response `200`**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Ride started successfully",
  "data": { }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Validation failed |
| `400` | Invalid OTP. Please try again |
| `400` | Ride has not been accepted yet |
| `404` | Ride not found |

---

### `POST /rides/end-ride` 🔒 (Captain)
End an ongoing ride.

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
  "data": { }
}
```

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Ride is not ongoing |
| `404` | Ride not found |
| `500` | Unable to end ride. Please try again |

---

### `POST /rides/cancel-ride` 🔒 (Captain)
Cancel a pending or accepted ride.

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

### `POST /rides/makepayment` 🔒 (User)
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

**Error Responses**

| Status | Message |
|--------|---------|
| `400` | Ride ID is required |
| `404` | Ride not found |
| `502` | Payment gateway error. Please try again later |

---

### `POST /rides/verifypayment` 🔒 (User)
Verify Razorpay payment status and update ride.

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

## Health Check

### `GET /`
Check if the server is running.

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

## Socket Events

The server uses **Socket.IO** for real-time communication.

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ userId, userType: "user" \| "captain" }` | Register socket connection |
| `update-location-captain` | `{ userId, location: { ltd, lng } }` | Update captain location |
| `update-captain-location-ride` | `{ userId, location: { ltd, lng }, rideId }` | Update captain location during active ride |

### Server → Client

| Event | Description |
|-------|-------------|
| `new-ride` | Sent to captains when a new ride is created nearby |
| `ride-confirmed` | Sent to user when captain accepts the ride |
| `ride-started` | Sent to user when captain starts the ride |
| `ride-ended` | Sent to user when ride is completed |
| `ride-cancelled` | Sent to user when ride is cancelled |
| `ride-already-confirmed` | Sent to other captains when ride is taken |
| `captain-location-update` | Sent to user with captain's live location during ride |
| `error` | Sent on socket errors |

---

## Notes

- All timestamps follow **ISO 8601** format
- `distance` is always in **meters**
- `time` / `duration` is always in **seconds**
- Fare amounts are in **INR (₹)**
- OTP is valid for **5 minutes** only
- 🔒 = Requires authentication
