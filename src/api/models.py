from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    postulaciones: Mapped[list["Postulaciones"]] = relationship(
        "Postulaciones", back_populates="user")
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Postulaciones(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre_empressa: Mapped[str] = mapped_column(String(50), nullable=False)
    skills: Mapped[list] = mapped_column(JSON, nullable=False)
    plataform: Mapped[list] = mapped_column(JSON, nullable=False)
    estado: Mapped[list] = mapped_column(JSON, nullable=False)
    ubicación: Mapped[list] = mapped_column(JSON, nullable=False)
    modalidad: Mapped[list] = mapped_column(JSON, nullable=False)
    salario: Mapped[str] = mapped_column(String(50), nullable=False)
    persona_de_contacto: Mapped[str] = mapped_column(
        String(50), nullable=False)
    email_de_contacto: Mapped[str] = mapped_column(String(50), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="postulaciones")
