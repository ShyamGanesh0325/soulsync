import pickle
import os
import joblib

class ModelLoader:
    _instance = None
    _model = None
    _scaler = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._load_models()
        return cls._instance

    def _load_models(self):
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_path, "models", "soul_sync_model.pkl")
        scaler_path = os.path.join(base_path, "models", "scaler.pkl")

        # Load CatBoost Model
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                self._model = pickle.load(f)
            print("✅ Model loaded successfully.")
        else:
            print(f"❌ Model not found at {model_path}")
            
        # Load Scaler
        if os.path.exists(scaler_path):
            # Scaler might be saved with joblib or pickle. Notebook said .pkl
            try:
                with open(scaler_path, "rb") as f:
                    self._scaler = pickle.load(f)
                print("✅ Scaler loaded successfully.")
            except:
                self._scaler = joblib.load(scaler_path)
                print("✅ Scaler loaded with joblib.")
        else:
            print(f"❌ Scaler not found at {scaler_path}")

    @property
    def model(self):
        return self._model

    @property
    def scaler(self):
        return self._scaler

# Global instance
loader = ModelLoader()
