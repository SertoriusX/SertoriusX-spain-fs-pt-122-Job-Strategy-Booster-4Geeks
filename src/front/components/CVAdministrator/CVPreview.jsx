import React from "react";
import { Mail, Phone, MapPin, Globe, Wrench } from "lucide-react";

const CVPreview = ({ formData }) => {
    return (
        <div className="cv-pdf-card">
            <div className="cv-pdf-header">
                <div className="cv-pdf-header-left">
                    <h1 className="cv-name">
                        {formData.nombre || "Nombre completo"}
                    </h1>

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

                    {Array.isArray(formData.redes) &&
                        formData.redes.map((red, i) => (
                            <div key={i} className="cv-contact-line">
                                <Globe size={18} className="cv-contact-icon" />
                                <span>{red.tipo}: {red.url}</span>
                            </div>
                        ))}
                </div>

                <div className="cv-pdf-header-right">
                    {formData.foto ? (
                        <img
                            src={formData.foto}
                            alt="Foto de perfil"
                            className="cv-photo-card"
                        />
                    ) : (
                        <div className="cv-photo-placeholder">Foto</div>
                    )}
                </div>
            </div>

            {formData.resumen && (
                <div className="cv-summary-block">
                    <h2 className="cv-summary-title">Resumen profesional</h2>
                    <p className="cv-summary-text">{formData.resumen}</p>
                </div>
            )}

            {Array.isArray(formData.habilidades) && formData.habilidades.length > 0 && (
                <div className="cv-section-block">
                    <h3 className="cv-section-title">
                        <Wrench size={18} className="section-icon" />
                        Habilidades
                    </h3>

                    {formData.habilidades.map((skill, i) => (
                        <div key={i} className="cv-item">{skill}</div>
                    ))}
                </div>
            )}

            {Array.isArray(formData.idiomas) && formData.idiomas.length > 0 && (
                <div className="cv-section-block">
                    <h3 className="cv-section-title">
                        <Globe size={18} className="section-icon" />
                        Idiomas
                    </h3>

                    {formData.idiomas.map((lang, i) => (
                        <div key={i} className="cv-item">{lang}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CVPreview;
