# 🖥️ RideNow Frontend — Client Application

[![React](https://img.shields.io/badge/React-v19.1.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v6.3.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1.7-38bdf8.svg)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-v3.13.0-green.svg)](https://greensock.com/gsap/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.8.1-black.svg)](https://socket.io/)

The **RideNow Frontend** is a modern React 19 single-page web application built with Vite and Tailwind CSS 4. It features dual user role portals (**User / Rider** and **Captain / Driver**), real-time Google Maps telemetry, smooth GSAP bottom-sheet panel transitions, Razorpay checkout, and bi-directional Socket.IO updates.

---

## 🏗️ Architecture & Component Layout

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    React 19 Core                       │
                               │                (main.jsx / App.jsx)                    │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
              ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
              │                                            │                                            │
┌─────────────▼──────────────┐              ┌──────────────▼─────────────┐              ┌──────────────▼─────────────┐
│    Context Providers       │              │       React Router DOM     │              │    Real-Time WebSocket     │
│ - UserDataContext          │              │ - Public Routes            │              │ - SocketContext            │
│ - CaptainDataContext       │              │ - UserProtectedWrapper     │              │ - Listener Hooks           │
│ - SocketContext            │              │ - CaptainProtectedWrapper  │              │ - Location Emitting        │
└─────────────┬──────────────┘              └──────────────┬─────────────┘              └──────────────┬─────────────┘
              │                                            │                                            │
              └────────────────────────────────────────────┼────────────────────────────────────────────┘
                                                           │
┌──────────────────────────────────────────────────────────▼──────────────────────────────────────────────────────────┐
│                                                   UI Layer                                                          │
│ ┌──────────────────────────────────────────┐                      ┌──────────────────────────────────────────┐      │
│ │               Rider Views                │                      │              Captain Views               │      │
│ │  - Start.jsx                             │                      │  - CaptainHome.jsx                       │      │
│ │  - UserLogin.jsx / UserSignup.jsx        │                      │  - CaptainLogin.jsx / CaptainSignup.jsx  │      │
│ │  - Home.jsx (Ride Booking Dashboard)     │                      │  - CaptainRiding.jsx (Active Navigation) │      │
│ │  - Riding.jsx (Active Passenger View)    │                      │  - CaptainEditProfile.jsx                │      │
│ │  - UserEditProfile.jsx / History         │                      │  - CaptainRideHistory.jsx                │      │
│ └────────────────────┬─────────────────────┘                      └────────────────────┬─────────────────────┘      │
│                      │                                                                 │                            │
│ ┌────────────────────▼─────────────────────────────────────────────────────────────────▼──────────────────────────┐ │
│ │                                             Reusable Components                                                │ │
│ │ LocationSearchPanel │ VehiclePanel │ LookingForDriver │ ConfirmRide │ LiveTracking │ RidePopup │ FinishRide │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CaptainDetails.jsx        # Captain dashboard statistics (Distance, Hours, Earnings)
│   │   ├── ConfirmRide.jsx           # User ride confirmation bottom sheet
│   │   ├── ConfirmRidePopup.jsx      # Captain ride confirmation sheet with passenger details
│   │   ├── FinishRide.jsx            # Captain ride end summary sheet
│   │   ├── LiveRideTracking.jsx      # Live Google Map during active ride (polyline tracking)
│   │   ├── LiveTracking.jsx          # Captain idle Google Map view (current geolocation)
│   │   ├── LocationSearchPanel.jsx   # Google Places address autocomplete panel
│   │   ├── LookingForDriver.jsx      # User waiting state panel while searching for captains
│   │   ├── RidePopup.jsx             # Captain incoming ride alert card (GSAP slide-in)
│   │   ├── RideRating.jsx            # Post-ride 5-star rating overlay component
│   │   ├── VehiclePanel.jsx          # User vehicle selection panel (Car, Auto, Moto fares)
│   │   └── WaitForDriver.jsx         # User panel displaying matched captain details & OTP
│   │
│   ├── context/
│   │   ├── CaptainContext.jsx        # Global Captain state & profile updater
│   │   ├── SocketContext.jsx         # Global Socket.IO client instance & setup
│   │   └── userContext.jsx           # Global User state & auth context
│   │
│   ├── pages/
│   │   ├── Start.jsx                 # Landing landing screen
│   │   ├── UserLogin.jsx             # Rider login page
│   │   ├── UserSignup.jsx            # Rider registration & OTP modal
│   │   ├── UserLogout.jsx            # Rider logout handler
│   │   ├── UserProtectedWrapper.jsx  # Auth route guard for Rider pages
│   │   ├── UserEditProfile.jsx       # Rider profile editor with Cloudinary upload
│   │   ├── UserRideHistory.jsx       # Rider trip log & captain rating display
│   │   ├── Home.jsx                  # Rider main booking dashboard
│   │   ├── Riding.jsx                # Rider live trip view & payment trigger
│   │   ├── CaptainLogin.jsx          # Captain login page
│   │   ├── CaptainSignup.jsx         # Captain registration & vehicle details page
│   │   ├── CaptainLogout.jsx         # Captain logout handler
│   │   ├── CaptainProtectedWrapper.jsx # Auth route guard for Captain pages
│   │   ├── CaptainHome.jsx           # Captain main dashboard (online toggle & incoming rides)
│   │   ├── CaptainRiding.jsx         # Captain active trip navigation view
│   │   ├── CaptainEditProfile.jsx    # Captain profile & vehicle editor
│   │   └── CaptainRideHistory.jsx    # Captain trip log & aggregated earnings
│   │
│   ├── App.jsx                       # React Router configuration & ToastContainer
│   ├── App.css                       # Application CSS overrides
│   ├── main.jsx                      # DOM mount & Context Provider wrap
│   └── index.css                     # Base Tailwind CSS 4 directives
│
├── public/                           # Static assets
├── .env                              # Environment variables
├── index.html                        # HTML template
├── package.json                      # Node packages
├── vite.config.js                    # Vite bundler config
└── README.md                         # Frontend Documentation
```

---

## 🌐 Context API & State Management

### 1. `UserDataContext` (`context/userContext.jsx`)
Manages global user session state.

```jsx
const { user, setUser } = useContext(UserDataContext);
// user: { _id, email, fullname: { firstname, lastname }, mobile, image }
```

### 2. `CaptainDataContext` (`context/CaptainContext.jsx`)
Manages global captain session, vehicle details, and stats loading status.

```jsx
const { captain, setCaptain, isLoading, setIsLoading } = useContext(CaptainDataContext);
// captain: { _id, email, fullname, vehicle: { color, plate, capacity, vehicletype }, status }
```

### 3. `SocketContext` (`context/SocketContext.jsx`)
Provides the singleton Socket.IO connection instance across all components.

```jsx
const { socket } = useContext(SocketContext);
```

---

## ⚡ Socket.IO Event Management

### Emitted by Frontend

| Socket Event | Payload | Emitter Component / Page | Frequency / Condition |
|--------------|---------|──────────────────────────|-----------------------|
| `join` | `{ userId, userType: "user" \| "captain" }` | `Home.jsx`, `CaptainHome.jsx` | Component mount |
| `update-location-captain` | `{ userId, location: { ltd, lng } }` | `CaptainHome.jsx` | Every 10 seconds while idle |
| `update-captain-location-ride` | `{ userId, location, rideId, heading }` | `CaptainRiding.jsx` | Every 10 seconds during active ride |

### Listened by Frontend

| Socket Event | Listener Component / Page | Action Taken |
|--------------|---------------------------|--------------|
| `new-ride` | `CaptainHome.jsx` | Triggers GSAP popup showing incoming ride request |
| `ride-confirmed` | `Home.jsx` | Transitions user UI from `LookingForDriver` to `WaitForDriver` |
| `ride-started` | `Home.jsx` / `WaitForDriver.jsx` | Navigates user to `/riding` view |
| `ride-ended` | `Riding.jsx` | Prompts user to complete Razorpay payment & submit rating |
| `ride-cancelled` | `Riding.jsx` / `Home.jsx` | Displays warning toast & redirects to main dashboard |
| `ride-already-confirmed` | `CaptainHome.jsx` | Hides ride popup & alerts captain that ride was claimed |
| `captain-location-update` | `LiveRideTracking.jsx` | Updates driver marker position & map bounds |

---

## 🗺️ Route Directory & Protection

### Public Routes
- `/` — Landing screen (`Start.jsx`)
- `/login` — Rider login (`UserLogin.jsx`)
- `/signup` — Rider registration (`UserSignup.jsx`)
- `/captain-login` — Captain login (`CaptainLogin.jsx`)
- `/captain-signup` — Captain registration (`CaptainSignup.jsx`)

### Rider Protected Routes 🔒 (`UserProtectedWrapper`)
Validates `accesstoken` in `localStorage` & verifies profile via `/users/profile`. Redirects to `/login` on auth failure.
- `/home` — Ride booking dashboard (`Home.jsx`)
- `/riding` — Active trip view (`Riding.jsx`)
- `/user/edit-profile` — Edit profile details (`UserEditProfile.jsx`)
- `/user/ride-history` — Rider trip history (`UserRideHistory.jsx`)
- `/user/logout` — Logout handler (`UserLogout.jsx`)

### Captain Protected Routes 🔒 (`CaptainProtectedWrapper`)
Validates `accesstoken` in `localStorage` & verifies profile via `/captains/profile`. Redirects to `/captain-login` on failure.
- `/captain-home` — Captain dashboard (`CaptainHome.jsx`)
- `/captain-riding` — Active trip navigation (`CaptainRiding.jsx`)
- `/captain/edit-profile` — Edit profile & vehicle (`CaptainEditProfile.jsx`)
- `/captain/ride-history` — Captain trip history (`CaptainRideHistory.jsx`)
- `/captain/logout` — Logout handler (`CaptainLogout.jsx`)

---

## 🎨 UI Animations & Visuals

- **GSAP Panel Transitions:** Dynamic slide-up and slide-down transitions for bottom-sheet modals (`VehiclePanel`, `ConfirmRide`, `RidePopup`, `ConfirmRidePopup`, `FinishRide`) using `gsap.to()`.
- **Google Maps Integration:** Map views rendered via `@react-google-maps/api` with custom markers for pickup, destination, and driver location.
- **Toast Notifications (`react-toastify`):** Standardized user feedback:
  - `toast.error()` — API errors, invalid inputs, wrong OTP
  - `toast.warn()` — Ride claimed by another driver, ride cancelled
  - `toast.info()` — New ride request alert

---

## ⚙️ Environment Configuration

Create `.env` in `frontend/`:

```env
VITE_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RazorPayKey=your_razorpay_key_id
```

---

## 🚀 Building & Production Deployment

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build

# Preview build locally
npm run preview
```

**Netlify Deployment Configuration:**
- Build command: `npm run build`
- Publish directory: `dist`
- Environment Variables: Add `VITE_BASE_URL`, `VITE_GOOGLE_MAPS_API_KEY`, and `VITE_RazorPayKey` in Netlify Site Settings.