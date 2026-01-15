import { useState } from "react";
import "../styles/Formulario.css";
import { FiSave, FiX, FiLogOut } from "react-icons/fi";


export default function Formulario() {
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        platform: "",
        applicationDate: "",
        status: "",
        jobUrl: "",
        location: "",
        workMode: "",
        salary: "",
        contactPerson: "",
        contactEmail: "",
        notes: "",
        priority: "",
        tags: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log(formData);
    };

    return (
        <div className="container-formulario">
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
        </div>
    );
}
