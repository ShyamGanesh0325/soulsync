from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    match_id = Column(String) # "match_1", "bot_luna", etc.
    text = Column(String)
    sender = Column(String) # "user" or "match"
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_toxic = Column(Boolean, default=False)

    # Relationship to User
    user = relationship("User", back_populates="messages")
