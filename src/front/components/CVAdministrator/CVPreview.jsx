import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const CVPreview = ({ formData }) => {
    return (
        <div className="cv-pdf-card">
            <div className="cv-pdf-header">
                <div className="cv-pdf-header-left">
                    <h1 className="cv-name">{formData.nombre || "Nombre completo"}</h1>

                    <div className="cv-contact-line">
                        <Mail size={18} className="cv-contact-icon" />
                        <span>{formData.email || "correo@ejemplo.com"}</span>
                    </div>

                    <div className="cv-contact-line">
                        <Phone size={18} className="cv-contact-icon" />
                        <span>{formData.telefono || "+34 600 000 000"}</span>
                    </div>

                    <div className="cv-contact-line">
                        <MapPin size={18} className="cv-contact-icon" />
                        <span>{formData.ubicacion || "Ciudad, País"}</span>
                    </div>

                    {formData.linkedin && (
                        <div className="cv-contact-line">
                            <Linkedin size={18} className="cv-contact-icon" />
                            <span>{formData.linkedin}</span>
                        </div>
                    )}

                    {formData.github && (
                        <div className="cv-contact-line">
                            <Github size={18} className="cv-contact-icon" />
                            <span>{formData.github}</span>
                        </div>
                    )}
                </div>

                {formData.foto && (
                    <div className="cv-pdf-header-right">
                        <img
                            src={formData.foto}
                            alt="Foto de perfil"
                            className="cv-photo-card"
                        />
                    </div>
                )}
            </div>

            {formData.resumen && (
                <div className="cv-summary-block">
                    <h2 className="cv-summary-title">Resumen profesional</h2>
                    <p className="cv-summary-text">{formData.resumen}</p>
                </div>
            )}
        </div>
    );
};

export default CVPreview;
