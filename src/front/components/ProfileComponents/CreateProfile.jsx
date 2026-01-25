import React from 'react'

export default function CreateProfile({ form, handleKeyDown, handleSend, handleChange, removeTag, inputValue, setInputValue }) {
    return (
        <div>
            <>
                <h1 className="page-title">Create / Edit Profile</h1>
                <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

                    <label className="section-title" htmlFor="img_profile">
                        Profile Image
                    </label>
                    <input
                        type="file"
                        name="img_profile"
                        id="img_profile"
                        accept="image/*"
                        onChange={handleChange}
                        className="input-field"
                    />

                    <label className="section-title">Skills</label>
                    <div className="skills-grid" style={{ flexWrap: "wrap", alignItems: "center" }}>
                        {form.skill.map((tag, i) => (
                            <span key={i} className="skill-badge" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(i)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "#8b5cf6",
                                        cursor: "pointer",
                                        fontWeight: "700",
                                        fontSize: "18px",
                                        lineHeight: "1",
                                        padding: "0 4px",
                                    }}
                                    aria-label={`Remove ${tag}`}
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
                            placeholder="Type a skill and press Enter"
                            className="input-field"
                            style={{ flex: "1 0 150px", minWidth: "150px" }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="confirm-button"
                        style={{ marginTop: "20px", alignSelf: "flex-start" }}
                    >
                        Save Profile
                    </button>
                </form>
            </>

        </div>
    )
}
