import React from "react";
import { Plus, X } from "lucide-react";

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
        <div className="cv-form-section">
            <h3 className="cv-form-title">Experiencia Laboral</h3>

            {(formData.experiencia || []).map((exp, i) => (
                <div key={i} className="cv-modal-card">
                    <button
                        className="cv-modal-close"
                        type="button"
                        onClick={() => removeExperience(i)}
                    >
                        <X size={16} />
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

            <button className="btn btn-outline" type="button" onClick={addExperience}>
                <Plus size={18} /> Agregar experiencia
            </button>
        </div>
    );
};

export default ExperienceSection;
