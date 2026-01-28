import React from "react";
import { Plus, XCircle, Wrench, Globe } from "lucide-react";


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

            {/* Título principal con icono */}
            <h3 className="cv-form-title">
                <Wrench size={18} className="section-icon" />
                Habilidades e Idiomas
            </h3>

            {/* SUBSECCIÓN: HABILIDADES */}
            <h4 className="cv-subtitle">
                <Wrench size={18} className="section-icon" />
                Habilidades
            </h4>

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
                        <XCircle size={18} />
                    </button>
                </div>
            ))}

            <button className="btn btn-outline" type="button" onClick={addSkill}>
                <Plus size={18} /> Agregar habilidad
            </button>

            {/* SUBSECCIÓN: IDIOMAS */}
            <h4 className="cv-subtitle">
                <Globe size={18} className="section-icon" />
                Idiomas
            </h4>

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
                        onClick={() => removeLanguage(i)}  // ← CORREGIDO
                    >
                        <XCircle size={18} />
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
