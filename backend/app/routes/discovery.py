from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth_utils import get_current_user
from app.schemas import PredictionResponse, UserProfile
from app.routes.predict import predict_compatibility
from app.routes.chat import MOCK_MATCHES

router = APIRouter()

@router.get("/insights/{match_id}", response_model=PredictionResponse)
async def get_match_insights(match_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Generate resonance insights for a specific match"""
    match = next((m for m in MOCK_MATCHES if m["id"] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    # Create a profile object from the match data to run through the prediction engine
    match_profile = UserProfile(
        age=match["age"],
        gender="Female" if "Priya" in match["name"] or "Ananya" in match["name"] else "Male",
        location=match["location"],
        openness=match["traits"]["openness"],
        extroversion=match["traits"]["extroversion"],
        agreeableness=match["traits"]["agreeableness"],
        neuroticism=match["traits"]["neuroticism"],
        conscientiousness=match["traits"]["conscientiousness"],
        words_of_affirmation=5,
        quality_time=5,
        gifts=5,
        physical_touch=5,
        acts_of_service=5,
        likes_music=1 if "music" in match["interests"] else 0,
        likes_travel=1 if "travel" in match["interests"] else 0,
        likes_pets=1 if "pets" in match["interests"] else 0,
        foodie=1 if "foodie" in match["interests"] else 0,
        gym_person=1 if "gym" in match["interests"] else 0,
        movie_lover=0,
        gamer=1 if "gaming" in match["interests"] else 0,
        reader=1 if "reading" in match["interests"] else 0,
        night_owl=1 if "night_owl" in match["interests"] else 0,
        early_bird=0,
        zodiac_sign="Unknown",
        relationship_goal=match.get("goal", "Unknown"),
        fav_music_genre="Pop",
        bio_text=match["bio"]
    )

    return await predict_compatibility(match_profile, db, current_user)
