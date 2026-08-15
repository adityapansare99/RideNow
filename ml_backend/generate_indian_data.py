import pandas as pd
import numpy as np

np.random.seed(42)
NUM_SAMPLES = 50000

BASE_FARE = 50
PER_KM = 15
PER_MIN = 3

rows = []

for _ in range(NUM_SAMPLES):
    distance_km = round(np.random.uniform(0.5, 50), 2)
    time_min = round(np.random.uniform(5, 120), 2)

    fare = BASE_FARE + (distance_km * PER_KM) + (time_min * PER_MIN)

    noise = np.random.normal(0, fare * 0.01)
    fare = round(max(50, fare + noise), 2)

    rows.append([distance_km, time_min, fare])

df = pd.DataFrame(rows, columns=["distance_km", "time_min", "fare"])

df.to_csv("car_rides_data.csv", index=False)

print("\n---- Sample Data ----")
print(df.head(10))
print("\n---- Statistics ----")
print(df.describe())
print(f"\nSaved as car_rides_data.csv")
