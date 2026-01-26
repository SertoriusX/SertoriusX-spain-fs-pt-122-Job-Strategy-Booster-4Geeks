import React from "react";
import PersonalInfoSection from "./sections/PersonalInfoSection.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import EducationSection from "./sections/EducationSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import { Save, X } from "lucide-react";

const CVEditor = ({ formData, updateCurrentCV, setIsEditing, saveCV, saving }) => {
    return (
        <div className="cv-editor-container">
            <button
                className="cv-close-button"
                onClick={() => setIsEditing(false)}
                disabled={saving}
            >
                <X size={20} />
            </button>

            <h2 className="cv-editor-title">Editar CV</h2>

            <PersonalInfoSection
                formData={formData}
                updateCurrentCV={updateCurrentCV}
            />

            <ExperienceSection
                formData={formData}
                updateCurrentCV={updateCurrentCV}
            />

            <EducationSection
                formData={formData}
                updateCurrentCV={updateCurrentCV}
            />

            <SkillsSection
                formData={formData}
                updateCurrentCV={updateCurrentCV}
            />

            <div className="cv-editor-footer">
                <button
                    className="btn-cancel-icon"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                >
                    <X size={20} />
                </button>

                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={saveCV}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : <><Save size={18} /> Guardar</>}
                </button>
            </div>
        </div>
    );
};

export default CVEditor;
