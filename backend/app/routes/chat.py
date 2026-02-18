from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import random
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.message import Message as MessageModel
from app.models.user import User
from app.auth_utils import get_current_user

router = APIRouter()

# Mock Matches Database (Keep this for now as "Directory")
MOCK_MATCHES = [
    {
        "id": "match_1",
        "name": "Priya",
        "age": 24,
        "bio": "Coffee addict ☕ | Adventure seeker 🏔️ | Loves indie music",
        "compatibility_score": 89,
        "interests": ["travel", "music", "foodie"],
        "location": "Mumbai",
        "verified": True,
        "jobTitle": "UX Designer",
        "aura": "Vibrant",
        "lifestyle": {"smoking": "Never", "drinking": "Socially", "fitness": "Sometimes"},
        "height": 165
    },
    {
        "id": "match_2",
        "name": "Arjun",
        "age": 26,
        "bio": "Gym enthusiast 💪 | Gamer at heart 🎮 | Dog person",
        "compatibility_score": 76,
        "interests": ["gym", "gaming", "pets"],
        "location": "Delhi",
        "verified": True,
        "jobTitle": "Software Engineer",
        "aura": "Grounded",
        "lifestyle": {"smoking": "Never", "drinking": "Never", "fitness": "Daily"},
        "height": 182
    },
    {
        "id": "match_3",
        "name": "Ananya",
        "age": 23,
        "bio": "Bookworm 📚 | Night owl 🌙 | Always up for deep conversations",
        "compatibility_score": 92,
        "interests": ["reading", "music", "night_owl"],
        "location": "Bangalore",
        "verified": True,
        "jobTitle": "Publishing Editor",
        "aura": "Ethereal",
        "lifestyle": {"smoking": "Never", "drinking": "Socially", "fitness": "Rarely"},
        "height": 170
    },
    {
        "id": "bot_luna",
        "name": "Luna (AI Coach)",
        "age": 22,
        "bio": "Your Emotional Frequency coach 💫. Here to help you master deep connections and empathic vibes.",
        "compatibility_score": 100,
        "interests": ["empathy", "deep talk", "vibes"],
        "location": "Aura Plane",
        "verified": True,
        "jobTitle": "Vibe Mentor",
        "aura": "Mystic",
        "lifestyle": {"smoking": "Never", "drinking": "Never", "fitness": "Daily"},
        "height": 168,
        "is_bot": True
    },
    {
        "id": "bot_atlas",
        "name": "Atlas (AI Mentor)",
        "age": 24,
        "bio": "Your Vibe Spark specialist ⚡. Let's hone your icebreakers and charisma together!",
        "compatibility_score": 100,
        "interests": ["charisma", "icebreakers", "energy"],
        "location": "Nexus",
        "verified": True,
        "jobTitle": "Charisma Coach",
        "aura": "Electric",
        "lifestyle": {"smoking": "Never", "drinking": "Socially", "fitness": "Daily"},
        "height": 185,
        "is_bot": True
    }
]

class MessagePayload(BaseModel):
    match_id: str
    text: str
    sender: str  # "user" or "match"

class MessageResponse(BaseModel):
    success: bool
    is_toxic: bool
    warning: str = None
    message: Dict = None

@router.get("/matches")
async def get_matches():
    """Get all potential matches"""
    return {"matches": MOCK_MATCHES}

@router.get("/chat/{match_id}")
async def get_chat_history(match_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get message history for a specific match from DB"""
    messages = db.query(MessageModel).filter(
        MessageModel.user_id == current_user.id,
        MessageModel.match_id == match_id
    ).order_by(MessageModel.timestamp).all()
    
    # Convert DB objects to dicts
    msg_list = []
    for m in messages:
        msg_list.append({
            "id": m.id,
            "text": m.text,
            "sender": m.sender,
            "timestamp": m.timestamp.isoformat(),
            "is_toxic": m.is_toxic
        })
        
    return {"messages": msg_list}

@router.post("/chat/send", response_model=MessageResponse)
async def send_message(message: MessagePayload, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Send a message with toxicity check and persistence"""
    try:
        from better_profanity import profanity
        profanity.load_censor_words()  # Initialize the profanity filter
        
        # Check for toxicity
        is_toxic = profanity.contains_profanity(message.text)
        toxic_keywords = ["hate", "stupid", "idiot", "ugly"]
        has_toxic_keyword = any(word in message.text.lower() for word in toxic_keywords)
        final_toxic = is_toxic or has_toxic_keyword

        # Save User Message to DB
        user_msg = MessageModel(
            user_id=current_user.id,
            match_id=message.match_id,
            text=message.text,
            sender="user",
            timestamp=datetime.now(),
            is_toxic=final_toxic
        )
        db.add(user_msg)
        db.commit()
        db.refresh(user_msg)
        
        # If toxic, return warning
        if final_toxic:
            return MessageResponse(
                success=False,
                is_toxic=True,
                warning="This message contains inappropriate content. Please be respectful.",
                message={
                    "id": user_msg.id,
                    "text": user_msg.text,
                    "sender": "user",
                    "timestamp": user_msg.timestamp.isoformat(),
                    "is_toxic": True
                }
            )
        
        # If toxic, return warning
        if final_toxic:
            return MessageResponse(
                success=False,
                is_toxic=True,
                warning="This message contains inappropriate content. Please be respectful.",
                message={
                    "id": user_msg.id,
                    "text": user_msg.text,
                    "sender": "user",
                    "timestamp": user_msg.timestamp.isoformat(),
                    "is_toxic": True
                }
            )
        
        # Generate dynamic bot response using AI Service
        from app.services.ai_service import get_bot_response
        
        # Fetch recent history for context (last 5 messages)
        history_objs = db.query(MessageModel).filter(
            MessageModel.user_id == current_user.id,
            MessageModel.match_id == message.match_id
        ).order_by(MessageModel.timestamp.desc()).limit(6).all()
        
        history = [{"text": m.text, "sender": m.sender} for m in reversed(history_objs)]
        
        bot_text = await get_bot_response(message.match_id, message.text, history)
        
        bot_msg = MessageModel(
            user_id=current_user.id,
            match_id=message.match_id,
            text=bot_text,
            sender="match",
            timestamp=datetime.now(),
            is_toxic=False
        )
        db.add(bot_msg)
        db.commit()
        db.refresh(bot_msg)
        
        return MessageResponse(
            success=True,
            is_toxic=False,
            message={
                "id": user_msg.id,
                "text": user_msg.text,
                "sender": "user",
                "timestamp": user_msg.timestamp.isoformat(),
                "is_toxic": False
            }
        )
    except Exception as e:
        print(f"Error in send_message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

