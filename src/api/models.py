from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
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
