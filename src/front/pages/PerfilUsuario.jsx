import React, { useEffect, useState, useContext } from "react";
import "../styles/PerfilUsuario.css";
import { UserContext } from "../hooks/UserContextProvier";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateProfile from "../components/ProfileComponents/CreateProfile";
import ProfileRead from "../components/ProfileComponents/ProfileRead";

export default function PerfilUsuario() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { token, updateProfile } = useContext(UserContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        bio: "",
        img_profile: null,
        skill: [],
    });

    useEffect(() => {
        if (!token) return;
        axios
            .get(`${backendUrl}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setProfile(res.data))
            .catch((err) => console.error(err));
    }, [token, backendUrl]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const val = inputValue.trim();
            if (val && !form.skill.includes(val)) {
                setForm((prev) => ({ ...prev, skill: [...prev.skill, val] }));
            }
            setInputValue("");
        }
    };

    const removeTag = (indexToRemove) => {
        setForm((prev) => ({
            ...prev,
            skill: prev.skill.filter((_, i) => i !== indexToRemove),
        }));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === "skill") formData.append("skill", JSON.stringify(value));
            else if (value !== null) formData.append(key, value);
        });
        try {
            const res = await axios.post(`${backendUrl}/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data);
            setForm({
                first_name: "",
                last_name: "",
                bio: "",
                img_profile: null,
                skill: [],
            });

            updateProfile(res.data)

        } catch (err) {
            console.error(err);
        }
    };

    const parseSkills = (str) => {
        try {
            return JSON.parse(str);
        } catch {
            return typeof str === "string" ? str.split(",").map((s) => s.trim()) : [];
        }
    };

    return (
        <div className="perfil-container">
            <div className="perfil-layout">

                <aside className="perfil-sidebar">
                    {profile && (
                        <ProfileRead
                            profile={profile}
                            backendUrl={backendUrl}
                            parseSkills={parseSkills}
                            navigate={navigate}
                            layout="sidebar"
                        />
                    )}
                </aside>

                <main className="perfil-main-content">
                    {profile && (
                        <div className="bio-section">
                            <h2>Sobre Mi</h2>
                            <p>{profile.bio}</p>
                        </div>
                    )}

                    {!profile && (
                        <CreateProfile
                            handleKeyDown={handleKeyDown}
                            form={form}
                            handleSend={handleSend}
                            handleChange={handleChange}
                            removeTag={removeTag}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                        />
                    )}
                </main>

            </div>

            <div className="profile-header-banner">
                <div className="banner-circle banner-circle-1"></div>
                <div className="banner-circle banner-circle-2"></div>
                <div className="banner-circle banner-circle-3"></div>
                <div className="banner-circle banner-circle-4"></div>
            </div>
        </div>

    );
}
