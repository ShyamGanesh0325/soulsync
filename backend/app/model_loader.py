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
        return cls._instance

    def _load_models(self):
        if self._model is not None:
            return

        print("🚀 Starting lazy load of ML models...")
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_path, "models", "soul_sync_model.pkl")
        scaler_path = os.path.join(base_path, "models", "scaler.pkl")

        # Load CatBoost Model
        if os.path.exists(model_path):
            try:
                with open(model_path, "rb") as f:
                    self._model = pickle.load(f)
                print("✅ Model loaded successfully.")
            except Exception as e:
                print(f"❌ Error loading model: {e}")
        else:
            print(f"❌ Model not found at {model_path}")
            
        # Load Scaler
        if os.path.exists(scaler_path):
            try:
                # Try pickle first
                with open(scaler_path, "rb") as f:
                    self._scaler = pickle.load(f)
                print("✅ Scaler loaded successfully.")
            except:
                try:
                    self._scaler = joblib.load(scaler_path)
                    print("✅ Scaler loaded with joblib.")
                except Exception as e:
                    print(f"❌ Error loading scaler: {e}")
        else:
            print(f"❌ Scaler not found at {scaler_path}")

        import gc
        gc.collect()

    @property
    def model(self):
        if self._model is None:
            self._load_models()
        return self._model

    @property
    def scaler(self):
        if self._scaler is None:
            self._load_models()
        return self._scaler

# Global instance
loader = ModelLoader()
