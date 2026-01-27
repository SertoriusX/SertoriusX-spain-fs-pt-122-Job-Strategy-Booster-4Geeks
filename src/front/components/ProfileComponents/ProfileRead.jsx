import React from 'react'

export default function ProfileRead({ profile, backendUrl, parseSkills, navigate }) {
    return (
        <>
            <aside className="perfil-sidebar">
                <div className="profile-card">
                    <div className="avatar-wrapper">
                        <div className="avatar">
                            <img
                                src={`${backendUrl}/uploads/${profile.img_profile}`}
                                alt={`${profile.first_name} avatar`}
                                className="avatar-image"
                                onError={(e) => (e.target.src = "/default-profile.png")}
                            />
                        </div>
                        <h2 className="name">
                            {profile.first_name} {profile.last_name}
                        </h2>
                    </div>

                    <div className="profile-edit-card">
                        <div className="section-title">Skills</div>
                        <div className="skills-grid">
                            {parseSkills(profile.skill).length === 0 ? (
                                <span className="skill-badge" style={{ opacity: 0.5 }}>
                                    None
                                </span>
                            ) : (
                                parseSkills(profile.skill).map((skill, i) => (
                                    <span className="skill-badge" key={i}>
                                        {skill}
                                    </span>
                                ))
                            )}
                        </div>
                        <button
                            className="edit-profile-button"
                            onClick={() => navigate(`/perfil/${profile.id}/edit`)}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </aside>

        </>
    )
}
