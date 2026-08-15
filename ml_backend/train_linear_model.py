import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_validate, KFold
from sklearn.metrics import (
    mean_absolute_error,
    r2_score,
    mean_squared_error,
    make_scorer,
)

df = pd.read_csv("car_rides_data.csv")
print(f"Loaded {len(df)} CAR rides")

X = df[["distance_km", "time_min"]]
y = df["fare"]

model = LinearRegression()

kfold = KFold(n_splits=5, shuffle=True, random_state=42)

print("\n====== K-FOLD CROSS-VALIDATION (K=5) ======\n")


def rmse(y_true, y_pred):
    return np.sqrt(mean_squared_error(y_true, y_pred))


rmse_scorer = make_scorer(rmse, greater_is_better=False)

scoring = {"r2": "r2", "mae": "neg_mean_absolute_error", "rmse": rmse_scorer}

cv_results = cross_validate(
    model, X, y, cv=kfold, scoring=scoring, return_train_score=False, n_jobs=1
)

r2_scores = cv_results["test_r2"]
mae_scores = -cv_results["test_mae"]
rmse_scores = -cv_results["test_rmse"]

print("---- Results Per Fold ----")
print(f'{"Fold":>6}  {"R2":>8}  {"MAE":>10}  {"RMSE":>10}')
for i in range(5):
    print(
        f"{i+1:>6}  {r2_scores[i]:>8.4f}  ₹{mae_scores[i]:>9.2f}  ₹{rmse_scores[i]:>9.2f}"
    )

print("\n====== FINAL ACCURACY REPORT (CAR FARES) ======")
print(f"R2 Score  : {r2_scores.mean():.4f}  (± {r2_scores.std():.4f})")
print(f"MAE       : ₹{mae_scores.mean():.2f}  (± ₹{mae_scores.std():.2f})")
print(f"RMSE      : ₹{rmse_scores.mean():.2f}  (± ₹{rmse_scores.std():.2f})")

if r2_scores.mean() > 0.99:
    print("Excellent! Model learned from CAR formula perfectly")
elif r2_scores.mean() > 0.95:
    print("Very good accuracy")


print("\n---- Training final model on full dataset ----")
model.fit(X, y)


print("\n---- Model Learned These Rules ----")
print(f"Base fare (intercept) : ₹{model.intercept_:>7.2f}  (expected: ₹50)")
print(f"Per KM rate           : ₹{model.coef_[0]:>7.2f}  (expected: ₹15)")
print(f"Per MIN rate          : ₹{model.coef_[1]:>7.2f}  (expected: ₹3)")


joblib.dump(model, "linear_car_model.pkl")
print("\nModel saved as linear_car_model.pkl")
