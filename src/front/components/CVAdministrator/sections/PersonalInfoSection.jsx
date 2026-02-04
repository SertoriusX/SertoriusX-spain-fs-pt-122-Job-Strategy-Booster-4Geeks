import React, { useRef } from "react";
import { Camera } from "lucide-react";

const PersonalInfoSection = ({ formData, updateCurrentCV }) => {
    const fileInputRef = useRef();

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');

                let width = img.width;
                let height = img.height;
                const maxSize = 800;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const jpegBase64 = canvas.toDataURL('image/jpeg', 0.9);

                updateCurrentCV("foto", jpegBase64);
            };
            img.onerror = () => {
                alert('Error al cargar la imagen. Intenta con otra foto.');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="cv-form-section">
            <h3 className="cv-form-title">Información Personal</h3>

            <div className="cv-form-header">
                <div className="cv-photo-wrapper">
                    {formData.foto && (
                        <img
                            src={formData.foto}
                            alt="Foto de perfil"
                            className="cv-photo"
                        />
                    )}

                    <button className="photo-upload-btn" onClick={handleUploadClick}>
                        <Camera size={18} />
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="cv-form-grid">
                    <div className="cv-form-group">
                        <label>Nombre completo</label>
                        <input
                            className="cv-input"
                            value={formData.nombre}
                            onChange={(e) => updateCurrentCV("nombre", e.target.value)}
                            placeholder="Ej: Juan Pérez García"
                        />
                    </div>

                    <div className="cv-form-group">
                        <label>Correo electrónico</label>
                        <input
                            className="cv-input"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateCurrentCV("email", e.target.value)}
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="cv-form-group">
                        <label>Teléfono</label>
                        <input
                            className="cv-input"
                            value={formData.telefono}
                            onChange={(e) => updateCurrentCV("telefono", e.target.value)}
                            placeholder="+34 600 000 000"
                        />
                    </div>

                    <div className="cv-form-group">
                        <label>Ubicación</label>
                        <input
                            className="cv-input"
                            value={formData.ubicacion}
                            onChange={(e) => updateCurrentCV("ubicacion", e.target.value)}
                            placeholder="Ciudad, País"
                        />
                    </div>

                    <div className="cv-form-group">
                        <label>LinkedIn</label>
                        <input
                            className="cv-input"
                            value={formData.linkedin}
                            onChange={(e) => updateCurrentCV("linkedin", e.target.value)}
                            placeholder="linkedin.com/in/usuario"
                        />
                    </div>

                    <div className="cv-form-group">
                        <label>GitHub</label>
                        <input
                            className="cv-input"
                            value={formData.github}
                            onChange={(e) => updateCurrentCV("github", e.target.value)}
                            placeholder="github.com/usuario"
                        />
                    </div>
                </div>
            </div>

            <div className="cv-form-group">
                <label>Resumen profesional</label>
                <textarea
                    className="cv-input cv-textarea"
                    value={formData.resumen}
                    onChange={(e) => updateCurrentCV("resumen", e.target.value)}
                    placeholder="Describe brevemente tu perfil profesional..."
                    rows="4"
                />
            </div>
        </div>
    );
};

export default PersonalInfoSection;
