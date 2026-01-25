import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../hooks/UserContextProvier'
import "../../styles/ProfileEdit.css"
import axios from 'axios'

export default function EditProfile() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { id } = useParams()
    const { token, updateProfile } = useContext(UserContext)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        bio: "",
        img_profile: null,
        skill: []
    })

    const [inputValue, setInputValue] = useState("")

    const normalizeSkills = (value) => {
        if (!value) return []

        const normalizeItem = (item) => {
            if (typeof item !== "string") return [item]

            try {
                const parsed = JSON.parse(item)
                return Array.isArray(parsed) ? parsed : [item]
            } catch {
                return [item]
            }
        }

        if (Array.isArray(value)) {
            return value.flatMap(normalizeItem)
        }

        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed.flatMap(normalizeItem) : []
        } catch {
            return String(value)
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${backendUrl}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setForm({
                    first_name: res.data.first_name ?? "",
                    last_name: res.data.last_name ?? "",
                    bio: res.data.bio ?? "",
                    img_profile: null,
                    skill: normalizeSkills(res.data.skill),
                })
            } catch (error) {
                console.error("Failed to load profile:", error)
            }
        }

        if (id && token) fetchProfile()
    }, [id, token, backendUrl])

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const value = inputValue.trim()

            if (!value) return

            const exists = form.skill.some(
                s => s.toLowerCase() === value.toLowerCase()
            )

            if (!exists) {
                setForm(prev => ({
                    ...prev,
                    skill: [...prev.skill, value]
                }))
            }

            setInputValue("")
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target

        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

    const removeTag = (indexToRemove) => {
        setForm(prev => ({
            ...prev,
            skill: prev.skill.filter((_, index) => index !== indexToRemove)
        }))
    }

    const handleSend = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        Object.entries(form).forEach(([key, value]) => {
            if (key === "skill") {
                formData.append("skill", JSON.stringify(normalizeSkills(value)))
            } else if (value !== null) {
                formData.append(key, value)
            }
        })

        try {
            const response = await axios.put(`${backendUrl}/profile/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (response.data) {
                updateProfile(response.data)
            } else {
                const res = await axios.get(`${backendUrl}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                updateProfile(res.data)
            }

            navigate("/perfil")
        } catch (err) {
            console.error("Save failed:", err)
        }
    }

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-card">
                <h1 className="edit-title">Edit Profile</h1>

                <form onSubmit={handleSend} className="edit-form">

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Profile Image</label>
                        <input
                            type="file"
                            name="img_profile"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Skills</label>
                        <input
                            type="text"
                            placeholder="Type a skill and press Enter"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <div className="skills-preview">
                            {form.skill.map((skill, index) => (
                                <span key={index} className="skill-pill">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="save-button">
                        💾 Save Profile
                    </button>

                </form>
            </div>
        </div>

    )
}
