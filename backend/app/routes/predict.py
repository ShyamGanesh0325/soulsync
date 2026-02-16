from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas import UserProfile, PredictionResponse, UserResponse
from app.model_loader import loader
from app.utils.mappings import mappings
from app.utils.bio_analyzer import analyze_bio
from app.utils.feature_stats import feature_stats
from app.database import get_db
from app.models.user import User
from app.auth_utils import get_current_user
import pandas as pd
import numpy as np

router = APIRouter()

@router.post("/predict_compatibility", response_model=PredictionResponse)
async def predict_compatibility(profile: UserProfile, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # --- Save Profile to DB ---
    user_dict = profile.dict()
    for key, value in user_dict.items():
        if hasattr(current_user, key):
            setattr(current_user, key, value)
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    if not loader.model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # 1. Prepare Basic Features
    data = {
        "age": profile.age,
        "openness": profile.openness,
        "extroversion": profile.extroversion,
        "agreeableness": profile.agreeableness,
        "neuroticism": profile.neuroticism,
        "conscientiousness": profile.conscientiousness,
        "words_of_affirmation": profile.words_of_affirmation,
        "quality_time": profile.quality_time,
        "gifts": profile.gifts,
        "physical_touch": profile.physical_touch,
        "acts_of_service": profile.acts_of_service,
        "likes_music": profile.likes_music,
        "likes_travel": profile.likes_travel,
        "likes_pets": profile.likes_pets,
        "foodie": profile.foodie,
        "gym_person": profile.gym_person,
        "movie_lover": profile.movie_lover,
        "gamer": profile.gamer,
        "reader": profile.reader,
        "night_owl": profile.night_owl,
        "early_bird": profile.early_bird,
    }

    # 2. Encode Categorical Features
    # Helper to map string to int
    def encode(col, val):
        val_str = str(val).lower() if isinstance(val, str) else str(val)
        # Try exact match first
        if val in mappings.get(col, {}):
             return mappings[col][val]
        # Try lowercase match
        for k, v in mappings.get(col, {}).items():
            if k.lower() == val_str:
                return v
        # Default/Unknown
        return 0

    data["gender"] = encode("gender", profile.gender)
    data["location"] = encode("location", profile.location)
    data["zodiac_sign"] = encode("zodiac_sign", profile.zodiac_sign)
    data["relationship_goal"] = encode("relationship_goal", profile.relationship_goal)
    data["fav_music_genre"] = encode("fav_music_genre", profile.fav_music_genre)
    
    # 3. Handle Bio
    # We map bio_text to 0 (unknown) because exact text match is impossible
    data["bio_text"] = 0 
    
    # Calculate sentiment dynamically
    data["bio_sentiment"] = analyze_bio(profile.bio_text)

    # 4. Fill Behavioral/Missing Features with Dataset Mean
    # These are features the model expects but a new user doesn't have yet.
    # We use the mean from the training set to "neutralize" them.
    missing_features = [
        "humor_score", "confidence_score", "reply_time_avg", "msg_length_avg", 
        "sentiment_chat", "engagement_rate", 
        # Targets that are used as input (Model Artifact Issue)
        "compatibility_score", "ghosting_probability", "toxicity_label"
    ]

    for feat in missing_features:
        data[feat] = feature_stats.get_mean(feat)

    # 5. Create DataFrame with Correct Column Order
    # The CatBoost model expects specific feature names.
    # We must match the order from inspect_model output.
    expected_features = [
        'age', 'gender', 'location', 'openness', 'extroversion', 'agreeableness', 
        'neuroticism', 'conscientiousness', 'words_of_affirmation', 'quality_time', 
        'gifts', 'physical_touch', 'acts_of_service', 'likes_music', 'likes_travel', 
        'likes_pets', 'foodie', 'gym_person', 'movie_lover', 'gamer', 'reader', 
        'night_owl', 'early_bird', 'zodiac_sign', 'relationship_goal', 'fav_music_genre', 
        'bio_text', 'bio_sentiment', 'humor_score', 'confidence_score', 'reply_time_avg', 
        'msg_length_avg', 'sentiment_chat', 'engagement_rate', 'compatibility_score', 
        'ghosting_probability', 'toxicity_label'
    ]
    
    df = pd.DataFrame([data], columns=expected_features)

    # 6. Apply Scaling manually
    # We scale numerical columns using (x - mean) / std
    # Which columns? All except categorical? 
    # Notebook scaled almost everything including binary.
    # We will scale everything that is in feature_stats.
    for col in df.columns:
        if col in feature_stats.stats["mean"]:
            mean = feature_stats.get_mean(col)
            std = feature_stats.get_std(col)
            if std == 0: std = 1
            df[col] = (df[col] - mean) / std

    # 7. Predict
    # We use predict_proba for conversation_success (Class 1) as our "Compatibility Score"
    try:
        probabilities = loader.model.predict_proba(df)
        success_prob = probabilities[0][1] # Probability of class 1
        
        # Ghosting probability
        ghosting_prob = 1.0 - success_prob 

        # --- Phase 2: Logic (Now has access to predictions) ---

        # 8. Calculate Safety Score (Heuristic)
        # High Conscientiousness + High Agreeableness + Positive Bio = High Safety
        safe_raw = 50 + (profile.agreeableness * 3) + (profile.conscientiousness * 3) + (data["bio_sentiment"] * 10)
        safety_score = min(100.0, max(0.0, safe_raw))

        # 9. Match Details (Sub-scores 0-100)
        match_details = {
            "personality_strength": float(np.mean([profile.openness, profile.extroversion, profile.agreeableness, profile.neuroticism, profile.conscientiousness]) * 10),
            "love_style_intensity": float(np.mean([profile.words_of_affirmation, profile.quality_time, profile.gifts, profile.physical_touch, profile.acts_of_service]) * 20),
            "lifestyle_match": float(np.mean([profile.likes_music, profile.likes_travel, profile.foodie, profile.gym_person]) * 100)
        }

        # 10. Generate Icebreakers
        icebreakers = []
        if profile.likes_music: icebreakers.append("I see you like music! What's the best concert you've ever been to?")
        if profile.likes_travel: icebreakers.append("If you could teleport anywhere right now, where would you go?")
        if profile.foodie: icebreakers.append("What's your absolute comfort food?")
        if profile.gamer: icebreakers.append("Console or PC? (Careful, there's a right answer 😉)")
        if profile.reader: icebreakers.append("What's the last book that kept you up all night?")
        if not icebreakers: icebreakers.append("What's the most spontaneous thing you've done recently?")
        selected_icebreakers = icebreakers[:3]
        
        # 11. Generate Personality Flags
        flags = []
        # Green
        if profile.conscientiousness > 7: flags.append({"type": "green", "text": "Replies fast ⚡"})
        if profile.openness > 7: flags.append({"type": "green", "text": "Adventurous 🌍"})
        if profile.agreeableness > 7: flags.append({"type": "green", "text": "Walking Therapist 🧠"})
        # Beige
        if profile.gym_person: flags.append({"type": "beige", "text": "Protein obsession 🏋️"})
        if profile.gamer: flags.append({"type": "beige", "text": "Gamer Rage potential 🎮"})
        if profile.zodiac_sign == "Scorpio": flags.append({"type": "beige", "text": "Mysterious AF 🦂"})
        if profile.foodie: flags.append({"type": "beige", "text": "Food > You 🍕"})
        # Red
        if profile.neuroticism > 8: flags.append({"type": "red", "text": "Overthinks everything 🤯"})
        if ghosting_prob > 0.6: flags.append({"type": "red", "text": "Ghosting Risk 👻"})
        selected_flags = flags[:4]

        # 12. Generate Relationship Timeline
        timeline = []
        # Month 1
        m1_event = "Late night drive & deep talks 🌙"
        if profile.foodie: m1_event = "Exploring the city's hidden food gems 🍜"
        elif profile.gamer: m1_event = "Co-op gaming marathon 🎮"
        elif profile.likes_music: m1_event = "First concert date together 🎸"
        timeline.append({"time": "Month 1", "event": m1_event})
        # Month 6
        m6_event = "Meeting the best friends 👯‍♀️"
        if profile.likes_travel: m6_event = "First weekend getaway trip ✈️"
        elif profile.likes_pets: m6_event = "Adopted a stray cat together 🐈"
        timeline.append({"time": "Month 6", "event": m6_event})
        # Year 1
        y1_event = "Still vibing (surprisingly) ✨"
        if profile.relationship_goal == "Long-term": y1_event = "Moving in together? 🏠"
        elif profile.relationship_goal == "Marriage": y1_event = "The 'Talk' happens 💍"
        timeline.append({"time": "Year 1", "event": y1_event})

        return PredictionResponse(
            compatibility_score=float(success_prob * 100),
            ghosting_probability=float(ghosting_prob * 100),
            conversation_success=float(success_prob),
            bio_feedback="Great bio!" if data["bio_sentiment"] > 0 else "Consider making your bio more positive.",
            safety_score=float(safety_score),
            match_details=match_details,
            icebreakers=selected_icebreakers,
            timeline=timeline,
            flags=selected_flags
        )

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
