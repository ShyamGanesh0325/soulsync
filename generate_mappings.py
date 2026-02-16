import pandas as pd
import category_encoders as ce
import json
import os

# Load dataset
csv_path = "/Users/shyamganeshs/data science/01_python_programming/india_matchmaking_dataset_5000.csv"
if not os.path.exists(csv_path):
    print("CSV not found!")
    exit(1)

df = pd.read_csv(csv_path)

# Columns to encode
cols = ['gender','location','zodiac_sign','relationship_goal','fav_music_genre','bio_text']

# Initialize encoder exactly as in notebook
encoder = ce.OrdinalEncoder(cols=cols)
encoder.fit(df)

# Extract mappings
mappings = {}
for map_data in encoder.mapping:
    col = map_data['col']
    mapping = map_data['mapping']
    # Convert to dict, explicitly converting keys/values to standard python types
    mappings[col] = {str(k): int(v) for k, v in mapping.items() if isinstance(v, (int, float))}

# Save to file
output_path = "backend/app/utils/mappings.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    json.dump(mappings, f, indent=2)

print(f"Mappings saved to {output_path}")
print("Gender mapping:", mappings['gender'])
print("Location mapping sample:", list(mappings['location'].items())[:5])
