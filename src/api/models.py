from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, JSON, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime,date
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

    postulations: Mapped[list["Postulations"]] = relationship(
        "Postulations", back_populates="user", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active
        }
    def __str__(self):
        return self.username
    

class Postulations(db.Model):
    __tablename__ = "postulations"

    id: Mapped[int] = mapped_column(primary_key=True)
    postulation_state: Mapped[str] = mapped_column(String(50), nullable=False)
    company_name: Mapped[str] = mapped_column(String(50), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    experience: Mapped[int] = mapped_column(Integer, nullable=False)
    inscription_date: Mapped[date] = mapped_column(Date, nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    salary: Mapped[int] = mapped_column(Integer, nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    postulation_url: Mapped[str] = mapped_column(String(2000), nullable=False)
    work_type: Mapped[str] = mapped_column(String(50), nullable=False)

    requirements: Mapped[List[str]] = mapped_column(JSON, nullable=False)    
    
    candidates_applied: Mapped[int] = mapped_column(Integer, nullable=False)
    available_positions: Mapped[int] = mapped_column(Integer, nullable=False)
    job_description: Mapped[str] = mapped_column(String(500), nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship("User", back_populates="postulations")

    def serialize(self):
        return {
        "id": self.id,
        "postulation_state": self.postulation_state,
        "company_name": self.company_name,
        "role": self.role,
        "experience": self.experience,
        "inscription_date": self.inscription_date.isoformat() if self.inscription_date else None,
        "city": self.city,
        "salary": self.salary,
        "platform": self.platform,
        "postulation_url": self.postulation_url,
        "work_type": self.work_type,
        "requirements": self.requirements,
        "candidates_applied": self.candidates_applied,
        "available_positions": self.available_positions,
        "job_description": self.job_description
    }


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