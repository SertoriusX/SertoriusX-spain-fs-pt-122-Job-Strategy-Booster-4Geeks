import React from "react";
import '../../styles/profileRead.css';

export default function ProfileRead({ profile, parseSkills, navigate, setOpen }) {
    const skills = parseSkills(profile.skill);
    const previewSkills = skills.slice(0, 4);

    const initials =
        (profile.first_name?.[0] || "") +
        (profile.last_name?.[0] || "");

    return (
        <>
            <div
                className="profile-modal-overlay"
                onClick={() => setOpen(false)}
                aria-label="Close profile modal overlay"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setOpen(false);
                }}
            />

            <aside
                className="profile-modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-modal-title"
            >
                <button
                    className="profile-modal-close-btn"
                    onClick={() => setOpen(false)}
                    aria-label="Close profile modal"
                >
                    &times;
                </button>

                <div className="initials-avatar">
                    {initials.toUpperCase()}
                </div>

                <h2 id="profile-modal-title " className="home-profile-name">
                    {profile.first_name} {profile.last_name}
                </h2>
                <p className=" mb-3 mt-3">{profile.bio}</p>

                <div className="home-profile-skills">
                    {previewSkills.length === 0 ? (
                        <span className="skill-badge empty">No skills</span>
                    ) : (
                        previewSkills.map((skill, i) => (
                            <span className="skill-badge" key={i}>
                                {skill}
                            </span>
                        ))
                    )}

                    {skills.length > 4 && (
                        <span className="skill-more">+{skills.length - 4}</span>
                    )}
                </div>

                <button
                    className="home-profile-btn"
                    onClick={() => {
                        navigate(`/perfil/${profile.id}/edit`);
                        setOpen(false);
                    }}
                >
                    Edit profile
                </button>
            </aside>
        </>
    );
}
