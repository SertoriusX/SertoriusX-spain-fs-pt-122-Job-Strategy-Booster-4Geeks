import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { UserContext } from "../hooks/UserContextProvier.jsx";
import { useNavigate } from "react-router-dom";

function PerfilUsuario() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { token } = useContext(UserContext);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        bio: "",
        skills: [],
        image_filename: null,
        gender_id: "",
    });
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null);
    const [allSkills, setAllSkills] = useState([]);

    // Fetch profile on token change or mount
    useEffect(() => {
        if (!token) return;

        axios
            .get(`${backendUrl}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setProfile(res.data))
            .catch((err) => {
                console.error("Failed to fetch profile", err);
            });
    }, [token, backendUrl]);

    // Prefill form when profile is loaded
    useEffect(() => {
        if (profile) {
            const mappedSkills =
                profile.skills?.map((skill) => ({
                    label: skill.name,
                    value: skill.id,
                })) || [];

            setForm({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                bio: profile.bio || "",
                gender_id: profile.gender?.id?.toString() || "",
                skills: mappedSkills,
                image_filename: null, // file inputs cannot be prefilled for security
            });
        }
    }, [profile]);

    // Fetch all skills list on mount
    useEffect(() => {
        axios
            .get(`${backendUrl}/skill`)
            .then((res) => {
                const options = res.data.map((skill) => ({
                    label: skill.name,
                    value: skill.id,
                }));
                setAllSkills(options);
            })
            .catch((err) => console.error("Failed to fetch skills", err));
    }, [backendUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, image_filename: e.target.files[0] || null }));
    };

    const handleSkillsChange = (selectedOptions) => {
        setForm((prev) => ({ ...prev, skills: selectedOptions || [] }));
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

        form.skills.forEach((skill) => {
            formData.append("skills", skill.label);
        });

        if (form.image_filename) {
            formData.append("image", form.image_filename);
        }

        try {
            const response = await axios.post(`${backendUrl}/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data);
            alert("Profile created successfully!");
        } catch (error) {
            console.error("Error creating profile:", error.response?.data || error.message);
            alert("Failed to create profile.");
        }
    };

    return (
        <>
            {profile ? (
                <>
                    <h2>Profile</h2>
                    <p>
                        <strong>Name:</strong> {profile.first_name} {profile.last_name}
                    </p>
                    <p>
                        <strong>Bio:</strong> {profile.bio}
                    </p>
                    <p>
                        <strong>Gender:</strong> {profile.gender || "N/A"}
                    </p>
                    <p>
                        <strong>Skills:</strong>{" "}
                        {profile.skills?.join(", ") || "None"}
                    </p>
                    {profile.image_filename && (
                        <img
                            src={`${backendUrl}/tmp/uploads/${profile.image_filename}`}
                            alt="Profile"
                            style={{ maxWidth: "200px" }}
                        />
                    )}
                    <hr />
                    <button onClick={() => navigate(`/perfilId/${profile.id}`)}>Edit Profile</button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>First Name:</label>
                        <input
                            name="first_name"
                            type="text"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Last Name:</label>
                        <input
                            name="last_name"
                            type="text"
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
                            name="image_filename"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit">Create Profile</button>
                </form>
            )}
        </>
    );
}

export default PerfilUsuario;
