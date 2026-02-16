import pickle
import sys
import os

# Add current dir to path
sys.path.append(os.getcwd())

model_path = "backend/models/soul_sync_model.pkl"
scaler_path = "backend/models/scaler.pkl"

try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    print("Model type:", type(model))
    if hasattr(model, "feature_names_"):
        print("Feature names:", model.feature_names_)
    elif hasattr(model, "feature_names"):
        print("Feature names:", model.feature_names)
except Exception as e:
    print("Error loading model:", e)

try:
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)
    print("Scaler mean:", scaler.mean_)
    print("Scaler scale:", scaler.scale_)
    print("Scaler n_features:", scaler.n_features_in_)
except Exception as e:
    print("Error loading scaler:", e)
