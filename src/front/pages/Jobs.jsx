import React from 'react'
import '../styles/jobs.css'
export default function Jobs() {
    return (
        <div className="app-container">
            <h1 className="custom-title">Jobs</h1>

            <div className="cards-grid">
                {[1, 2,].map((item) => (
                    <section className="job-card" key={item}>
                        <div className="card-top">
                            <div className="status">
                                <span className="badge">Open</span>
                                <span>Development</span>
                            </div>
                            <span className="dots">•••</span>
                        </div>

                        <h2 className="job-title">ReactJS Developer</h2>
                        <p className="job-meta">📍 Surat | 📅 Feb 24, 2025</p>

                        <div className="progress">90% Match</div>

                        <div className="stats">
                            <p>💰 $25K–30K annually</p>
                            <p>👥 Candidates: 15</p>
                            <p>✅ Interviewed: 08</p>
                        </div>

                        <div className="tags">
                            <span>On Site</span>
                            <span>Full Time</span>
                            <span>3 Years</span>
                            <span>2 Positions</span>
                        </div>

                        <div className="card-footer">
                            <span>Created by Brooklyn</span>
                            <a href="#">View</a>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}
