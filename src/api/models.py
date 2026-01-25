from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List, Any

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    profile:Mapped["Profile"] = relationship("Profile", back_populates="user",uselist=False,
        cascade="all, delete-orphan")

    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active
        }
    def __str__(self):
        return self.username
    

class Profile(db.Model):
        id: Mapped[int] = mapped_column(primary_key=True)
        first_name: Mapped[str] = mapped_column(String(50), nullable=False)
        last_name: Mapped[str] = mapped_column(String(50), nullable=False)
        img_profile: Mapped[str] = mapped_column(String(50), nullable=False)
        bio: Mapped[str] = mapped_column(String(999999), nullable=False)
        skill: Mapped[List[str]] = mapped_column(JSON, nullable=False, default=list)
        user_id:Mapped[int]=mapped_column(ForeignKey("user.id"))
        user:Mapped["User"] = relationship("User", back_populates="profile",uselist=False)
        def serialize(self):
            return {
                "id": self.id,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "img_profile":self.img_profile,
                "bio": self.bio,
                "skill": self.skill,
                
            }
        def __str__(self):
            return f"{ self.first_name} {self.last_name}"