import React, { useState } from "react";
import { Wrench, Globe, XCircle } from "lucide-react";

const SkillsSection = ({ habilidades, setHabilidades, idiomas, setIdiomas }) => {
    const [skillInput, setSkillInput] = useState("");
    const [langInput, setLangInput] = useState("");

    const agregarSkill = () => {
        if (skillInput.trim() === "") return;
        setHabilidades([...habilidades, skillInput.trim()]);
        setSkillInput("");
    };

    const agregarIdioma = () => {
        if (langInput.trim() === "") return;
        setIdiomas([...idiomas, langInput.trim()]);
        setLangInput("");
    };

    const manejarEnterSkill = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            agregarSkill();
        }
    };

    const manejarEnterIdioma = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            agregarIdioma();
        }
    };

    const eliminarSkill = (index) => {
        setHabilidades(habilidades.filter((_, i) => i !== index));
    };

    const eliminarIdioma = (index) => {
        setIdiomas(idiomas.filter((_, i) => i !== index));
    };

    return (
        <div className="cv-section-block">
            <h3 className="cv-section-title">
                <Wrench size={18} className="section-icon" />
                Habilidades e Idiomas
            </h3>

            <div className="cv-form-group">
                <label>Habilidades</label>

                {habilidades.length === 0 && (
                    <p className="cv-section-empty">Aún no has agregado habilidades.</p>
                )}

                <div className="chips-container">
                    {habilidades.map((skill, i) => (
                        <span key={i} className="chip">
                            {skill}
                            <button onClick={() => eliminarSkill(i)}>
                                <XCircle size={16} />
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    className="cv-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={manejarEnterSkill}
                    placeholder="Añadir habilidad"
                />
            </div>

            <div className="cv-form-group">
                <label>Idiomas</label>

                {idiomas.length === 0 && (
                    <p className="cv-section-empty">Aún no has agregado idiomas.</p>
                )}

                <div className="chips-container">
                    {idiomas.map((lang, i) => (
                        <span key={i} className="chip">
                            {lang}
                            <button onClick={() => eliminarIdioma(i)}>
                                <XCircle size={16} />
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    className="cv-input"
                    value={langInput}
                    onChange={(e) => setLangInput(e.target.value)}
                    onKeyDown={manejarEnterIdioma}
                    placeholder="Añadir idioma"
                />
            </div>
        </div>
    );
};

export default SkillsSection;
