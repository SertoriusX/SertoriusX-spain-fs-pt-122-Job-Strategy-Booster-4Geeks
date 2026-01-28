import React, { useState } from "react";
import PersonalInfoSection from "./sections/PersonalInfoSection.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import EducationSection from "./sections/EducationSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import { Save, XCircle } from "lucide-react";

const CVEditor = ({ formData, updateCurrentCV, setIsEditing, saving, onSave }) => {
    const [showSaveAs, setShowSaveAs] = useState(false);
    const [cvName, setCvName] = useState(formData?.titulo || "");

    return (
        <div className="cv-editor-container">

            <div className="cv-editor-header">
                <button
                    className="cv-close-button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                >
                    <XCircle size={22} />
                </button>
            </div>

            <PersonalInfoSection formData={formData} updateCurrentCV={updateCurrentCV} />
            <ExperienceSection formData={formData} updateCurrentCV={updateCurrentCV} />
            <EducationSection formData={formData} updateCurrentCV={updateCurrentCV} />
            <SkillsSection formData={formData} updateCurrentCV={updateCurrentCV} />

           
            <div className="save-wrapper">

                <div className="cv-editor-footer">
                    <button
                        className="btn-cancel-icon"
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                    >
                        <XCircle size={18} />
                    </button>

                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => onSave(formData?.titulo)}
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
                                onClick={() => {
                                    onSave(cvName);
                                    setShowSaveAs(false);
                                }}
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
