import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import "../styles/Formulario.css";
import { FiSave, FiX, FiLogOut } from "react-icons/fi";
import { UserContext } from "../hooks/UserContextProvier";
import { useNavigate } from "react-router-dom";

export default function Formulario() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    // Dropdown options state
    const [category, setCategory] = useState([]);
    const [city, setCity] = useState([]);
    const [workType, setWorkType] = useState([]);
    const [employmentType, setEmploymentType] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [existingSocialMediaOptions, setExistingSocialMediaOptions] = useState([]);

    // Social media statuses per platform
    const [socialMediaStatuses, setSocialMediaStatuses] = useState({});

    const [formData, setFormData] = useState({
        nombre_empresa: "",
        expireiance: "",
        salary: "",
        city_id: "",
        social_media: [], // array of { label, value }
        skills: [], // array of { label, value }
        category_id: "",
        work_type_id: "",
        employment_type_id: "",
        job_description: "",
        requirements: "",
        persona_de_contacto: "",
        positions: "",
        candidates_applied: "",
        completed_interviews: "",
    });

    useEffect(() => {
        axios.get(`${backendUrl}/category`).then(res => setCategory(res.data)).catch(console.error);
        axios.get(`${backendUrl}/city`).then(res => setCity(res.data)).catch(console.error);
        axios.get(`${backendUrl}/WorkType`).then(res => setWorkType(res.data)).catch(console.error);
        axios.get(`${backendUrl}/EmploymentType`).then(res => setEmploymentType(res.data)).catch(console.error);
        axios.get(`${backendUrl}/skill`)
            .then(res => {
                const options = res.data.map(skill => ({ label: skill.name, value: skill.id }));
                setAllSkills(options);
            })
            .catch(console.error);
        axios.get(`${backendUrl}/social_media`)
            .then(res => {
                const options = res.data.map(sm => ({ label: sm.name, value: sm.id }));
                setExistingSocialMediaOptions(options);
            })
            .catch(console.error);
        axios.get(`${backendUrl}/social_media_status`)
            .then(res => {
                const options = res.data.map(status => ({
                    label: status.name,
                    value: status.id,
                }));
                setStatusOptions(options);
            })
            .catch(console.error);
    }, [backendUrl]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (selectedOptions) => {
        setFormData(prev => ({ ...prev, skills: selectedOptions || [] }));
    };

    const handleSocialMediaChange = (selectedOptions) => {
        setFormData(prev => ({ ...prev, social_media: selectedOptions || [] }));

        // Remove statuses for unselected platforms
        const selectedValues = new Set((selectedOptions || []).map(opt => opt.value));
        setSocialMediaStatuses(prev => {
            const updated = {};
            selectedValues.forEach(val => {
                if (prev[val]) updated[val] = prev[val];
            });
            return updated;
        });
    };

    const handleCreateSocialMedia = (inputValue) => {
        const newOption = {
            label: inputValue,
            value: `new-${inputValue}-${Date.now()}`, // temporary unique ID
        };

        setExistingSocialMediaOptions(prev => [...prev, newOption]);
        setFormData(prev => ({
            ...prev,
            social_media: [...prev.social_media, newOption],
        }));
    };

    const handleAddStatus = (platformValue) => {
        setSocialMediaStatuses(prev => {
            const currentStatuses = prev[platformValue] || [];
            const pendingStatus = statusOptions.find(s => s.label.toLowerCase() === "pending") || null;
            return {
                ...prev,
                [platformValue]: [...currentStatuses, pendingStatus].filter(Boolean),
            };
        });
    };

    const handleStatusChangeAtIndex = (platformValue, index, selectedStatus) => {
        setSocialMediaStatuses(prev => {
            const currentStatuses = prev[platformValue] || [];
            const updatedStatuses = [...currentStatuses];
            updatedStatuses[index] = selectedStatus;
            return {
                ...prev,
                [platformValue]: updatedStatuses,
            };
        });
    };

    const handleRemoveStatusAtIndex = (platformValue, index) => {
        setSocialMediaStatuses(prev => {
            const currentStatuses = prev[platformValue] || [];
            const updatedStatuses = [...currentStatuses];
            updatedStatuses.splice(index, 1);
            return {
                ...prev,
                [platformValue]: updatedStatuses,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const socialMediaWithStatuses = [];
        formData.social_media.forEach(sm => {
            const statuses = socialMediaStatuses[sm.value] || [];
            statuses.forEach(status => {
                if (status && status.value != null) {
                    socialMediaWithStatuses.push({
                        platform: sm.value,
                        status: status.value,
                    });
                }
            });
        });

        const payload = {
            nombre_empresa: formData.nombre_empresa,
            expireiance: formData.expireiance,
            salary: formData.salary,
            city_id: formData.city_id,
            social_media: socialMediaWithStatuses,
            skills: formData.skills.map(skill => skill.value),
            category_id: formData.category_id,
            work_type_id: formData.work_type_id,
            employment_type_id: formData.employment_type_id,
            job_description: formData.job_description,
            requirements: formData.requirements,
            persona_de_contacto: formData.persona_de_contacto,
            positions: formData.positions,
            candidates_applied: formData.candidates_applied,
            completed_interviews: formData.completed_interviews,
        };

        try {
            await axios.post(`${backendUrl}/posts`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Postulaciones created successfully!");
            // Optional: Reset form here
        } catch (error) {
            console.error("Error creating Postulaciones:", error.response?.data || error.message);
            alert("Failed to create Postulaciones. See console for details.");
        }
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

                <form className="form-content" onSubmit={handleSubmit}>
                    {/* Nombre Empresa */}
                    <div className="form-group">
                        <label className="label">Nombre Empresa</label>
                        <input
                            type="text"
                            name="nombre_empresa"
                            value={formData.nombre_empresa}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    {/* Salary */}
                    <div className="form-group">
                        <label className="label">Salary</label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Experiencia */}
                    <div className="form-group">
                        <label className="label">Experiencia</label>
                        <input
                            type="text"
                            name="expireiance"
                            value={formData.expireiance}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="label">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Select Category</option>
                            {category.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* City */}
                    <div className="form-group">
                        <label className="label">City</label>
                        <select
                            name="city_id"
                            value={formData.city_id}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="">Select City</option>
                            {city.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Work Type */}
                    <div className="form-group">
                        <label className="label">Work Type</label>
                        <select
                            name="work_type_id"
                            value={formData.work_type_id}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Work Type</option>
                            {workType.map(wt => (
                                <option key={wt.id} value={wt.id}>{wt.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Employment Type */}
                    <div className="form-group">
                        <label className="label">Employment Type</label>
                        <select
                            name="employment_type_id"
                            value={formData.employment_type_id}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Employment Type</option>
                            {employmentType.map(et => (
                                <option key={et.id} value={et.id}>{et.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Social Media */}
                    <div className="form-group">
                        <label className="label">Social Media</label>
                        <CreatableSelect
                            isMulti
                            options={existingSocialMediaOptions}
                            onChange={handleSocialMediaChange}
                            onCreateOption={handleCreateSocialMedia}
                            value={formData.social_media}
                            placeholder="Create or select social media platforms"
                        />
                    </div>

                    {/* Statuses per Social Media */}
                    {formData.social_media.map(sm => {
                        const statuses = socialMediaStatuses[sm.value] || [];

                        return (
                            <div key={sm.value} className="form-group">
                                <label className="label">Estados para {sm.label}</label>

                                {statuses.map((status, idx) => (
                                    <div
                                        key={idx}
                                        style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
                                    >
                                        <CreatableSelect
                                            options={statusOptions}
                                            value={status}
                                            onChange={(selected) => handleStatusChangeAtIndex(sm.value, idx, selected)}
                                            placeholder={`Selecciona o crea un estado para ${sm.label}`}
                                            styles={{ container: base => ({ ...base, flex: 1 }) }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStatusAtIndex(sm.value, idx)}
                                            style={{
                                                marginLeft: 8,
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                height: "38px",
                                                padding: "0 10px",
                                            }}
                                            title="Remove status"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => handleAddStatus(sm.value)}
                                    style={{
                                        marginTop: 4,
                                        background: "#007bff",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    + Add Status
                                </button>
                            </div>
                        );
                    })}

                    {/* Skills */}
                    <div className="form-group">
                        <label className="label">Skills</label>
                        <CreatableSelect
                            isMulti
                            onChange={handleSkillsChange}
                            options={allSkills}
                            value={formData.skills}
                            placeholder="Select or create skills"
                        />
                    </div>

                    {/* Positions */}
                    <div className="form-group">
                        <label className="label">Positions</label>
                        <input
                            type="text"
                            name="positions"
                            value={formData.positions}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Candidates Applied */}
                    <div className="form-group">
                        <label className="label">Candidates Applied</label>
                        <input
                            type="text"
                            name="candidates_applied"
                            value={formData.candidates_applied}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Completed Interviews */}
                    <div className="form-group">
                        <label className="label">Completed Interviews</label>
                        <input
                            type="text"
                            name="completed_interviews"
                            value={formData.completed_interviews}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Requirements */}
                    <div className="form-group">
                        <label className="label">Requirements</label>
                        <input
                            type="text"
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Persona de Contacto */}
                    <div className="form-group">
                        <label className="label">Persona de Contacto</label>
                        <input
                            type="text"
                            name="persona_de_contacto"
                            value={formData.persona_de_contacto}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="form-group">
                        <label className="label">Job Description</label>
                        <input
                            type="text"
                            name="job_description"
                            value={formData.job_description}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="button-icon-group">
                        <button type="submit" className="icon-button" title="Save">
                            <FiSave />
                        </button>

                        <button
                            type="button"
                            className="icon-button"
                            title="Clear"
                            onClick={() => {
                                setFormData({
                                    nombre_empresa: "",
                                    expireiance: "",
                                    city_id: "",
                                    salary: "",
                                    social_media: [],
                                    skills: [],
                                    category_id: "",
                                    work_type_id: "",
                                    employment_type_id: "",
                                    job_description: "",
                                    requirements: "",
                                    persona_de_contacto: "",
                                    positions: "",
                                    candidates_applied: "",
                                    completed_interviews: "",
                                });
                                setSocialMediaStatuses({});
                            }}
                        >
                            <FiX />
                        </button>

                        <button
                            type="button"
                            className="icon-button"
                            title="Logout"
                            onClick={() => {
                                // TODO: Implement logout or navigation here
                            }}
                        >
                            <FiLogOut />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
