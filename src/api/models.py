from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Column, Integer, Table, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

# Association tables

# Profile <-> Skill many-to-many
profile_skill = Table(
    'profile_skill',
    db.metadata,
    Column('profile_id', Integer, ForeignKey('profile.id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skill.id'), primary_key=True)
)

# Postulaciones <-> Skill many-to-many
postulaciones_skill = Table(
    'postulaciones_skill',
    db.metadata,
    Column('postulaciones_id', Integer, ForeignKey(
        'postulaciones.id', ondelete="CASCADE"), primary_key=True),
    Column('skill_id', Integer, ForeignKey(
        'skill.id', ondelete="CASCADE"), primary_key=True),
    extend_existing=True
)

# SocialMedia <-> SocialMediaStatus many-to-many association table (MISSING from your code, so adding)
social_media_status_association = Table(
    'social_media_status_association',
    db.metadata,
    Column('social_media_id', Integer, ForeignKey(
        'social_media.id', ondelete='CASCADE'), primary_key=True),
    Column('social_media_status_id', Integer, ForeignKey(
        'social_media_status.id', ondelete='CASCADE'), primary_key=True),
)

# Postulaciones <-> SocialMedia many-to-many with extra status id stored in association table
postulacion_social_media = Table(
    'postulacion_social_media',
    db.metadata,
    Column('postulacion_id', ForeignKey('postulaciones.id'), primary_key=True),
    Column('social_media_id', ForeignKey('social_media.id'), primary_key=True),
    Column('social_media_status_id', ForeignKey('social_media_status.id')),
)

# === MODELS ===


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="user", uselist=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
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
    image_filename: Mapped[str] = mapped_column(String(255), nullable=True)
    bio: Mapped[str] = mapped_column(String(5000), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship("User", back_populates="profile")
    gender_id: Mapped[int] = mapped_column(ForeignKey("gender.id"))
    gender: Mapped["Gender"] = relationship(
        "Gender", back_populates="profiles")
    skills: Mapped[list["Skill"]] = relationship(
        "Skill", secondary=profile_skill, back_populates="profiles")

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio,
            "image_filename": self.image_filename,
            "gender": self.gender.name if self.gender else None,
            "gender_r": {
                "id": self.gender_id,
                "name": self.gender.name if self.gender else None
            } if self.gender else None,
            "skills": [skill.name for skill in self.skills],
        }


class Gender(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    profiles: Mapped[list["Profile"]] = relationship(
        "Profile", back_populates="gender")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class City(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="city")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Skill(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    profiles: Mapped[list["Profile"]] = relationship(
        "Profile", secondary=profile_skill, back_populates="skills")
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", secondary=postulaciones_skill, back_populates="skills")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class SocialMedia(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    image_filename: Mapped[str] = mapped_column(String(255), nullable=True)

    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones",
        secondary=postulacion_social_media,
        back_populates="social_medias",
    )

    statuses: Mapped[list["SocialMediaStatus"]] = relationship(
        "SocialMediaStatus",
        secondary=social_media_status_association,
        back_populates="social_medias",
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_filename": self.image_filename,
            "statuses": [status.serialize() for status in self.statuses],
        }


class SocialMediaStatus(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)

    social_medias: Mapped[list["SocialMedia"]] = relationship(
        "SocialMedia",
        secondary=social_media_status_association,
        back_populates="statuses",
    )

    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones",
        secondary=postulacion_social_media,
        back_populates="social_media_statuses",
    )

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Status(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="status")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="category")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class WorkType(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="work_type")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class EmploymentType(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="employment_type")

    def serialize(self):
        return {"id": self.id, "name": self.name}


class Postulaciones(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_empresa: Mapped[str] = mapped_column(String(50), nullable=False)
    expireiance: Mapped[str] = mapped_column(String(50), nullable=False)
    salary: Mapped[str] = mapped_column(String(50), nullable=False)

    city_id: Mapped[int] = mapped_column(ForeignKey("city.id"), nullable=False)
    city: Mapped["City"] = relationship("City", back_populates="postulaciones")

    status_id: Mapped[int] = mapped_column(
        ForeignKey("status.id"), nullable=False)
    status: Mapped["Status"] = relationship(
        "Status", back_populates="postulaciones")

    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), nullable=False)
    category: Mapped["Category"] = relationship(
        "Category", back_populates="postulaciones")

    work_type_id: Mapped[int] = mapped_column(
        ForeignKey("work_type.id"), nullable=False)
    work_type: Mapped["WorkType"] = relationship(
        "WorkType", back_populates="postulaciones")

    employment_type_id: Mapped[int] = mapped_column(
        ForeignKey("employment_type.id"), nullable=False)
    employment_type: Mapped["EmploymentType"] = relationship(
        "EmploymentType", back_populates="postulaciones")

    job_description: Mapped[str] = mapped_column(String(2000), nullable=False)
    requirements: Mapped[str] = mapped_column(String(2000), nullable=False)
    persona_de_contacto: Mapped[str] = mapped_column(
        String(50), nullable=False)
    positions: Mapped[str] = mapped_column(String(50), nullable=False)
    candidates_applied: Mapped[str] = mapped_column(String(50), nullable=False)
    completed_interviews: Mapped[str] = mapped_column(
        String(50), nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="postulaciones")

    skills: Mapped[list["Skill"]] = relationship(
        "Skill",
        secondary=postulaciones_skill,
        back_populates="postulaciones",
        cascade="all, delete"
    )

    social_medias: Mapped[list["SocialMedia"]] = relationship(
        "SocialMedia",
        secondary=postulacion_social_media,
        back_populates="postulaciones",
        cascade="all, delete"
    )

    social_media_statuses: Mapped[list["SocialMediaStatus"]] = relationship(
        "SocialMediaStatus",
        secondary=postulacion_social_media,
        back_populates="postulaciones",
        cascade="all, delete"
    )

    matched_percentage: Mapped[float] = mapped_column(Float, default=0.0)

    def serialize(self):
        social_media_with_statuses = []
        for sm in self.social_medias:
            social_media_with_statuses.append({
                "social_media": sm.name,
                "statuses": [status.name for status in sm.statuses]
            })

        return {
            "id": self.id,
            "nombre_empresa": self.nombre_empresa,
            "expireiance": self.expireiance,
            "salary": self.salary,
            "city": self.city.name if self.city else None,
            "status": self.status.name if self.status else None,
            "category": self.category.name if self.category else None,
            "work_type": self.work_type.name if self.work_type else None,
            "employment_type": self.employment_type.name if self.employment_type else None,
            "persona_de_contacto": self.persona_de_contacto,
            "skills": [skill.name for skill in self.skills],
            "social_medias": social_media_with_statuses,
            "positions": self.positions,
            "candidates_applied": self.candidates_applied,
            "completed_interviews": self.completed_interviews,
            "job_description": self.job_description,
            "requirements": self.requirements,
            "matched_percentage": self.matched_percentage
        }
