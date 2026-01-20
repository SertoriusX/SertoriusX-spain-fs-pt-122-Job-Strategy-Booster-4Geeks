from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="user", uselist=False)
    postulaciones: Mapped[list["Postulations"]] = relationship(
        "Postulaciones", back_populates="user")
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }


class Profile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    image_filename: Mapped[str] = mapped_column(
        String(255), nullable=True)  # store image filename or path
    bio: Mapped[str] = mapped_column(String(5000), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship("User", back_populates="profile")

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio,
            "image_filename": self.image_filename,
        }


class Status(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulations"]] = relationship(
        "Postulaciones", back_populates="status")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Postulations(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    postulation_state : Mapped[str] = mapped_column(String(50), nullable=False)
    company_name: Mapped[str] = mapped_column(String(50), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    expireiance: Mapped[int] = mapped_column(Integer, nullable=False)
    inscription_date: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    salary: Mapped[float] = mapped_column(Float, nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    postulation_url: Mapped[str] = mapped_column(String(5000), nullable=False)
    work_type: Mapped[str] = mapped_column(String(50), nullable=False)
    requirements: Mapped[list] = mapped_column(JSON, nullable=False)
    candidates_applied: Mapped[int] = mapped_column(Integer, nullable=False)
    available_positions: Mapped[int] = mapped_column(Integer, nullable=False)
    job_description: Mapped[str] = mapped_column(String(500), nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship("User", back_populates="postulations")

    def serialize(self):
        return {
            "id": self.id,
            "postulation_state" : self.postulation_state,
            "company_name": self.company_name,
            "role": self.role,
            "expireiance": self.expireiance,
            "inscription_date": self.inscription_date,
            "city" : self.city,
            "salary" : self.salary,
            "platform" : self.platform,
            "postulation_url" : self.postulation_url,
            "work_type" : self.work_type,
            "requirements" : self.requirements,
            "candidates_applied" : self.candidates_applied,
            "available_positions" : self.available_positions,
            "job_description" : self.job_description
        }
