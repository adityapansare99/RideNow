# 🖥️ RideNow Frontend

The frontend of RideNow is a React 19 single-page application built with Vite and Tailwind CSS. It provides separate interfaces for **Users** (riders) and **Captains** (drivers), with real-time ride tracking, Google Maps integration, and Razorpay payment flow.

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|-----------|---------|-------|
| React | 19.1.0 | UI Framework |
| Vite | 6.3.5 | Build tool |
| Tailwind CSS | 4.1.7 | Styling |
| React Router DOM | 7.6.0 | Client-side routing |
| Axios | 1.9.0 | HTTP requests |
| Socket.IO Client | 4.8.1 | Real-time communication |
| GSAP + @gsap/react | 3.13.0 | Animations & panel transitions |
| @react-google-maps/api | 2.20.6 | Google Maps integration |
| React Toastify | 11.0.5 | Toast notifications |
| Razorpay | 2.9.6 | Payment integration |
| Lucide React | 0.562.0 | Icons |
| Remix Icons | 4.6.0 | Icons |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CaptainDetails.jsx        # Captain dashboard stats card
│   │   ├── ConfirmRide.jsx           # User ride confirmation panel
│   │   ├── ConfirmRidePopup.jsx      # Captain ride confirmation popup
│   │   ├── FinishRide.jsx            # Captain ride finish panel
│   │   ├── LiveRideTracking.jsx      # Live map during active ride
│   │   ├── LiveTracking.jsx          # Captain idle map view
│   │   ├── LocationSearchPanel.jsx   # Address autocomplete panel
│   │   ├── LookingForDriver.jsx      # User waiting for captain panel
│   │   ├── RidePopup.jsx             # Captain incoming ride popup
│   │   ├── RideRating.jsx            # User ride rating component
│   │   ├── VehiclePanel.jsx          # User vehicle type + fare selection
│   │   └── WaitForDriver.jsx         # User waiting after confirmation
│   │
│   ├── context/
│   │   ├── CaptainContext.jsx        # Captain global state
│   │   ├── SocketContext.jsx         # Socket.IO connection context
│   │   └── userContext.jsx           # User global state
│   │
│   ├── pages/
│   │   ├── Start.jsx                 # Landing/splash page
│   │   ├── UserLogin.jsx             # User login
│   │   ├── UserSignup.jsx            # User registration
│   │   ├── UserLogout.jsx            # User logout handler
│   │   ├── UserProtectedWrapper.jsx  # Auth guard for user routes
│   │   ├── UserEditProfile.jsx       # User profile edit
│   │   ├── UserRideHistory.jsx       # User ride history
│   │   ├── Home.jsx                  # User main page (book ride)
│   │   ├── Riding.jsx                # User active ride page
│   │   ├── CaptainLogin.jsx          # Captain login
│   │   ├── CaptainSignup.jsx         # Captain registration
│   │   ├── CaptainLogout.jsx         # Captain logout handler
│   │   ├── CaptainProtectedWrapper.jsx # Auth guard for captain routes
│   │   ├── CaptainHome.jsx           # Captain dashboard
│   │   ├── CaptainRiding.jsx         # Captain active ride page
│   │   ├── CaptainEditProfile.jsx    # Captain profile edit
│   │   └── CaptainRideHistory.jsx    # Captain ride history
│   │
│   ├── App.jsx                       # Routes definition + ToastContainer
│   ├── App.css                       # Global styles
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Base CSS
│
├── public/
├── .env
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RazorPayKey=your_razorpay_key
```

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Backend API base URL |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `VITE_RazorPayKey` | Razorpay publishable key |

---

## 🚀 Getting Started

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🗺️ Routes

### Public Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | `Start` | Landing page |
| `/login` | `UserLogin` | User login |
| `/signup` | `UserSignup` | User registration |
| `/captain-login` | `CaptainLogin` | Captain login |
| `/captain-signup` | `CaptainSignup` | Captain registration |

### Protected Routes — User 🔒

| Path | Page | Description |
|------|------|-------------|
| `/home` | `Home` | Book a ride |
| `/user/edit-profile` | `UserEditProfile` | Edit user profile |
| `/user/ride-history` | `UserRideHistory` | Past rides |
| `/user/logout` | `UserLogout` | Logout handler |
| `/riding` | `Riding` | Active ride page (user) |

### Protected Routes — Captain 🔒

| Path | Page | Description |
|------|------|-------------|
| `/captain-home` | `CaptainHome` | Captain dashboard |
| `/captain/edit-profile` | `CaptainEditProfile` | Edit captain profile |
| `/captain/ride-history` | `CaptainRideHistory` | Past rides |
| `/captain/logout` | `CaptainLogout` | Logout handler |
| `/captain-riding` | `CaptainRiding` | Active ride page (captain) |

---

## 🧩 Key Components

### `LocationSearchPanel`
Address autocomplete using Google Maps Places API. Displays suggestions as the user types pickup/destination.

### `VehiclePanel`
Displays fare estimates for Car, Auto, and Moto fetched from the backend (ML-powered). User selects vehicle type to proceed.

### `LookingForDriver`
Shown after ride creation. Polls for captain confirmation via socket event `ride-confirmed`.

### `WaitForDriver`
Shown after captain confirms. Displays captain details and waits for ride start.

### `LiveTracking`
Captain's idle map view. Shows captain's real-time location updated every 10 seconds via socket.

### `LiveRideTracking`
Active ride map. Shows captain's live location tracked via `captain-location-update` socket event.

### `RidePopup`
Captain's incoming ride notification panel. Animated slide-up using GSAP.

### `ConfirmRidePopup`
Captain's confirmed ride panel showing user details, pickup/destination, and fare.

### `FinishRide`
Captain's end ride panel with ride summary.

### `RideRating`
User's post-ride rating component. Star rating submitted to backend after ride completion.

### `CaptainDetails`
Captain dashboard stats showing total distance (km), time (hours), and earnings (₹) fetched from backend aggregation.

---

## 🌐 Context Providers

### `UserDataContext`
```jsx
{
  user,        // current user object
  setUser,     // update user state
}
```

### `CaptainDataContext`
```jsx
{
  captain,        // current captain object
  setCaptain,     // update captain state
  isLoading,
  setIsLoading,
  error,
  setError,
  updateCaptain,
}
```

### `SocketContext`
```jsx
{
  socket,  // Socket.IO client instance (connected to backend)
}
```

---

## 🔌 Socket Events Used

### Emitted by Frontend

| Event | Payload | When |
|-------|---------|------|
| `join` | `{ userId, userType }` | On user/captain home page load |
| `update-location-captain` | `{ userId, location: { ltd, lng } }` | Every 10 seconds on captain home |
| `update-captain-location-ride` | `{ userId, location, rideId }` | Every 10 seconds during active ride |

### Listened by Frontend

| Event | Handler | Description |
|-------|---------|-------------|
| `new-ride` | Captain | New ride request received |
| `ride-confirmed` | User | Captain accepted the ride |
| `ride-started` | User | Captain started the ride |
| `ride-ended` | User | Ride completed |
| `ride-cancelled` | User | Ride cancelled |
| `ride-already-confirmed` | Captain | Ride taken by another captain |
| `captain-location-update` | User | Captain live location during ride |

---

## 🎨 UI & Animations

- **GSAP** — used for smooth slide-up/slide-down panel animations (ride popup, confirm popup, vehicle panel, etc.)
- **Tailwind CSS 4** — utility-first styling with responsive design
- **React Toastify** — toast notifications for errors, warnings, and info messages
- **Remix Icons + Lucide React** — icon libraries used throughout the app

### Toast Usage

| Type | When Used |
|------|-----------|
| `toast.error` | API failures, wrong credentials, validation errors, OTP invalid |
| `toast.warn` | Ride already taken by another captain, OTP expired |
| `toast.info` | New ride request received |

---

## 💳 Payment Flow

```
1. Ride completed
2. User clicks "Make Payment"
3. POST /rides/makepayment → Razorpay order created
4. Razorpay checkout opens in browser
5. User completes payment
6. POST /rides/verifypayment → payment verified, ride updated
```

---

## 🔐 Authentication Flow

```
Register/Login
    ↓
Receive accesstoken + refreshtoken
    ↓
Store accesstoken in localStorage
    ↓
Send as Authorization: Bearer <token> on every protected request
    ↓
Protected wrapper checks token validity
    ↓
If invalid → redirect to login page
```

---

## 📱 Responsive Design

The app is fully responsive:
- **Mobile** — bottom sheet panels, compact navigation
- **Tablet/Desktop** — side panel layout with map on left, controls on right

---

## 🔧 Build & Deployment

```bash
# Build for production
npm run build

# Output directory: dist/
# Deploy dist/ folder to Netlify
```

**Netlify Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: set in Netlify dashboard