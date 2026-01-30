import React from "react";
import { Plus, XCircle } from "lucide-react";
import { Building2 } from "lucide-react";



const ExperienceSection = ({ formData, updateCurrentCV }) => {
    const addExperience = () => {
        const nueva = {
            empresa: "",
            puesto: "",
            periodo: "",
            descripcion: ""
        };

        updateCurrentCV("experiencia", [...formData.experiencia, nueva]);
    };

    const updateExperience = (index, field, value) => {
        const updated = [...formData.experiencia];
        updated[index][field] = value;
        updateCurrentCV("experiencia", updated);
    };

    const removeExperience = (index) => {
        const updated = formData.experiencia.filter((_, i) => i !== index);
        updateCurrentCV("experiencia", updated);
    };

    return (
        <div className="cv-section-block">
            <h3 className="cv-section-title">
                <Building2 size={18} className="section-icon" />
                Experiencia Laboral
            </h3>

            {(formData.experiencia || []).length === 0 && (
                <p className="cv-section-empty">Aún no has agregado experiencia.</p>
            )}

            {(formData.experiencia || []).map((exp, i) => (
                <div key={i} className="cv-item">
                    <button
                        className="cv-item-remove"
                        type="button"
                        onClick={() => removeExperience(i)}
                    >
                        <XCircle size={18} />
                    </button>

                    <div className="cv-form-grid">
                        <div className="cv-form-group">
                            <label>Empresa</label>
                            <input
                                className="cv-input"
                                value={exp.empresa}
                                onChange={(e) =>
                                    updateExperience(i, "empresa", e.target.value)
                                }
                                placeholder="Nombre de la empresa"
                            />
                        </div>

                        <div className="cv-form-group">
                            <label>Puesto</label>
                            <input
                                className="cv-input"
                                value={exp.puesto}
                                onChange={(e) =>
                                    updateExperience(i, "puesto", e.target.value)
                                }
                                placeholder="Cargo desempeñado"
                            />
                        </div>

                        <div className="cv-form-group">
                            <label>Período</label>
                            <input
                                className="cv-input"
                                value={exp.periodo}
                                onChange={(e) =>
                                    updateExperience(i, "periodo", e.target.value)
                                }
                                placeholder="Ej: 2020 - 2023"
                            />
                        </div>
                    </div>

                    <div className="cv-form-group">
                        <label>Descripción</label>
                        <textarea
                            className="cv-input cv-textarea"
                            value={exp.descripcion}
                            onChange={(e) =>
                                updateExperience(i, "descripcion", e.target.value)
                            }
                            placeholder="Describe tus responsabilidades y logros..."
                            rows="3"
                        />
                    </div>
                </div>
            ))}

            <button className="cv-add-btn" type="button" onClick={addExperience}>
                <Plus size={18} /> Agregar experiencia
            </button>
        </div>

    );
};

export default ExperienceSection;
