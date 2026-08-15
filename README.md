# 🚗 RideNow — Full Stack Ride-Hailing Platform

RideNow is a production-ready, full-stack ride-hailing application inspired by platforms like Uber and Ola. It features real-time ride tracking, ML-powered dynamic fare prediction, OTP-based mobile verification, integrated Razorpay payments, and a captain rating system — built for the Indian market.

---

## 🏗️ Monorepo Structure

```
RideNow/
├── frontend/          # React + Vite + Tailwind CSS
├── Backend/           # Node.js + Express + MongoDB + Socket.IO
└── ml_backend/        # Python + Flask + scikit-learn (Fare Prediction)
```

---

## ✨ Features

### 👤 User
- Register and login with JWT authentication
- Book rides with vehicle type selection (Car, Auto, Moto)
- Real-time fare estimation powered by ML model
- Live captain tracking on Google Maps during ride
- OTP-based ride start verification
- Razorpay payment integration
- Rate captain after ride completion
- View full ride history with captain ratings
- Edit profile with image upload (Cloudinary)
- Email OTP verification via SMTP (nodemailer)

### 🚕 Captain
- Register with vehicle details
- Accept/reject incoming ride requests in real-time
- View ride requests on live map
- Start ride after user OTP verification
- End ride and view earnings summary
- View cumulative stats (distance, time, earnings)
- View average rating from passengers
- Edit profile with profile picture upload
- View full ride history

### ⚙️ System
- Real-time bidirectional communication via Socket.IO
- ML-based fare prediction (99.92% R² accuracy)
- Formula-based fallback if ML model is unavailable
- Google Maps — coordinates, distance/time, autocomplete
- Global error handling with consistent JSON responses
- Bcrypt password hashing
- HTTP-only cookie + Bearer token authentication

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router DOM 7 |
| **UI/Animation** | GSAP, Lucide React, Remix Icons, React Toastify |
| **Maps** | Google Maps API (`@react-google-maps/api`) |
| **Payments (Frontend)** | Razorpay JS SDK |
| **Real-time (Frontend)** | Socket.IO Client |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Real-time (Backend)** | Socket.IO |
| **Authentication** | JWT (Access + Refresh tokens), Bcrypt |
| **File Upload** | Multer + Cloudinary |
| **Email/OTP** | Nodemailer (SMTP) |
| **Payments (Backend)** | Razorpay Node SDK |
| **Maps (Backend)** | Google Maps Geocoding, Distance Matrix, Places API |
| **ML Backend** | Python 3.13, Flask, scikit-learn, joblib |
| **ML Model** | Linear Regression (99.92% R² Score) |

---

## 🚀 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | https://ridenoww.netlify.app/ |
| Backend | Render | https://ridenowb.onrender.com |
| ML Backend | Render | https://ridenow-ml.onrender.com |

---

## 📁 Folder Documentation

Each subfolder has its own detailed README:

| Folder | README |
|--------|--------|
| `frontend/` | [Frontend README](./frontend/README.md) |
| `Backend/` | [Backend README](./Backend/README.md) |
| `ml_backend/` | [ML Backend README](./ml_backend/README.md) |

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)
```env
PORT=8000
NODE_ENV=development
dblink=mongodb+srv://<username>:<password>@cluster.mongodb.net/
accesstoken=your_access_token_secret
refreshtoken=your_refresh_token_secret
accesstime=15m
refreshtime=7d
GOOGLE_MAPS_API=your_google_maps_api_key
RazorPayKey=your_razorpay_key
RazorPaySecretKey=your_razorpay_secret
Currency=INR
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_from_address
cloud_name=your_cloudinary_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret
Model_link=http://localhost:5001
```

### Frontend (`frontend/.env`)
```env
VITE_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_RazorPayKey=your_razorpay_key
```

### ML Backend — no `.env` required
> Port is configurable via `PORT` environment variable. Defaults to `5001`.

---

## 🏃 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/RideNow.git
cd RideNow
```

### 2. Start ML Backend
```bash
cd ml_backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

### 3. Start Backend
```bash
cd Backend
npm install
npm run dev
# Runs on http://localhost:8000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

> ⚠️ Start ML backend first, then backend, then frontend.

---

## 🔄 System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│  User App + Captain App + Google Maps + Razorpay │
└──────────────────┬──────────────────────────────┘
                   │ HTTP + Socket.IO
┌──────────────────▼──────────────────────────────┐
│              Backend (Node.js + Express)          │
│  REST API + Socket.IO + JWT Auth + Cloudinary    │
│  MongoDB + SMTP + Razorpay + Google Maps API     │
└──────┬───────────────────────┬───────────────────┘
       │ MongoDB                │ HTTP (axios)
┌──────▼──────┐      ┌─────────▼──────────────────┐
│  MongoDB     │      │    ML Backend (Flask)        │
│  Atlas       │      │  Linear Regression Model     │
│              │      │  Fare Prediction API          │
└─────────────┘      └────────────────────────────┘
```

---

## 📊 ML Model Performance

| Metric | Value |
|--------|-------|
| Algorithm | Linear Regression |
| R² Score | **0.9992 (99.92%)** |
| Mean Absolute Error | **₹4.94** |
| RMSE | **₹6.63** |
| Training Samples | 50,000 rides |
| Validation | 5-Fold Cross-Validation |

> See [ml_backend/Model_Accuracy.md](./ml_backend/Model_Accuracy.md) for full accuracy report.

---