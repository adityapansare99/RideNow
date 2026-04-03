# 🤖 RideNow ML Backend — Fare Prediction Service

A lightweight Python Flask API that serves a Linear Regression model for dynamic ride fare prediction. Achieves **99.92% R² accuracy** on car fare prediction and derives auto/moto fares using vehicle multipliers.

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|-----------|---------|-------|
| Python | 3.13 | Runtime |
| Flask | 3.0.3 | REST API framework |
| Flask-CORS | 4.0.1 | Cross-origin requests |
| scikit-learn | 1.5.2 | Linear Regression model |
| pandas | 2.2.3 | Data loading and processing |
| numpy | 2.1.3 | Numerical operations |
| joblib | 1.4.2 | Model serialization |
| gunicorn | 23.0.0 | Production WSGI server |

---

## 📁 Project Structure

```
ml_backend/
├── app.py                    # Flask API server
├── train_linear_model.py     # Model training script
├── generate_indian_data.py   # Synthetic training data generator
├── car_rides_data.csv        # 50,000 synthetic training samples
├── linear_car_model.pkl      # Trained model (joblib format)
├── requirements.txt          # Python dependencies
└── README.md                 # Accuracy report
```

---

## 🚀 Getting Started

```bash
# Navigate to ml_backend folder
cd ml_backend

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
# Runs on http://localhost:5001
```

### Production (Gunicorn)
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

---

## 🌐 API Endpoints

### `GET /`

Check if the server and model are running.

**Response**
```json
{
  "status": "OK",
  "model": "fare prediction model loaded"
}
```

---

### `POST /predict`

Predict fares for all vehicle types using the trained ML model.

**Request Body**
```json
{
  "distance": 15000,
  "time": 1800
}
```

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `distance` | number | meters | Distance of the route |
| `time` | number | seconds | Estimated travel time |

**Success Response `200`**
```json
{
  "success": true,
  "fares": {
    "car": 250.50,
    "auto": 165.33,
    "moto": 125.25
  }
}
```

**Error Response `500`**
```json
{
  "success": false,
  "error": "error description"
}
```

**How it works:**
1. Converts `distance` from meters → km, `time` from seconds → minutes
2. Feeds into Linear Regression model → predicts car fare
3. Applies vehicle multipliers to derive auto and moto fares
4. Returns all three fares rounded to 2 decimal places

---

### `POST /original`

Fallback endpoint — calculates fares using the original business formula directly. Used as backup if ML model fails and for validation purposes.

**Request Body**
```json
{
  "distance": 15000,
  "time": 1800
}
```

**Success Response `200`**
```json
{
  "success": true,
  "fares": {
    "car": 250.00,
    "auto": 165.00,
    "moto": 125.00
  }
}
```

---

## 🧮 Fare Calculation Logic

### Business Formula
```
Fare = Base Fare + (Distance in km × Per KM Rate) + (Time in min × Per Minute Rate)
```

### Vehicle Rates

| Vehicle | Base Fare | Per KM Rate | Per Min Rate | Multiplier |
|---------|-----------|-------------|--------------|------------|
| Car | ₹50 | ₹15/km | ₹3/min | 1.00 (base) |
| Auto | ₹30 | ₹10/km | ₹2/min | 0.66 |
| Moto | ₹20 | ₹8/km | ₹1.5/min | 0.50 |

### ML Approach
- Model is trained only on **car fares**
- Auto and Moto fares derived by: `car_fare × vehicle_multiplier`
- Multipliers calculated from average 10km, 20min ride ratio

---

## 🏋️ Training the Model

### Step 1 — Generate Training Data
```bash
python generate_indian_data.py
# Generates car_rides_data.csv with 50,000 samples
```

**Data Generation Logic:**
- Distance: 0.5 km to 50 km (random uniform)
- Time: 5 min to 120 min (random uniform)
- Fare: calculated from business formula + ±1% random noise
- Minimum fare enforced: ₹50

### Step 2 — Train the Model
```bash
python train_linear_model.py
# Trains model, runs K-Fold validation, saves linear_car_model.pkl
```

**Training Output:**
```
====== K-FOLD CROSS-VALIDATION (K=5) ======
  Fold    R2         MAE        RMSE
     1  0.9992   ₹4.97     ₹6.67
     2  0.9992   ₹5.00     ₹6.68
     3  0.9992   ₹4.93     ₹6.62
     4  0.9992   ₹4.92     ₹6.62
     5  0.9992   ₹4.88     ₹6.58

====== FINAL ACCURACY REPORT ======
R2 Score  : 0.9992  (± 0.0000)
MAE       : ₹4.94   (± ₹0.04)
RMSE      : ₹6.63   (± ₹0.04)
```

---

## 📊 Model Performance

### Accuracy Metrics

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| R² Score | **0.9992** | > 0.95 excellent | ✅ Excellent |
| MAE | **₹4.94** | < 1% of avg fare | ✅ Excellent |
| RMSE | **₹6.63** | Close to MAE | ✅ Consistent |
| Std Dev (R²) | **±0.0000** | Near zero | ✅ Stable |

### Learned Parameters vs Expected

| Parameter | Expected | Learned | Deviation |
|-----------|----------|---------|-----------|
| Base Fare | ₹50.00 | ₹49.96 | -₹0.04 |
| Per KM Rate | ₹15.00 | ₹15.00 | ₹0.00 |
| Per Min Rate | ₹3.00 | ₹3.00 | ₹0.00 |

### Real-World Validation (27.57 km, 121.05 min)

| Vehicle | ML Prediction | Formula | Error |
|---------|--------------|---------|-------|
| Car | ₹826.68 | ₹826.70 | 0.002% |
| Auto | ₹545.61 | ₹547.80 | 0.40% |
| Moto | ₹413.34 | ₹422.13 | 2.08% |

---

## 🔗 Integration with Backend

The Node.js backend calls `/predict` via axios:

```js
// ride.service.js
const response = await axios.post(`${process.env.Model_link}/predict`, {
  distance: distance,  // meters (from Google Maps)
  time: time           // seconds (from Google Maps)
});

const fare = response.data.fares;
// { car: 250.50, auto: 165.33, moto: 125.25 }
```

**Fallback behavior:** If the ML API call fails, the backend automatically falls back to the formula-based calculation — ensuring rides can always be created even if the ML service is down.

---

## 📈 Training Data Statistics

| Metric | Distance (km) | Time (min) | Fare (₹) |
|--------|--------------|------------|----------|
| Samples | 50,000 | 50,000 | 50,000 |
| Mean | 25.27 | 62.71 | ₹617.10 |
| Std Dev | 14.29 | 33.13 | ₹236.48 |
| Min | 0.50 | 5.00 | ₹75.55 |
| Median | 25.31 | 63.05 | ₹618.19 |
| Max | 50.00 | 120.00 | ₹1,172.33 |

---

## 🔧 Deployment on Render

1. Connect GitHub repo to Render
2. Set root directory to `ml_backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
5. Set environment variable `PORT` if needed

---

## 🔮 Future Enhancements

- Surge pricing based on time-of-day demand
- Traffic data integration from Google Maps
- Weather conditions as a feature
- Real ride data collection for model retraining
- Separate models per vehicle type for higher accuracy
- Dynamic multipliers based on supply/demand ratio

---

## 📄 Model Files

| File | Description |
|------|-------------|
| `car_rides_data.csv` | 50,000 synthetic training samples |
| `linear_car_model.pkl` | Serialized trained model (joblib) |
| `train_linear_model.py` | Training + K-Fold validation script |
| `generate_indian_data.py` | Synthetic data generator |
| `app.py` | Flask API server |