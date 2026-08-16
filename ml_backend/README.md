# 🤖 RideNow ML Backend — Dynamic Fare Prediction Engine

[![Python](https://img.shields.io/badge/Python-v3.13-yellow.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-v3.0.3-lightgrey.svg)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-v1.5.2-orange.svg)](https://scikit-learn.org/)
[![Gunicorn](https://img.shields.io/badge/WSGI-Gunicorn-green.svg)](https://gunicorn.org/)
[![R2 Score](https://img.shields.io/badge/R%C2%B2%20Accuracy-99.92%25-brightgreen.svg)](#-model-performance--validation)

The **RideNow Machine Learning Service** is a lightweight, high-performance Python microservice that serves a trained **Linear Regression** model for dynamic ride fare estimation. Built with Flask and scikit-learn, it achieves an impressive **99.92% $R^2$ score** on base car pricing and scales fares for auto-rickshaws and motorbikes using dynamic vehicle multipliers.

---

## 🏗️ Architecture & Processing Pipeline

```
                                 ┌───────────────────────────────────────────────┐
                                 │              Node.js Express Server           │
                                 └──────────────────────┬────────────────────────┘
                                                        │
                                                 HTTP POST /predict
                                              { distance (m), time (s) }
                                                        │
                                 ┌──────────────────────▼────────────────────────┐
                                 │             Flask REST API (app.py)           │
                                 └──────────────────────┬────────────────────────┘
                                                        │
                                         Unit Conversion & Vector Normalization
                                         dist_km = dist_m/1000, time_min = time_s/60
                                                        │
                                 ┌──────────────────────▼────────────────────────┐
                                 │   Scikit-Learn Model (linear_car_model.pkl)   │
                                 │   predict( [ [dist_km, time_min] ] )          │
                                 └──────────────────────┬────────────────────────┘
                                                        │
                                            Car Fare Output: ₹car_fare
                                                        │
                                 ┌──────────────────────▼────────────────────────┐
                                 │       Vehicle Multiplier Scaling Engine       │
                                 │  - Car  : 1.00  -> ₹car_fare                 │
                                 │  - Auto : 0.66  -> ₹car_fare * 0.66          │
                                 │  - Moto : 0.50  -> ₹car_fare * 0.50          │
                                 └──────────────────────┬────────────────────────┘
                                                        │
                                                JSON Response 200
                                       { success: true, fares: { car, auto, moto } }
```

---

## 📁 Repository Structure

```
ml_backend/
├── app.py                    # Flask API server & inference endpoints (/predict, /original, /)
├── train_linear_model.py     # Pipeline script: dataset loading, 5-fold CV, model serialization
├── generate_indian_data.py   # Data generator script for 50,000 synthetic Indian ride samples
├── car_rides_data.csv        # Synthetic dataset (50,000 samples)
├── linear_car_model.pkl      # Serialized scikit-learn Linear Regression model (joblib)
├── requirements.txt          # Python dependencies
├── Procfile                  # Gunicorn deployment configuration for Render
├── Model_Accuracy.md         # Detailed cross-validation evaluation report
└── README.md                 # ML Backend Documentation
```

---

## 🧮 Mathematical & Business Model

### 1. Underlying Business Formula
Urban transit pricing in the Indian ride-hailing market follows a linear multi-variable function combining base fee, distance traveled, and trip duration:

$$\text{Fare} = \text{BaseFare} + (\text{Distance}_{\text{km}} \times \text{Rate}_{\text{km}}) + (\text{Time}_{\text{min}} \times \text{Rate}_{\text{min}})$$

### 2. Vehicle Rate Matrix

| Vehicle Type | Base Fare ($\text{Base}$) | Per KM Rate ($\text{Rate}_{\text{km}}$) | Per Min Rate ($\text{Rate}_{\text{min}}$) | Derived Multiplier |
|--------------|---------------------------|----------------------------------------|------------------------------------------|--------------------|
| **Car** | ₹50.00 | ₹15.00 / km | ₹3.00 / min | **1.00** (Base) |
| **Auto** | ₹30.00 | ₹10.00 / km | ₹2.00 / min | **0.66** |
| **Moto** | ₹20.00 | ₹8.00 / km | ₹1.50 / min | **0.50** |

### 3. ML Regression Equation
The model is trained strictly on Car ride parameters with 1% Gaussian noise ($\epsilon$) added to reflect real-world surge and traffic variance:

$$\hat{y}_{\text{car}} = w_1 \cdot \text{Distance}_{\text{km}} + w_2 \cdot \text{Time}_{\text{min}} + b$$

The learned parameters from training:
- **Intercept ($b$):** ₹49.96 (Expected: ₹50.00)
- **Distance Weight ($w_1$):** ₹15.00 / km (Expected: ₹15.00)
- **Time Weight ($w_2$):** ₹3.00 / min (Expected: ₹3.00)

---

## 📊 Model Performance & Validation

Model accuracy was verified using **5-Fold Cross-Validation** over 50,000 ride samples.

```
====== K-FOLD CROSS-VALIDATION (K=5) ======
  Fold        R2 Score         MAE (₹)       RMSE (₹)
     1          0.9992           ₹4.97          ₹6.67
     2          0.9992           ₹5.00          ₹6.68
     3          0.9992           ₹4.93          ₹6.62
     4          0.9992           ₹4.92          ₹6.62
     5          0.9992           ₹4.88          ₹6.58

====== FINAL ACCURACY SUMMARY ======
R2 Score  : 0.9992 (99.92% Variance Explained)
MAE       : ₹4.94 (Mean Absolute Error)
RMSE      : ₹6.63 (Root Mean Squared Error)
```

> See [Model_Accuracy.md](./Model_Accuracy.md) for full statistical breakdown.

---

## 🌐 API Endpoint Specifications

### 1. `GET /`
Healthcheck & model status probe.

**Response `200 OK`**
```json
{
  "status": "OK",
  "model": "fare prediction model loaded"
}
```

---

### 2. `POST /predict`
Predict fares for Car, Auto, and Moto using the trained Linear Regression model.

**Request Body (`application/json`)**
```json
{
  "distance": 15000,
  "time": 1800
}
```
- `distance` (number, meters — e.g. 15000 = 15 km)
- `time` (number, seconds — e.g. 1800 = 30 minutes)

**Response `200 OK`**
```json
{
  "success": true,
  "fares": {
    "car": 364.96,
    "auto": 240.87,
    "moto": 182.48
  }
}
```

**Errors `500 Internal Server Error`**
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

### 3. `POST /original`
Fallback endpoint — calculates fares using direct mathematical business formula without invoking scikit-learn.

**Request Body (`application/json`)**
```json
{
  "distance": 15000,
  "time": 1800
}
```

**Response `200 OK`**
```json
{
  "success": true,
  "fares": {
    "auto": 240.00,
    "car": 365.00,
    "moto": 185.00
  }
}
```

---

## 🏋️ Training & Regenerating Model

If you wish to re-train the model or generate fresh training datasets:

```bash
# 1. Navigate to ml_backend
cd ml_backend

# 2. Generate 50,000 synthetic Indian ride samples
python generate_indian_data.py
# Creates car_rides_data.csv

# 3. Train model & run 5-fold cross-validation
python train_linear_model.py
# Outputs metrics and serializes linear_car_model.pkl
```

---

## 🚀 Local Execution & Production Deployment

### Local Development
```bash
pip install -r requirements.txt
python app.py
# Server listening at http://localhost:5001
```

### Production Execution (Gunicorn)
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

**Render Deployment:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`