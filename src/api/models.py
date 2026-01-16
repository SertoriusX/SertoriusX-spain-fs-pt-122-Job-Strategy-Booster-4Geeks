from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Column, Integer, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

profile_skill = Table(
    'profile_skill',
    db.metadata,
    Column('profile_id', Integer, ForeignKey('profile.id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skill.id'), primary_key=True)
)

postulaciones_skill = Table(
    'postulaciones_skill',
    db.metadata,
    Column('postulaciones_id', Integer, ForeignKey(
        'postulaciones.id'), primary_key=True),
    Column('skill_id', Integer, ForeignKey('skill.id'), primary_key=True)
)


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
    image_filename: Mapped[str] = mapped_column(
        String(255), nullable=True)  # store image filename or path
    bio: Mapped[str] = mapped_column(String(5000), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship("User", back_populates="profile")
    gender_id: Mapped[int] = mapped_column(ForeignKey("gender.id"))
    gender: Mapped["Gender"] = relationship(
        "Gender", back_populates="profiles")
    skills: Mapped[list["Skill"]] = relationship(
        "Skill",
        secondary=profile_skill,
        back_populates="profiles"
    )

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio,
            "image_filename": self.image_filename,
            "gender": self.gender.name

        }


class Gender(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    profiles: Mapped[list["Profile"]] = relationship(
        "Profile", back_populates="gender")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class City(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="city")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Skill(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    profiles: Mapped[list["Profile"]] = relationship(
        "Profile",
        secondary=profile_skill,
        back_populates="skills"
    )
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones",
        secondary=postulaciones_skill,
        back_populates="skills"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class SocialMedia(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    image_filename: Mapped[str] = mapped_column(
        String(255), nullable=True)  # store image filename or path
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="social_media")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_filename": self.image_filename,

        }


class Status(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="status")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,

        }


class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,

        }


class WorkType(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="work_type")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,

        }


class EmploymentType(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="employment_type")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,

        }


class Postulaciones(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_empressa: Mapped[str] = mapped_column(String(50), nullable=False)

    city_id: Mapped[int] = mapped_column(ForeignKey("city.id"), nullable=False)
    city: Mapped["City"] = relationship("City", back_populates="postulaciones")

    social_media_id: Mapped[int] = mapped_column(
        ForeignKey("social_media.id"), nullable=False)
    social_media: Mapped["SocialMedia"] = relationship(
        "SocialMedia", back_populates="postulaciones")

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

    persona_de_contacto: Mapped[str] = mapped_column(
        String(50), nullable=False)
    email_de_contacto: Mapped[str] = mapped_column(String(50), nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="postulaciones")

    skills: Mapped[list["Skill"]] = relationship(
        "Skill",
        secondary=postulaciones_skill,
        back_populates="postulaciones"
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre_empresa": self.nombre_empressa, 
            "social_media": self.social_media.name,
            "status": self.status.name,
            "category": self.category.name,
            "work_type": self.work_type.name,
            "employment_type": self.employment_type.name,
            "persona_de_contacto": self.persona_de_contacto,
            "email_de_contacto": self.email_de_contacto,
            "skills": [skill.name for skill in self.skills],
        }
