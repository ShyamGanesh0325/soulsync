from pydantic import BaseModel, EmailStr
from typing import Dict, Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    
    # Profile Data (Optional at signup, but good to have structure)
    age: int = 18
    gender: str = "Other"
    location: str = "Unknown"
    
    # Defaults
    openness: float = 5.0
    extroversion: float = 5.0
    agreeableness: float = 5.0
    neuroticism: float = 5.0
    conscientiousness: float = 5.0
    
    words_of_affirmation: int = 5
    quality_time: int = 5
    gifts: int = 5
    physical_touch: int = 5
    acts_of_service: int = 5
    
    likes_music: bool = False
    likes_travel: bool = False
    likes_pets: bool = False
    foodie: bool = False
    gym_person: bool = False
    movie_lover: bool = False
    gamer: bool = False
    reader: bool = False
    night_owl: bool = False
    early_bird: bool = False
    
    zodiac_sign: str = "Unknown"
    relationship_goal: str = "Unknown"
    fav_music_genre: str = "Pop"
    bio_text: str = ""

class UserProfile(BaseModel):
    age: int
    gender: str  # Male, Female, Other
    location: str
    
    # Big 5 Traits
    openness: float
    extroversion: float
    agreeableness: float
    neuroticism: float
    conscientiousness: float
    
    # Love Languages
    words_of_affirmation: int
    quality_time: int
    gifts: int
    physical_touch: int
    acts_of_service: int
    
    # Interests
    likes_music: int
    likes_travel: int
    likes_pets: int
    foodie: int
    gym_person: int
    movie_lover: int
    gamer: int
    reader: int
    night_owl: int
    early_bird: int
    
    # Categorical
    zodiac_sign: str
    relationship_goal: str
    fav_music_genre: str
    
    # Bio
    bio_text: str

class UserResponse(UserProfile):
    id: int
    email: EmailStr
    full_name: str
    
    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    compatibility_score: float
    ghosting_probability: float
    conversation_success: float
    bio_feedback: Optional[str] = None
    
    # Phase 2 Features
    safety_score: float
    match_details: Dict[str, float]
    icebreakers: list[str]
    timeline: list[dict]
    flags: list[dict]
