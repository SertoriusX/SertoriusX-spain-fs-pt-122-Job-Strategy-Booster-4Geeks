import React from "react";
import { Plus, XCircle } from "lucide-react";
import { GraduationCap } from "lucide-react";



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
        <div className="cv-section-block">
            <h3 className="cv-section-title">
                <GraduationCap size={18} className="section-icon" />
                Educación
            </h3>

            {(formData.educacion || []).length === 0 && (
                <p className="cv-section-empty">Aún no has agregado educación.</p>
            )}

            {(formData.educacion || []).map((edu, i) => (
                <div key={i} className="cv-item">
                    <button
                        className="cv-item-remove"
                        type="button"
                        onClick={() => removeEducation(i)}
                    >
                        <XCircle size={18} />
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
                                placeholder="Nombre de la institución"
                            />
                        </div>

                        <div className="cv-form-group">
                            <label>Título / Carrera</label>
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
                                placeholder="Ej: 2018 - 2022"
                            />
                        </div>
                    </div>

                    <div className="cv-form-group">
                        <label>Descripción</label>
                        <textarea
                            className="cv-input cv-textarea"
                            value={edu.descripcion}
                            onChange={(e) =>
                                updateEducation(i, "descripcion", e.target.value)
                            }
                            placeholder="Describe logros, proyectos o especializaciones..."
                            rows="3"
                        />
                    </div>
                </div>
            ))}

            <button className="cv-add-btn" type="button" onClick={addEducation}>
                <Plus size={18} /> Agregar educación
            </button>
        </div>

    );
};

export default EducationSection;
