import React, { useState } from "react";
import PersonalInfoSection from "./sections/PersonalInfoSection.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import EducationSection from "./sections/EducationSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import { Save, XCircle } from "lucide-react";

const CVEditor = ({ formData, updateCurrentCV, setIsEditing, saving, onSave, onSaveAs }) => {
    const [showSaveAs, setShowSaveAs] = useState(false);
    const [cvName, setCvName] = useState(formData?.titulo || "");
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

    const handleSave = () => {
        onSave({ ...formData, habilidades, idiomas });
        scrollToTop();
    };

    const handleSaveAs = () => {
        onSaveAs({
            ...formData,
            habilidades,
            idiomas,
            titulo: cvName,
            id: null
        });
        setShowSaveAs(false);
        scrollToTop();
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

                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : (
                            <>
                                <Save size={18} /> Guardar
                            </>
                        )}
                    </button>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => setShowSaveAs(true)}
                        disabled={saving}
                    >
                        Guardar como
                    </button>
                </div>

                {showSaveAs && (
                    <div className="save-as-block">
                        <label className="save-as-label">Guardar como</label>

                        <div className="save-as-row">
                            <input
                                type="text"
                                className="cv-title-input"
                                placeholder="Ej: CV-Frontend-Madrid"
                                value={cvName}
                                onChange={(e) => setCvName(e.target.value)}
                            />

                            <button
                                className="circle-btn"
                                onClick={() => setShowSaveAs(false)}
                                title="Cancelar"
                            >
                                ✖️
                            </button>

                            <button
                                className="circle-btn"
                                onClick={handleSaveAs}
                                title="Guardar"
                            >
                                💾
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CVEditor;
