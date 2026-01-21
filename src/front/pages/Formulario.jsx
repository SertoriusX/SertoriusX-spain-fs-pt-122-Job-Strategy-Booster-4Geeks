import { useState } from "react";
import "../styles/Formulario.css";
import { FiSave, FiX, FiLogOut } from "react-icons/fi";


export default function Formulario() {
    const [formData, setFormData] = useState({
        postulation_state: "",
        company_name: "",
        role: "",
        experience: "",
        inscription_date: "",
        city: "",
        salary: "",
        platform: "",
        url: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const result = await createNewPostulation(formData, token);
            console.log("Postulación creada:", result);

        } catch (error) {
            console.error("Error al crear postulación:", error.message);
        }
    };

    return (
        /*         <div className="container-formulario">
                    <div className="card">
        
                        <div className="header">
                            <div className="icon-formulario">
                                <span className="icon-text">📄</span>
                            </div>
                            <h1 className="title">Nueva Postulación</h1>
                            <p className="subtitle">Registra una oportunidad laboral que estás siguiendo</p>
                        </div>
        
                        <div className="form-content">
        
                            <div className="grid">
                                <div className="form-group">
                                    <label className="label">Empresa</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
        
                                <div className="form-group">
                                    <label className="label">Cargo</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                            </div>
        
                            <div className="grid">
                                <div className="form-group">
                                    <label className="label">Plataforma</label>
                                    <select
                                        name="platform"
                                        value={formData.platform}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Selecciona una plataforma</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Indeed">Indeed</option>
                                        <option value="Glassdoor">Glassdoor</option>
                                        <option value="Portal interno">Portal interno</option>
                                    </select>
                                </div>
        
                                <div className="form-group">
                                    <label className="label">Fecha de postulación</label>
                                    <input
                                        type="date"
                                        name="applicationDate"
                                        value={formData.applicationDate}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                            </div>
        
                            <div className="grid">
                                <div className="form-group">
                                    <label className="label">Estado</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Selecciona un estado</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En proceso">En proceso</option>
                                        <option value="Entrevista">Entrevista</option>
                                        <option value="Rechazada">Rechazada</option>
                                        <option value="Aceptada">Aceptada</option>
                                    </select>
                                </div>
        
                                <div className="form-group">
                                    <label className="label">Prioridad</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Selecciona prioridad</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>
        
                            <div className="grid">
                                <div className="form-group">
                                    <label className="label">URL de la oferta</label>
                                    <input
                                        type="url"
                                        name="jobUrl"
                                        value={formData.jobUrl}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
        
                                <div className="form-group">
                                    <label className="label">Ubicación</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                            </div>
        
                            <div className="grid">
                                <div className="form-group">
                                    <label className="label">Modalidad</label>
                                    <select
                                        name="workMode"
                                        value={formData.workMode}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Selecciona modalidad</option>
                                        <option value="Presencial">Presencial</option>
                                        <option value="Remoto">Remoto</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
        
                                <div className="form-group">
                                    <label className="label">Salario</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                            </div>
        
                            <div className="grid">
                                <div className="form-group">
                                    <label className="label">Persona de contacto</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
        
                                <div className="form-group">
                                    <label className="label">Email de contacto</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                            </div>
        
                            <div className="button-icon-group">
                                <button onClick={handleSubmit} className="icon-button">
                                    <FiSave />
                                </button>
        
                                <button type="button" className="icon-button">
                                    <FiX />
                                </button>
        
                                <button type="button" className="icon-button">
                                    <FiLogOut />
                                </button>
                            </div>
        
                        </div>
                    </div>
                </div> */
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
                                    <option>Pendiente</option>
                                    <option>En proceso</option>
                                    <option>Entrevista</option>
                                    <option>Rechazada</option>
                                    <option>Aceptada</option>
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
                                    type="text"
                                    name="experience"
                                    value={formData.expireiance}
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
                                    type="text"
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
                                    name="url"
                                    value={formData.url}
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
                            <button type="button" className="icon-button secondary">
                                <FiX />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    );
}
