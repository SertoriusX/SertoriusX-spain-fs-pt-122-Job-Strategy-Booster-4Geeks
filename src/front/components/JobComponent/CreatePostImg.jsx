import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../hooks/UserContextProvier";
import { useNavigate } from "react-router-dom";

const PLATFORMS = ["Unknown", "LinkedIn", "Indeed", "InfoJobs", "Sefcarm"];

export default function UploadImageOnly() {
    const { token } = useContext(UserContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [platform, setPlatform] = useState("Unknown");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (preview) URL.revokeObjectURL(preview);

        setImage(file);
        setPreview(URL.createObjectURL(file));

        setError("");
        setSuccess("");
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const upload = async () => {
        if (!image) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const fd = new FormData();
            fd.append("image", image);
            fd.append("platform", platform); // send platform info too

            const res = await axios.post(`${backendUrl}/ocr-postulation`, fd, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Image uploaded and data extracted successfully!");
            console.log("Response data:", res.data);

            navigate("/postulations");
        } catch (err) {
            console.error(err);
            setError("OCR failed. Please try another image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h2>Subir imagen</h2>

            <label>
                Plataforma:
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ marginLeft: 10 }}>
                    {PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            </label>

            <input type="file" accept="image/*" onChange={handleImage} style={{ display: "block", marginTop: 10 }} />

            {preview && (
                <div style={{ marginTop: 10 }}>
                    <img src={preview} alt="preview" width="250" />
                </div>
            )}

            <button
                className="btn-primary"
                onClick={upload}
                disabled={loading || !image}
                style={{ marginTop: 10 }}
            >
                {loading ? "Subiendo..." : "Subir & Extracto"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
    );
}
