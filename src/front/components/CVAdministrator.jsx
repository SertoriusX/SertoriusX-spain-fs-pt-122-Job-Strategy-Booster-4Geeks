import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import {
    User,
    Briefcase,
    GraduationCap,
    Award,
    Trash2,
    Edit2,
    Save,
    X,
    Plus,
    Download,
    Upload,
    FileText,
    ChevronDown,
    ChevronUp,
    Camera
} from "lucide-react";
import "../styles/CVAdministrator.css";

const CVAdministrator = () => {
    const { token } = useContext(UserContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [cvExists, setCvExists] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        ubicacion: "",
        linkedin: "",
        github: "",
        foto: "",
        resumen: "",
        experiencia: [],
        educacion: [],
        habilidades: [],
        idiomas: []
    });

    useEffect(() => {
        if (token) {
            loadCV();
        }
    }, [token]);

    const loadCV = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${backendUrl}/cv`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 404) {
                setCvExists(false);
                setIsLoading(false);
                return;
            }

            if (!res.ok) {
                setCvExists(false);
                setIsLoading(false);
                return;
            }

            const data = await res.json();

            if (data.success && data.datos) {
                setFormData(data.datos);
                setCvExists(true);
            } else {
                setCvExists(false);
            }
        } catch (error) {
            console.error("Error al cargar CV:", error);
            setCvExists(false);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCV = async () => {
        if (!formData.nombre || !formData.email || !formData.telefono) {
            alert("Por favor completa: Nombre, Email y Teléfono");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/cv`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setCvExists(true);
                setIsEditing(false);
                alert("✅ CV guardado correctamente");
                await loadCV();
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al guardar CV:", error);
            alert("❌ Error al guardar el CV");
        }
    };

    const deleteCV = async () => {
        if (!window.confirm("¿Estás seguro de eliminar tu CV?")) return;

        try {
            const res = await fetch(`${backendUrl}/cv`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (data.success) {
                setFormData({
                    nombre: "",
                    email: "",
                    telefono: "",
                    ubicacion: "",
                    linkedin: "",
                    github: "",
                    foto: "",
                    resumen: "",
                    experiencia: [],
                    educacion: [],
                    habilidades: [],
                    idiomas: []
                });
                setCvExists(false);
                setIsEditing(false);
                setIsExpanded(false);
                alert("✅ CV eliminado correctamente");
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al eliminar CV:", error);
            alert("❌ Error al eliminar el CV");
        }
    };

    const downloadJSON = () => {
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cv-${formData.nombre.replace(/\s/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadPDF = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        const doc = printWindow.document;

        doc.write("<html><head><title>CV - " + formData.nombre + "</title>");

        doc.write(`
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #e0f2fe;
          padding: 40px;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          color: #1e293b;
        }
        h1 {
          font-size: 2rem;
          color: #2563eb;
          margin-bottom: 5px;
        }
        h2 {
          font-size: 1.25rem;
          color: #1e40af;
          margin-top: 30px;
          margin-bottom: 10px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 5px;
        }
        h3 {
          font-size: 1rem;
          color: #334155;
          margin-bottom: 5px;
        }
        p {
          margin: 5px 0;
          font-size: 0.95rem;
        }
        .contact {
          font-size: 0.9rem;
          color: #475569;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 25px;
        }
        .item {
          background: #ffffff;
          border: 1px solid #dbeafe;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0 2px 6px rgba(0, 40, 80, 0.05);
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .skill {
          background: #dbeafe;
          color: #1e40af;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          border: 1px solid #93c5fd;
        }
        img.profile {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #2563eb;
          margin-bottom: 20px;
        }
      </style>
    `);

        doc.write("</head><body>");

        if (formData.foto) {
            doc.write(`<img class="profile" src="${formData.foto}" />`);
        }

        doc.write(`<h1>${formData.nombre}</h1>`);

        doc.write(`
      <p class="contact">
        📍 ${formData.ubicacion || "Ubicación no especificada"}<br>
        📞 ${formData.telefono}<br>
        ✉️ ${formData.email}
      </p>
    `);

        if (formData.linkedin || formData.github) {
            doc.write('<p class="contact">');
            if (formData.linkedin) doc.write(`🔗 LinkedIn: ${formData.linkedin}<br>`);
            if (formData.github) doc.write(`🐙 GitHub: ${formData.github}`);
            doc.write('</p>');
        }

        if (formData.resumen) {
            doc.write(`<h2>Resumen Profesional</h2><p>${formData.resumen}</p>`);
        }

        if (formData.experiencia.length > 0) {
            doc.write("<h2>Experiencia Laboral</h2><div class='section'>");
            formData.experiencia.forEach((e) => {
                doc.write(`
              <div class='item'>
                <h3>${e.puesto}</h3>
                <p><strong>${e.empresa}</strong> • ${e.periodo}</p>
                ${e.descripcion ? `<p>${e.descripcion}</p>` : ""}
              </div>
            `);
            });
            doc.write("</div>");
        }

        if (formData.educacion.length > 0) {
            doc.write("<h2>Educación</h2><div class='section'>");
            formData.educacion.forEach((e) => {
                doc.write(`
              <div class='item'>
                <h3>${e.titulo}</h3>
                <p><strong>${e.institucion}</strong> • ${e.periodo}</p>
              </div>
            `);
            });
            doc.write("</div>");
        }

        if (formData.habilidades.length > 0) {
            doc.write("<h2>Habilidades Técnicas</h2><div class='skills'>");
            formData.habilidades.forEach(h => doc.write(`<span class='skill'>${h}</span>`));
            doc.write("</div>");
        }

        if (formData.idiomas.length > 0) {
            doc.write("<h2>Idiomas</h2><div class='skills'>");
            formData.idiomas.forEach(l => doc.write(`<span class='skill'>${l}</span>`));
            doc.write("</div>");
        }

        doc.write("</body></html>");
        doc.close();

        setTimeout(() => printWindow.print(), 250);
    };


    const importCV = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    setFormData(data);
                    alert("✅ CV importado exitosamente");
                } catch {
                    alert("❌ Error: archivo JSON inválido");
                }
            };
            reader.readAsText(file);
        }
        e.target.value = "";
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experiencia: [...formData.experiencia, { empresa: "", puesto: "", periodo: "", descripcion: "" }]
        });
    };

    const updateExperience = (i, field, value) => {
        const exp = [...formData.experiencia];
        exp[i][field] = value;
        setFormData({ ...formData, experiencia: exp });
    };

    const removeExperience = (i) => {
        setFormData({
            ...formData,
            experiencia: formData.experiencia.filter((_, idx) => idx !== i)
        });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            educacion: [...formData.educacion, { institucion: "", titulo: "", periodo: "" }]
        });
    };

    const updateEducation = (i, field, value) => {
        const edu = [...formData.educacion];
        edu[i][field] = value;
        setFormData({ ...formData, educacion: edu });
    };

    const removeEducation = (i) => {
        setFormData({
            ...formData,
            educacion: formData.educacion.filter((_, idx) => idx !== i)
        });
    };

    const handleTagInput = (e, field) => {
        const value = e.target.value;
        if (value.includes(",")) {
            const tags = value
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);

            setFormData((prev) => ({
                ...prev,
                [field]: [...prev[field], ...tags]
            }));

            e.target.value = "";
        }
    };

    const removeTag = (field, index) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    if (isLoading) {
        return (
            <div className="cv-admin-container">
                <div className="cv-admin-wrapper">
                    <div style={{ textAlign: "center", padding: "50px" }}>
                        <p>Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cv-admin-container">
            <div className="cv-admin-wrapper">
                <div className="cv-admin-header">
                    <div className="cv-admin-header-content">
                        <h1 className="cv-admin-title">
                            <FileText size={28} /> Administrador de CV
                        </h1>

                        <div className="cv-admin-actions">
                            {cvExists && !isEditing && (
                                <>
                                    <button className="btn btn-secondary" onClick={downloadPDF}>
                                        <Download size={18} /> PDF
                                    </button>

                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!cvExists && !isEditing ? (
                    <div className="cv-admin-content">
                        <div className="cv-empty-state">
                            <div className="empty-icon">
                                <FileText size={64} />
                            </div>
                            <h2>No tienes un CV registrado</h2>
                            <p>Crea tu currículum vitae</p>

                            <div className="cv-empty-actions">
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    <Plus size={20} /> Crear nuevo CV
                                </button>

                            </div>
                        </div>
                    </div>
                ) : cvExists && !isEditing ? (
                    <div className="cv-card-container">
                        <div className={`cv-card ${isExpanded ? "expanded" : ""}`}>
                            <div className="cv-card-header" onClick={() => setIsExpanded(!isExpanded)}>
                                <div className="cv-card-title">
                                    <FileText size={24} />
                                    <div>
                                        <h3>{formData.nombre}</h3>
                                        <p>{formData.email}</p>
                                    </div>
                                </div>

                                <div className="cv-card-actions">
                                    {!isExpanded && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditing(true);
                                                }}
                                            >
                                                <Edit2 size={16} />
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteCV();
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}

                                    <button className="btn-icon">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="cv-card-content">
                                    <div className="cv-preview">


                                        <div className="cv-preview-actions-top">
                                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                                <Edit2 size={18} />
                                            </button>

                                            <button className="btn btn-danger" onClick={deleteCV}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="cv-section">
                                            <div className="cv-section-header">
                                                <h3 className="cv-section-title">
                                                    <User size={22} /> Información Personal
                                                </h3>
                                                {formData.foto && (
                                                    <img
                                                        src={formData.foto}
                                                        className="cv-profile-header-image"
                                                        alt="Foto de perfil"
                                                    />
                                                )}
                                            </div>

                                            <div className="cv-info-grid">
                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Nombre completo</div>
                                                    <div className="cv-info-value">{formData.nombre}</div>
                                                </div>

                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Correo electrónico</div>
                                                    <div className="cv-info-value">{formData.email}</div>
                                                </div>

                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Teléfono</div>
                                                    <div className="cv-info-value">{formData.telefono}</div>
                                                </div>

                                                <div className="cv-info-item">
                                                    <div className="cv-info-label">Ubicación</div>
                                                    <div className="cv-info-value">{formData.ubicacion}</div>
                                                </div>

                                                {formData.linkedin && (
                                                    <div className="cv-info-item">
                                                        <div className="cv-info-label">LinkedIn</div>
                                                        <div className="cv-info-value cv-link">
                                                            {formData.linkedin}
                                                        </div>
                                                    </div>
                                                )}

                                                {formData.github && (
                                                    <div className="cv-info-item">
                                                        <div className="cv-info-label">GitHub</div>
                                                        <div className="cv-info-value cv-link">
                                                            {formData.github}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {formData.resumen && (
                                                <div className="cv-resume">
                                                    <div className="cv-info-label">Resumen profesional</div>
                                                    <p className="cv-resume-text">{formData.resumen}</p>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {formData.experiencia.length > 0 && (
                                        <div className="cv-section">
                                            <h3 className="cv-section-title">
                                                <Briefcase size={22} /> Experiencia Laboral
                                            </h3>

                                            {formData.experiencia.map((e, i) => (
                                                <div key={i} className="cv-experience-item">
                                                    <h4>{e.puesto}</h4>
                                                    <p className="cv-company">
                                                        <strong>{e.empresa}</strong> • {e.periodo}
                                                    </p>
                                                    {e.descripcion && (
                                                        <p className="cv-description">{e.descripcion}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {formData.educacion.length > 0 && (
                                        <div className="cv-section">
                                            <h3 className="cv-section-title">
                                                <GraduationCap size={22} /> Educación
                                            </h3>

                                            {formData.educacion.map((e, i) => (
                                                <div key={i} className="cv-education-item">
                                                    <h4>{e.titulo}</h4>
                                                    <p>
                                                        <strong>{e.institucion}</strong> • {e.periodo}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {(formData.habilidades.length > 0 || formData.idiomas.length > 0) && (
                                        <div className="cv-section">
                                            <h3 className="cv-section-title">
                                                <Award size={22} /> Habilidades y Competencias
                                            </h3>

                                            {formData.habilidades.length > 0 && (
                                                <div className="cv-skills-section">
                                                    <div className="cv-info-label">Habilidades técnicas</div>
                                                    <div className="cv-tags">
                                                        {formData.habilidades.map((h, i) => (
                                                            <span key={i} className="cv-tag">
                                                                {h}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {formData.idiomas.length > 0 && (
                                                <div className="cv-skills-section">
                                                    <div className="cv-info-label">Idiomas</div>
                                                    <div className="cv-tags">
                                                        {formData.idiomas.map((l, i) => (
                                                            <span key={i} className="cv-tag">
                                                                {l}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            )}
                        </div>
                    </div>
                ) : (
                    <div className="cv-admin-content">
                        <div className="cv-editor">
                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <User size={20} /> Información Personal
                                </h3>

                                <div className="cv-profile-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="profilePhoto"
                                        className="file-input-hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () =>
                                                    setFormData((prev) => ({ ...prev, foto: reader.result }));
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />

                                    <div className="cv-profile-row">
                                        <label htmlFor="profilePhoto" className="btn btn-photo">
                                            <Camera size={20} /> Foto
                                        </label>

                                        {formData.foto && (
                                            <img
                                                src={formData.foto}
                                                className="cv-profile-preview-circle"
                                                alt="Foto de perfil"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="cv-form-grid">
                                    <div className="cv-form-group">
                                        <label>
                                            Nombre completo <span className="required">*</span>
                                        </label>
                                        <input
                                            className="cv-input"
                                            value={formData.nombre}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    nombre: e.target.value
                                                })
                                            }
                                            placeholder="Ej: Juan Pérez García"
                                        />
                                    </div>

                                    <div className="cv-form-group">
                                        <label>
                                            Correo electrónico <span className="required">*</span>
                                        </label>
                                        <input
                                            className="cv-input"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value
                                                })
                                            }
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>

                                    <div className="cv-form-group">
                                        <label>
                                            Teléfono <span className="required">*</span>
                                        </label>
                                        <input
                                            className="cv-input"
                                            value={formData.telefono}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    telefono: e.target.value
                                                })
                                            }
                                            placeholder="+34 600 000 000"
                                        />
                                    </div>

                                    <div className="cv-form-group">
                                        <label>Ubicación</label>
                                        <input
                                            className="cv-input"
                                            value={formData.ubicacion}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    ubicacion: e.target.value
                                                })
                                            }
                                            placeholder="Ciudad, País"
                                        />
                                    </div>

                                    <div className="cv-form-group">
                                        <label>LinkedIn</label>
                                        <input
                                            className="cv-input"
                                            value={formData.linkedin}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    linkedin: e.target.value
                                                })
                                            }
                                            placeholder="linkedin.com/in/usuario"
                                        />
                                    </div>

                                    <div className="cv-form-group">
                                        <label>GitHub</label>
                                        <input
                                            className="cv-input"
                                            value={formData.github}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    github: e.target.value
                                                })
                                            }
                                            placeholder="github.com/usuario"
                                        />
                                    </div>
                                </div>

                                <div className="cv-form-group">
                                    <label>Resumen profesional</label>
                                    <textarea
                                        className="cv-input cv-textarea"
                                        value={formData.resumen}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                resumen: e.target.value
                                            })
                                        }
                                        placeholder="Describe brevemente tu perfil profesional, experiencia y objetivos..."
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <Briefcase size={20} /> Experiencia Laboral
                                </h3>

                                {formData.experiencia.map((exp, i) => (
                                    <div key={i} className="cv-modal-card">
                                        <button
                                            className="cv-modal-close"
                                            type="button"
                                            onClick={() => removeExperience(i)}
                                        >
                                            <X size={16} />
                                        </button>

                                        <div className="cv-form-grid">
                                            <div className="cv-form-group">
                                                <label>Empresa</label>
                                                <input
                                                    className="cv-input"
                                                    value={exp.empresa}
                                                    onChange={(e) =>
                                                        updateExperience(i, "empresa", e.target.value)
                                                    }
                                                    placeholder="Nombre de la empresa"
                                                />
                                            </div>

                                            <div className="cv-form-group">
                                                <label>Puesto</label>
                                                <input
                                                    className="cv-input"
                                                    value={exp.puesto}
                                                    onChange={(e) =>
                                                        updateExperience(i, "puesto", e.target.value)
                                                    }
                                                    placeholder="Cargo desempeñado"
                                                />
                                            </div>

                                            <div className="cv-form-group">
                                                <label>Período</label>
                                                <input
                                                    className="cv-input"
                                                    value={exp.periodo}
                                                    onChange={(e) =>
                                                        updateExperience(i, "periodo", e.target.value)
                                                    }
                                                    placeholder="Ej: 2020 - 2023"
                                                />
                                            </div>
                                        </div>

                                        <div className="cv-form-group">
                                            <label>Descripción</label>
                                            <textarea
                                                className="cv-input cv-textarea"
                                                value={exp.descripcion}
                                                onChange={(e) =>
                                                    updateExperience(i, "descripcion", e.target.value)
                                                }
                                                placeholder="Describe tus responsabilidades y logros..."
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button className="btn btn-outline" type="button" onClick={addExperience}>
                                    <Plus size={18} /> Agregar experiencia
                                </button>
                            </div>

                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <GraduationCap size={20} /> Formación Académica
                                </h3>

                                {formData.educacion.map((edu, i) => (
                                    <div key={i} className="cv-modal-card">
                                        <button
                                            className="cv-modal-close"
                                            type="button"
                                            onClick={() => removeEducation(i)}
                                        >
                                            <X size={16} />
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
                                                    placeholder="Universidad o institución"
                                                />
                                            </div>

                                            <div className="cv-form-group">
                                                <label>Título</label>
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
                                                    placeholder="Ej: 2016 - 2020"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button className="btn btn-outline" type="button" onClick={addEducation}>
                                    <Plus size={18} /> Agregar formación académica
                                </button>
                            </div>

                            <div className="cv-form-section">
                                <h3 className="cv-form-title">
                                    <Award size={20} /> Habilidades y Competencias
                                </h3>

                                <div className="cv-form-grid">
                                    <div className="cv-form-group">
                                        <label>Habilidades técnicas</label>
                                        <input
                                            className="cv-input"
                                            placeholder="Escribe una habilidad y separa con comas"
                                            onChange={(e) => handleTagInput(e, "habilidades")}
                                        />
                                        <div className="cv-tags">
                                            {formData.habilidades.map((h, i) => (
                                                <span key={i} className="cv-tag">
                                                    {h}
                                                    <button
                                                        type="button"
                                                        className="cv-tag-remove"
                                                        onClick={() => removeTag("habilidades", i)}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="cv-form-group">
                                        <label>Idiomas</label>
                                        <input
                                            className="cv-input"
                                            placeholder="Escribe un idioma y separa con comas"
                                            onChange={(e) => handleTagInput(e, "idiomas")}
                                        />
                                        <div className="cv-tags">
                                            {formData.idiomas.map((l, i) => (
                                                <span key={i} className="cv-tag">
                                                    {l}
                                                    <button
                                                        type="button"
                                                        className="cv-tag-remove"
                                                        onClick={() => removeTag("idiomas", i)}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="cv-editor-footer">
                                <button className="btn-cancel-icon" type="button" onClick={() => setIsEditing(false)}>
                                    <X size={20} />
                                </button>

                                <button className="btn btn-primary" type="button" onClick={saveCV}>
                                    <Save size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default CVAdministrator;