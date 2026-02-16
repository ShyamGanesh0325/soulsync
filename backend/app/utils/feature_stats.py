import pandas as pd
import json
import os
import numpy as np

class FeatureStats:
    _instance = None
    stats = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FeatureStats, cls).__new__(cls)
            cls._instance._load_stats()
        return cls._instance

    def _load_stats(self):
        # We need Mean and Std for numeric columns to scale inputs manually
        # since the provided scaler.pkl is suspicious.
        csv_path = "/Users/shyamganeshs/data science/01_python_programming/india_matchmaking_dataset_5000.csv"
        
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            
            # Numeric columns from the notebook's scaler list (approx)
            # We'll valid types
            numerics = df.select_dtypes(include=[np.number])
            
            self.stats = {
                "mean": numerics.mean().to_dict(),
                "std": numerics.std().to_dict()
            }
            print(f"✅ Feature stats loaded from CSV. (Columns: {len(self.stats['mean'])})")
        else:
            print("❌ CSV for feature stats not found. using defaults.")
            self.stats = {"mean": {}, "std": {}}

    def get_mean(self, col: str, default=0.0):
        return self.stats["mean"].get(col, default)

    def get_std(self, col: str, default=1.0):
        return self.stats["std"].get(col, default)

feature_stats = FeatureStats()
