from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, JSON, DateTime, Date, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from datetime import datetime, date
from typing import List, Any

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    profile: Mapped["Profile"] = relationship("Profile", back_populates="user", uselist=False,
                                              cascade="all, delete-orphan")

    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    postulations: Mapped[list["Postulations"]] = relationship(
        "Postulations", back_populates="user", cascade="all, delete-orphan")

    todo_list: Mapped[List['TodoList']] = relationship(
        'TodoList', back_populates='user', cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active
        }


class CV(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    datos: Mapped[str] = mapped_column(db.Text, nullable=False)
    fecha_creacion: Mapped[datetime] = mapped_column(
        db.DateTime, default=db.func.current_timestamp())
    fecha_modificacion: Mapped[datetime] = mapped_column(
        db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user: Mapped["User"] = relationship(
        "User", backref=db.backref("cvs", lazy=True))

    def serialize(self):
        import json
        return {
            "id": self.id,
            "user_id": self.user_id,
            "datos": json.loads(self.datos) if self.datos else {},
            "fecha_creacion": self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            "fecha_modificacion": self.fecha_modificacion.isoformat() if self.fecha_modificacion else None
        }

    def __str__(self):
        return self.username


class Postulations(db.Model):
    __tablename__ = "postulations"

    id: Mapped[int] = mapped_column(primary_key=True)

    company_name: Mapped[str] = mapped_column(String(50), nullable=False)

    postulation_state: Mapped[str | None] = mapped_column(
        String(50), nullable=True)
    role: Mapped[str | None] = mapped_column(String(100), nullable=True)
    experience: Mapped[int | None] = mapped_column(Integer, nullable=True)
    inscription_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    city: Mapped[str | None] = mapped_column(String(50), nullable=True)
    salary: Mapped[int | None] = mapped_column(Integer, nullable=True)
    platform: Mapped[str | None] = mapped_column(String(100), nullable=True)
    postulation_url: Mapped[str | None] = mapped_column(
        String(2000), nullable=True)
    work_type: Mapped[str | None] = mapped_column(String(50), nullable=True)

    requirements: Mapped[list | None] = mapped_column(JSON, nullable=True)

    candidates_applied: Mapped[int | None] = mapped_column(
        Integer, nullable=True)
    available_positions: Mapped[int | None] = mapped_column(
        Integer, nullable=True)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="postulations")
    stages: Mapped[list["Stages"]] = relationship(
        "Stages",
        back_populates="postulation",
        cascade="all, delete-orphan"
    )

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
            "job_description": self.job_description,
            "stages": [stage.serialize() for stage in self.stages]
        }

    def __str__(self):
        return self.user.username if self.user else f"User ID {self.user_id}"


class Profile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    img_profile: Mapped[str] = mapped_column(String(50), nullable=False)
    bio: Mapped[str] = mapped_column(String(999999), nullable=False)
    skill: Mapped[List[str]] = mapped_column(
        JSON, nullable=False, default=list)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(
        "User", back_populates="profile", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "img_profile": self.img_profile,
            "bio": self.bio,
            "skill": self.skill,

        }

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Stages(db.Model):
    __tablename__ = 'stages'

    id: Mapped[int] = mapped_column(primary_key=True)
    stage_name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_completed_stage: Mapped[date] = mapped_column(Date, nullable=True)
    stage_completed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)

    postulation_id: Mapped[int] = mapped_column(
        ForeignKey('postulations.id'), nullable=False)
    postulation: Mapped['Postulations'] = relationship(
        'Postulations', back_populates='stages')

    def serialize(self):
        return {
            'id': self.id,
            'stage_name': self.stage_name,
            'date_completed_stage': self.date_completed_stage,
            'stage_completed': self.stage_completed
        }


class TodoList(db.Model):
    __tablename__ = 'todo_list'

    id: Mapped[int] = mapped_column(primary_key=True)
    todo_name: Mapped[str] = mapped_column(String(100), nullable=False)
    todo_complete: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)

    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    user: Mapped['User'] = relationship('User', back_populates='todo_list')
