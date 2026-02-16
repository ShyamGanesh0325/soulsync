import json
import os

# Load mappings from JSON file sibling to this script
current_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_dir, "mappings.json")

mappings = {}
if os.path.exists(json_path):
    with open(json_path, "r") as f:
        mappings = json.load(f)
else:
    print(f"❌ Mappings file not found at {json_path}")
