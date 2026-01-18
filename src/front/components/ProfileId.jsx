import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileId() {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    const [allSkills, setAllSkills] = useState([]);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        bio: "",
        skills: [],
        image_file: null,
        gender_id: "",
    });

    useEffect(() => {
        axios.get(`${backendUrl}/skill`)
            .then((res) => {
                const options = (res.data || [])
                    .filter(skill => skill && skill.name && skill.id != null)
                    .map(skill => ({
                        label: skill.name,
                        value: skill.id,
                    }));
                setAllSkills(options);
            })
            .catch((err) => {
                console.error("Failed to fetch skills", err);
            });
    }, [backendUrl]);

    useEffect(() => {
        if (!token || allSkills.length === 0) return;

        axios.get(`${backendUrl}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const profile = res.data;

                const mappedSkills = (profile.skills || [])
                    .map(skillName => allSkills.find(skill => skill.label === skillName))
                    .filter(Boolean);

                setForm({
                    first_name: profile.first_name || "",
                    last_name: profile.last_name || "",
                    bio: profile.bio || "",
                    gender_id: profile.gender_r ? String(profile.gender_r.id) : "",
                    skills: mappedSkills,
                    image_file: null,
                });
            })
            .catch((err) => {
                console.error("Failed to fetch profile", err);
                alert("Failed to load profile");
                navigate("/prefil");
            });
    }, [token, backendUrl, navigate, allSkills]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm(prev => ({ ...prev, image_file: e.target.files[0] || null }));
    };

    const handleSkillsChange = (selectedOptions) => {
        const filteredOptions = (selectedOptions || []).filter(
            option => option && option.label && option.value != null
        );
        setForm(prev => ({ ...prev, skills: filteredOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("first_name", form.first_name);
        formData.append("last_name", form.last_name);
        formData.append("bio", form.bio);

        if (form.gender_id) {
            formData.append("gender_id", Number(form.gender_id));
        }

        form.skills.forEach(skill => {
            formData.append("skills", skill.label);
        });

        if (form.image_file) {
            formData.append("image_filename", form.image_file);
        }

        try {
            await axios.put(`${backendUrl}/profile/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Profile updated successfully!");
            navigate("/perfil"); // Redirect after success
        } catch (error) {
            console.error("Failed to update profile", error.response?.data || error.message);
            alert("Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Bio:</label>
                <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Gender:</label>
                <select
                    name="gender_id"
                    value={form.gender_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                </select>
            </div>

            <div>
                <label>Skills:</label>
                <CreatableSelect
                    isMulti
                    onChange={handleSkillsChange}
                    options={allSkills}
                    value={form.skills}
                    placeholder="Select or create skills"
                />
            </div>

            <div>
                <label>Profile Image:</label>
                <input
                    type="file"
                    name="image_filename"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <button type="submit">Save Profile</button>
        </form>
    );
}
