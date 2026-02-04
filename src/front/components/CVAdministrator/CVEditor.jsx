import React, { useState } from "react";
import PersonalInfoSection from "./sections/PersonalInfoSection.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import EducationSection from "./sections/EducationSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import { Save, XCircle } from "lucide-react";

const CVEditor = ({ formData, updateCurrentCV, setIsEditing, saving, onSave, onSaveAs }) => {
    const [mostrarInput, setMostrarInput] = useState(false);
    const [cvName, setCvName] = useState("");
    const [habilidades, setHabilidades] = useState(formData.habilidades || []);
    const [idiomas, setIdiomas] = useState(formData.idiomas || []);

    const syncHabilidades = (lista) => {
        setHabilidades(lista);
        updateCurrentCV("habilidades", lista);
    };

    const syncIdiomas = (lista) => {
        setIdiomas(lista);
        updateCurrentCV("idiomas", lista);
    };

    const scrollToTop = () => {
        setTimeout(() => {
            const containers = document.querySelectorAll("div, main, section");
            containers.forEach(el => {
                if (el.scrollTop > 0) {
                    el.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
    };

    const closeEditor = () => {
        setIsEditing(false);
        scrollToTop();
    };

    const confirmarGuardado = () => {
        if (!cvName.trim()) {
            alert("Por favor, escribe un nombre para el archivo.");
            return;
        }

        if (formData.id) {
            onSave({
                ...formData,
                habilidades,
                idiomas,
                titulo: cvName
            });
        } else {
            onSaveAs({
                ...formData,
                habilidades,
                idiomas,
                titulo: cvName
            });
        }

        setMostrarInput(false);
        scrollToTop();
    };

    const handleGuardarClick = () => {
        if (formData.id) {
            onSave({
                ...formData,
                habilidades,
                idiomas
            });
            scrollToTop();
        } else {
            setCvName("");
            setMostrarInput(true);
        }
    };

    return (
        <div className="cv-editor-container">
            <div className="cv-editor-header">
                <button
                    className="cv-close-button"
                    onClick={closeEditor}
                    disabled={saving}
                >
                    <XCircle size={22} />
                </button>
            </div>

            <PersonalInfoSection formData={formData} updateCurrentCV={updateCurrentCV} />
            <ExperienceSection formData={formData} updateCurrentCV={updateCurrentCV} />
            <EducationSection formData={formData} updateCurrentCV={updateCurrentCV} />

            <SkillsSection
                habilidades={habilidades}
                setHabilidades={syncHabilidades}
                idiomas={idiomas}
                setIdiomas={syncIdiomas}
            />

            <div className="save-wrapper">
                <div className="cv-editor-footer">
                    <button
                        className="btn-cancel-icon"
                        type="button"
                        onClick={closeEditor}
                        disabled={saving}
                    >
                        <XCircle size={18} />
                    </button>

                    {!mostrarInput && (
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleGuardarClick}
                            disabled={saving}
                        >
                            <Save size={18} /> Guardar
                        </button>
                    )}

                    {mostrarInput && (
                        <div className="save-inline-row">
                            <input
                                type="text"
                                className="cv-title-input"
                                placeholder="Nombre del archivo"
                                value={cvName}
                                onChange={(e) => setCvName(e.target.value)}
                            />

                            <button
                                className="circle-btn"
                                onClick={confirmarGuardado}
                                title="Confirmar"
                            >
                                💾
                            </button>

                            <button
                                className="circle-btn"
                                onClick={() => setMostrarInput(false)}
                                title="Cancelar"
                            >
                                ✖️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default CVEditor;
