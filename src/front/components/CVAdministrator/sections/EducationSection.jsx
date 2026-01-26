import React from "react";
import { Plus, X } from "lucide-react";

const EducationSection = ({ formData, updateCurrentCV }) => {
    const addEducation = () => {
        const nueva = {
            institucion: "",
            titulo: "",
            periodo: ""
        };

        updateCurrentCV("educacion", [...formData.educacion, nueva]);
    };

    const updateEducation = (index, field, value) => {
        const updated = [...formData.educacion];
        updated[index][field] = value;
        updateCurrentCV("educacion", updated);
    };

    const removeEducation = (index) => {
        const updated = formData.educacion.filter((_, i) => i !== index);
        updateCurrentCV("educacion", updated);
    };

    return (
        <div className="cv-form-section">
            <h3 className="cv-form-title">Formación Académica</h3>

            {(formData.educacion || []).map((edu, i) => (
                <div key={i} className="cv-modal-card">
                    <button
                        className="cv-modal-close"
                        type="button"
                        onClick={() => removeEducation(i)}
                    >
                        <X size={16} />
                    </button>

                    <div className="cv-form-grid">
                        <div className="cv-form-group">
                            <label>Institución</label>
                            <input
                                className="cv-input"
                                value={edu.institucion}
                                onChange={(e) =>
                                    updateEducation(i, "institucion", e.target.value)
                                }
                                placeholder="Universidad o institución"
                            />
                        </div>

                        <div className="cv-form-group">
                            <label>Título</label>
                            <input
                                className="cv-input"
                                value={edu.titulo}
                                onChange={(e) =>
                                    updateEducation(i, "titulo", e.target.value)
                                }
                                placeholder="Ej: Ingeniería Informática"
                            />
                        </div>

                        <div className="cv-form-group">
                            <label>Período</label>
                            <input
                                className="cv-input"
                                value={edu.periodo}
                                onChange={(e) =>
                                    updateEducation(i, "periodo", e.target.value)
                                }
                                placeholder="Ej: 2016 - 2020"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button className="btn btn-outline" type="button" onClick={addEducation}>
                <Plus size={18} /> Agregar formación académica
            </button>
        </div>
    );
};

export default EducationSection;
