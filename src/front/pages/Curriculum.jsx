import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/curriculum.css";
import AdminCV from "./AdminCV";

const translations = {
    en: {
        cvBuilder: "CV Builder",
        name: "Name",
        email: "Email",
        phone: "Phone",
        location: "Location",
        strengths: "Strengths",
        skills: "Skills",
        languages: "Languages",
        interests: "Interests",
        aboutMe: "About Me",
        education: "Education",
        training: "Complementary Training",
        experience: "Work Experience",
        noData: "No data provided",
        downloadPDF: "Download PDF",
        language: "Language",
    },
    es: {
        cvBuilder: "Constructor de CV",
        name: "Nombre",
        email: "Correo electrónico",
        phone: "Teléfono",
        location: "Ubicación",
        strengths: "Fortalezas",
        skills: "Habilidades",
        languages: "Idiomas",
        interests: "Intereses",
        aboutMe: "Sobre mí",
        education: "Educación",
        training: "Formación complementaria",
        experience: "Experiencia laboral",
        noData: "No se proporcionó información",
        downloadPDF: "Descargar PDF",
        language: "Idioma",
    },
};

function Curriculums() {
    const cvRef = useRef();

    const language = "en";
    const t = translations[language];

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        strength: "",
        skills: "",
        languages: "",
        about: "I am a motivated developer eager to learn and grow.",
        education: "University Degree in Computer Engineering - 2015 to 2019",
        training: "Google Cybersecurity Course - 168 hours",
        experience: "Assistant Analyst at INNOVACION APLICADA A LAS TI, S.L.",
        interests: "Computer science and programming, Sport",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadPDF = async () => {
        const element = cvRef.current;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#faebd7",
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save("My-CV.pdf");
    };

    const renderInlineList = (text) => {
        if (!text) return <p>{t.noData}</p>;
        return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {text.split(",").map((item, idx) => (
                    <span
                        key={idx}
                        style={{
                            backgroundColor: "rgba(212, 141, 10, 0.97)",
                            padding: "5px 10px",
                            borderRadius: "15px",
                            fontSize: "0.9rem",
                            color: "white",
                        }}
                    >
                        {item.trim()}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            <AdminCV />
            <div className="container-center">
                <div className="input-section">
                    <h1>{t.cvBuilder}</h1>

                    <input
                        name="name"
                        placeholder={t.name}
                        onChange={handleChange}
                        value={data.name}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <input
                        name="email"
                        placeholder={t.email}
                        onChange={handleChange}
                        value={data.email}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <input
                        name="phone"
                        placeholder={t.phone}
                        onChange={handleChange}
                        value={data.phone}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <input
                        name="location"
                        placeholder={t.location}
                        onChange={handleChange}
                        value={data.location}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <input
                        name="strength"
                        placeholder={`${t.strengths} (comma separated)`}
                        onChange={handleChange}
                        value={data.strength}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <textarea
                        name="skills"
                        placeholder={`${t.skills} (comma separated)`}
                        onChange={handleChange}
                        value={data.skills}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />

                    <textarea
                        name="languages"
                        placeholder={`${t.languages} (comma separated)`}
                        onChange={handleChange}
                        value={data.languages}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />
                    <textarea
                        name="interests"
                        placeholder={`${t.interests} (comma separated)`}
                        onChange={handleChange}
                        value={data.interests}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />
                    <textarea
                        name="about"
                        placeholder={t.aboutMe}
                        onChange={handleChange}
                        value={data.about}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />

                    <textarea
                        name="education"
                        placeholder={t.education}
                        onChange={handleChange}
                        value={data.education}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />

                    <textarea
                        name="training"
                        placeholder={t.training}
                        onChange={handleChange}
                        value={data.training}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />

                    <textarea
                        name="experience"
                        placeholder={t.experience}
                        onChange={handleChange}
                        value={data.experience}
                        style={{ width: "100%", marginBottom: 10, padding: 8, height: 80 }}
                    />

                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <br />
                    <button
                        onClick={downloadPDF}
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            borderRadius: "30px",
                            marginTop: "20px",
                            background: "var(--main-color)",
                            color: "white",
                        }}
                    >
                        {t.downloadPDF}
                    </button>
                </div>

                <hr style={{ margin: "30px 0" }} />

                <div
                    className="page-wrapper"
                    ref={cvRef}
                    style={{ padding: 20, borderRadius: 10 }}
                >
                    <div className="cv-header">
                        <div className="profile-image-wrapper">
                            <img
                                className="profile-image"
                                src={image || "https://via.placeholder.com/150"}
                                alt="Profile"
                            />
                        </div>

                        <div className="title-section">
                            <h1 style={{ marginBottom: 10 }}>{data.name || t.name}</h1>
                            <div className="title-flex">
                                <h5>{data.email || t.email}</h5>
                                <h5>{data.phone || t.phone}</h5>
                                <h5>{data.location || t.location}</h5>
                            </div>
                        </div>
                    </div>

                    <div className="content-columns">
                        <div className="skill-section">
                            <h2>{t.strengths}</h2>
                            <hr className="small-divider" />
                            {renderInlineList(data.strength)}

                            <h2>{t.skills}</h2>
                            <hr className="small-divider" />
                            {renderInlineList(data.skills)}

                            <h2>{t.languages}</h2>
                            <hr className="small-divider" />
                            {renderInlineList(data.languages)}

                            <h2>{t.interests}</h2>
                            <hr className="small-divider" />
                            {renderInlineList(data.interests)}
                        </div>

                        <div className="description-section">
                            <h2>{t.aboutMe}</h2>
                            <hr className="large-divider" />
                            <p className="paragraph-design">{data.about}</p>

                            <h2>{t.education}</h2>
                            <hr className="large-divider" />
                            <p className="paragraph-design">{data.education}</p>

                            <h2>{t.training}</h2>
                            <hr className="large-divider" />
                            <p className="paragraph-design">{data.training}</p>

                            <h2>{t.experience}</h2>
                            <hr className="large-divider" />
                            <p className="paragraph-design">{data.experience}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Curriculums;
