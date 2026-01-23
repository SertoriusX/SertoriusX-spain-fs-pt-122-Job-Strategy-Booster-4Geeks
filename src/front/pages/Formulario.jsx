import { useState } from "react";
import "../styles/Formulario.css";
import { FiSave, FiX, FiLogOut } from "react-icons/fi";

import { createNewPostulation } from '../Fetch/postulationFecth'
import { useGetAuthorizationHeader } from "../hooks/useGetAuthorizationHeader";
import { Link } from "react-router-dom";


export default function Formulario() {
    const authorizationHeader = useGetAuthorizationHeader();
    const [formData, setFormData] = useState({
        postulation_state: "",
        company_name: "",
        role: "",
        experience: "",
        inscription_date: "",
        city: "",
        salary: "",
        platform: "",
        postulation_url: "",
        work_type: "",
        requirements: [],
        candidates_applied: "",
        available_positions: "",
        job_description: ""
    });

    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = inputValue.trim();
            if (value && !formData.requirements.includes(value)) {
                setFormData(prev => ({
                    ...prev,
                    requirements: [...prev.requirements, value]
                }))
            }
            setInputValue("");
        }
    };

    const removeTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, index) => index !== indexToRemove)
        }))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const payload = {
        ...formData,
        experience: Number(formData.experience),
        available_positions: Number(formData.available_positions),
        candidates_applied: Number(formData.candidates_applied),
        salary: Number(formData.salary)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createNewPostulation(payload, authorizationHeader);
            console.log("Postulación creada:", result);

        } catch (error) {
            console.error("Error al crear postulación:", error.message);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="container-formulario">
                <div className="card horizontal-form">

                    {/* Header */}
                    <div className="header horizontal-header">
                        <div className="icon-formulario"><span className="icon-text">📄</span></div>
                        <div>
                            <h1 className="title">Nueva Postulación</h1>
                            <p className="subtitle">Registra una oportunidad laboral que estás siguiendo</p>
                        </div>
                    </div>

                    <div className="form-table">

                        {/* Row 1 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    name="postulation_state"
                                    value={formData.postulation_state}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option>abierta</option>
                                    <option>en proceso</option>
                                    <option>entrevista</option>
                                    <option>oferta</option>
                                    <option>descartado</option>
                                    <option>aceptada</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Empresa</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cargo</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Experiencia</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Fecha inscripción</label>
                                <input
                                    type="date"
                                    name="inscription_date"
                                    value={formData.inscription_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Salario</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Plataforma</label>
                                <input
                                    type="text"
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="form-row">
                            <div className="form-group wide">
                                <label>URL oferta</label>
                                <input
                                    type="url"
                                    name="postulation_url"
                                    value={formData.postulation_url}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Modalidad</label>
                                <select
                                    name="work_type"
                                    value={formData.work_type}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option>Presencial</option>
                                    <option>Remoto</option>
                                    <option>Híbrido</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Candidatos</label>
                                <input
                                    type="number"
                                    name="candidates_applied"
                                    value={formData.candidates_applied}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Vacantes</label>
                                <input
                                    type="number"
                                    name="available_positions"
                                    value={formData.available_positions}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 4 - Requisitos */}
                        <div className="form-group wide requisitos-container">
                            <label>Requisitos</label>
                            <div className="tags-input">
                                {formData.requirements.map((tag, index) => (
                                    <span className="tag" key={index}>
                                        {tag} <span className="tag-close" onClick={() => removeTag(index)}>×</span>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe un requisito y presiona Enter"
                                />
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="form-row">
                            <div className="form-group wide">
                                <label>Descripción del puesto</label>
                                <textarea
                                    name="job_description"
                                    rows="3"
                                    value={formData.job_description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="button-icon-group horizontal-actions">
                            <button type="submit" className="icon-button">
                                <FiSave />
                            </button>
                            <Link to='/Jobs'>
                                <button type="button" className="icon-button secondary">
                                    <FiX />
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    );
}
