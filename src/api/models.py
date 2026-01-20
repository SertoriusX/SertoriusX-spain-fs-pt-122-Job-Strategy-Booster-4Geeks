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
        'postulaciones.id', ondelete="CASCADE"), primary_key=True),
    Column('skill_id', Integer, ForeignKey(
        'skill.id', ondelete="CASCADE"), primary_key=True),
    extend_existing=True
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
    skill:Mapped= mapped_column(String(300), nullable=False)


    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship("User", back_populates="profile")
    
   
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio,
            "image_filename": self.image_filename,
            "gender": self.gender.name

        }

class Skill(db.Model):
    id:Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)



class Postulaciones(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_empressa: Mapped[str] = mapped_column(String(50), nullable=False)

    company_name: Mapped[str] = mapped_column(String(50), nullable=False)
    position : Mapped[str] = mapped_column(String(50), nullable=False)
    platform : Mapped[str] = mapped_column(String(50), nullable=False)
    postulation_: Mapped[str] = mapped_column(String(50), nullable=False)
    work_type : Mapped[str] = mapped_column(String(50), nullable=False)
    salary : Mapped[str] = mapped_column(String(50), nullable=False)
    city : Mapped[str] = mapped_column(String(50), nullable=False)
    postulation_date : Mapped[str] = mapped_column(String(50), nullable=False)
    candidates : Mapped[str] = mapped_column(String(50), nullable=False)
    experience : Mapped[str] = mapped_column(String(50), nullable=False)
    skills : Mapped[str] = mapped_column(String(50), nullable=False)
    postulation_state : Mapped[str]  =mapped_column(String(300), nullable=False)
    skill1:Mapped= mapped_column(String(300), nullable=False)
    skill2:Mapped= mapped_column(String(300), nullable=False)
    skill3:Mapped= mapped_column(String(300), nullable=False)
    skill4:Mapped= mapped_column(String(300), nullable=False)
    skill5:Mapped= mapped_column(String(300), nullable=False)
    skill6:Mapped= mapped_column(String(300), nullable=False)
    skill7:Mapped= mapped_column(String(300), nullable=False)
