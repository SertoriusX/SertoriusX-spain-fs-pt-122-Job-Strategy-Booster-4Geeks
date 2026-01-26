import React from "react";
import { Plus, X } from "lucide-react";

const SkillsSection = ({ formData, updateCurrentCV }) => {

    const addSkill = () => {
        updateCurrentCV("habilidades", [...formData.habilidades, ""]);
    };

    const updateSkill = (index, value) => {
        const updated = [...formData.habilidades];
        updated[index] = value;
        updateCurrentCV("habilidades", updated);
    };

    const removeSkill = (index) => {
        const updated = formData.habilidades.filter((_, i) => i !== index);
        updateCurrentCV("habilidades", updated);
    };

    const addLanguage = () => {
        updateCurrentCV("idiomas", [...formData.idiomas, ""]);
    };

    const updateLanguage = (index, value) => {
        const updated = [...formData.idiomas];
        updated[index] = value;
        updateCurrentCV("idiomas", updated);
    };

    const removeLanguage = (index) => {
        const updated = formData.idiomas.filter((_, i) => i !== index);
        updateCurrentCV("idiomas", updated);
    };

    return (
        <div className="cv-form-section">
            <h3 className="cv-form-title">Habilidades e Idiomas</h3>

            {/* HABILIDADES */}
            <h4 className="cv-subtitle">Habilidades</h4>

            {(formData.habilidades || []).map((skill, i) => (
                <div key={i} className="cv-tag-row">
                    <input
                        className="cv-input"
                        value={skill}
                        onChange={(e) => updateSkill(i, e.target.value)}
                        placeholder="Ej: React, Comunicación, Liderazgo..."
                    />

                    <button
                        className="cv-tag-remove"
                        type="button"
                        onClick={() => removeSkill(i)}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}

            <button className="btn btn-outline" type="button" onClick={addSkill}>
                <Plus size={18} /> Agregar habilidad
            </button>

            {/* IDIOMAS */}
            <h4 className="cv-subtitle">Idiomas</h4>

            {(formData.idiomas || []).map((lang, i) => (
                <div key={i} className="cv-tag-row">
                    <input
                        className="cv-input"
                        value={lang}
                        onChange={(e) => updateLanguage(i, e.target.value)}
                        placeholder="Ej: Español (Nativo), Inglés (B2)..."
                    />

                    <button
                        className="cv-tag-remove"
                        type="button"
                        onClick={() => removeLanguage(i)}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}

            <button className="btn btn-outline" type="button" onClick={addLanguage}>
                <Plus size={18} /> Agregar idioma
            </button>
        </div>
    );
};

export default SkillsSection;
