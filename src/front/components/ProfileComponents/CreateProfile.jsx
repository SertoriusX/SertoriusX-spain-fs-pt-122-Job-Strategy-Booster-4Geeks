import React from 'react'
import '../../styles/formDesing.css'
export default function CreateProfile({
    form,
    handleKeyDown,
    handleSend,
    handleChange,
    removeTag,
    inputValue,
    setInputValue,
    setShowCreateProfile
}) {
    return (
        <div className="profile-modal-overlay">

            <div className="profile-modal-card">

                <button className="profile-close-btn" onClick={() => setShowCreateProfile(false)}>
                    ✕
                </button>

                <h1 className="page-title">Create Profile</h1>

                <form onSubmit={handleSend} className="profile-form">

                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="input-field"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="input-field"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="bio"
                        placeholder="Bio"
                        className="input-field textarea-field"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                    />

                    <label className="section-title">
                        Profile Image
                    </label>

                    <input
                        type="file"
                        name="img_profile"
                        accept="image/*"
                        onChange={handleChange}
                        className="input-field"
                    />

                    <label className="section-title">Skills</label>

                    <div className="skills-grid">

                        {form.skill.map((tag, i) => (
                            <span key={i} className="skill-badge">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(i)}
                                    className="remove-skill-btn"
                                >
                                    ×
                                </button>
                            </span>
                        ))}

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type skill + Enter"
                            className="input-field skill-input"
                        />
                    </div>

                    <button type="submit" className="confirm-button">
                        Save Profile
                    </button>

                </form>
            </div>
        </div>
    )
}
