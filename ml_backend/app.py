from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app,
     resources={r"/*": {"origins": "*"}},
     supports_credentials=False)

model = joblib.load('linear_car_model.pkl')

VEHICLE_MULTIPLIERS = {
    'car':  1.00,
    'auto': 0.66,
    'moto': 0.5,
}

@app.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'model': 'fare prediction model loaded'})

@app.route('/predict', methods=['POST'])
def predict_fare():
    try:
        data = request.get_json()
        
        distance_m = float(data['distance'])
        time_s = float(data['time'])
        
        distance_km = distance_m / 1000
        time_min = time_s / 60
        
        features = np.array([[distance_km, time_min]])
        car_fare = float(model.predict(features)[0])
        
        fares = {
            vehicle: round(car_fare * multiplier, 2)
            for vehicle, multiplier in VEHICLE_MULTIPLIERS.items()
        }
        
        return jsonify({
            'success': True,
            'fares': fares
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/original',methods=['POST'])
def predict_original():
    try:
        data=request.get_json()
        distance_m = float(data['distance'])
        time_s     = float(data['time'])
        
        baseFare = {
            'auto': 30,
            'car': 50,
            'moto': 20,
        }

        perKmRate = {
            'auto': 10,
            'car': 15,
            'moto': 8,
        }

        perMinuteRate = {
            'auto': 2,
            'car': 3,
            'moto': 1.5,
        }

        fares={
            vehicle: round(baseFare[vehicle] + (perKmRate[vehicle] * (distance_m / 1000)) + (perMinuteRate[vehicle] * (time_s / 60)), 2)
            for vehicle in baseFare.keys()
        }

        return jsonify({
            'success': True,
            'fares': fares
        })


    except KeyError as e:
        return jsonify({'success': False, 'error': f'Missing field: {e}'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
