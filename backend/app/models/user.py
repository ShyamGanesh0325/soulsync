from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    
    # Profile Fields
    age = Column(Integer)
    gender = Column(String)
    location = Column(String, default="Unknown")
    
    # Personality Traits (Big 5)
    openness = Column(Float, default=5.0)
    extroversion = Column(Float, default=5.0)
    agreeableness = Column(Float, default=5.0)
    neuroticism = Column(Float, default=5.0)
    conscientiousness = Column(Float, default=5.0)
    
    # Love Languages
    words_of_affirmation = Column(Float, default=5.0)
    quality_time = Column(Float, default=5.0)
    gifts = Column(Float, default=5.0)
    physical_touch = Column(Float, default=5.0)
    acts_of_service = Column(Float, default=5.0)
    
    # Interests / Lifestyle
    likes_music = Column(Boolean, default=False)
    likes_travel = Column(Boolean, default=False)
    likes_pets = Column(Boolean, default=False)
    foodie = Column(Boolean, default=False)
    gym_person = Column(Boolean, default=False)
    movie_lover = Column(Boolean, default=False)
    gamer = Column(Boolean, default=False)
    reader = Column(Boolean, default=False)
    night_owl = Column(Boolean, default=False)
    early_bird = Column(Boolean, default=False)
    
    # Demographics / Misc
    zodiac_sign = Column(String, default="Unknown")
    relationship_goal = Column(String, default="Unknown") # "Casual", "Long-term", "Marriage"
    fav_music_genre = Column(String, default="Pop")
    
    bio_text = Column(String, default="")
    
    # Prediction Results (Stored for caching)
    last_login = Column(String, nullable=True)

    # Relationships
    messages = relationship("Message", back_populates="user")

