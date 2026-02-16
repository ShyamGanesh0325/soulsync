from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "SoulSync API is running. use /api/predict_compatibility"}

def test_predict():
    payload = {
        "age": 28,
        "gender": "male",
        "location": "Mumbai",
        "openness": 7,
        "extroversion": 6,
        "agreeableness": 8,
        "neuroticism": 4,
        "conscientiousness": 7,
        "words_of_affirmation": 5,
        "quality_time": 4,
        "gifts": 2,
        "physical_touch": 3,
        "acts_of_service": 4,
        "likes_music": 1,
        "likes_travel": 1,
        "likes_pets": 1,
        "foodie": 1,
        "gym_person": 0,
        "movie_lover": 1,
        "gamer": 0,
        "reader": 1,
        "night_owl": 0,
        "early_bird": 1,
        "zodiac_sign": "Leo",
        "relationship_goal": "Commitment",
        "fav_music_genre": "Rock",
        "bio_text": "I love hiking and coding."
    }
    
    response = client.post("/api/predict_compatibility", json=payload)
    print("Response:", response.text)
    assert response.status_code == 200
    data = response.json()
    assert "compatibility_score" in data
    assert 0 <= data["compatibility_score"] <= 100

if __name__ == "__main__":
    test_root()
    test_predict()
    print("✅ All tests passed!")
