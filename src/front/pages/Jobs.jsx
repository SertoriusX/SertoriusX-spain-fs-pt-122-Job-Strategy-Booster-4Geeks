import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Jobs() {


    return (
        <>

            <div className="d-flex flex-column justify-content-between align-items-center gap-5">
                <h1 className="custom-title">Jobs</h1>

                <div className="d-flex flex-wrap justify-content-center gap-3">

                    {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="card mx-auto" style={{ maxWidth: '28rem' }}>
                            <div className="card-body p-3">

                                <div className="d-flex justify-content-between align-items-center text-secondary small mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-success rounded-pill px-3 py-1 fw-semibold">Open</span>
                                        <span>Development</span>
                                    </div>
                                    <button type="button" className="btn btn-link text-secondary p-0" aria-label="More options">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                            <circle cx="3" cy="8" r="2" />
                                            <circle cx="8" cy="8" r="2" />
                                            <circle cx="13" cy="8" r="2" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="p-2 bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center"
                                            style={{ width: 40, height: 40 }}
                                        >
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg"
                                                alt="ReactJS logo"
                                                style={{ width: 24, height: 24 }}
                                            />
                                        </div>
                                        <div>
                                            <h5 className="mb-1 fw-semibold text-dark">ReactJS Developer</h5>
                                            <div className="d-flex gap-3 small text-muted">
                                                <span className="d-flex align-items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="bi bi-geo-alt"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 2C8 2 4 5.1 4 9c0 5 8 13 8 13s8-8 8-13c0-3.9-4-7-8-7z" />
                                                    </svg>
                                                    Surat
                                                </span>
                                                <span className="d-flex align-items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="bi bi-calendar"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M8 7V3m8 4V3M3 11h18M4 19h16M4 15h16" />
                                                    </svg>
                                                    Feb 24, 2025
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <svg
                                            className="mb-1"
                                            width="64"
                                            height="64"
                                            viewBox="0 0 36 36"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle stroke="#d1d5db" strokeWidth="3" fill="none" cx="18" cy="18" r="15" />
                                            <circle
                                                stroke="#6b21a8"
                                                strokeWidth="3"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray="90, 100"
                                                cx="18"
                                                cy="18"
                                                r="15"
                                            />
                                            <text
                                                x="18"
                                                y="22"
                                                fontSize="10"
                                                fill="#6b21a8"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                90%
                                            </text>
                                        </svg>
                                        <div className="small text-secondary">Strong Match Candidates</div>
                                    </div>
                                </div>

                                <div className="bg-light p-3 rounded mb-3 text-secondary small">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="bi bi-person"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 8c-2 0-4-1-4-3s2-3 4-3 4 1 4 3-2 3-4 3z" />
                                            </svg>
                                            Salary
                                        </div>
                                        <span className="fw-semibold text-dark">$25K–30K annually</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="bi bi-circle"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                            Candidates Applied
                                        </div>
                                        <span>15</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="bi bi-arrow-down"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 20v-8" />
                                            </svg>
                                            Completed Interview
                                        </div>
                                        <span>08</span>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <span className="badge bg-warning text-dark small fw-semibold">On Site</span>
                                    <span className="badge bg-secondary text-light small fw-semibold">Full Time</span>
                                    <span className="badge bg-success text-light small fw-semibold">3 Years exp.</span>
                                    <span
                                        className="badge text-light small fw-semibold"
                                        style={{ backgroundColor: '#d8b4fe' }}
                                    >
                                        2 Positions
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center small text-secondary">
                                    <span>
                                        Created by <strong>Brooklyn</strong>
                                    </span>
                                    <a
                                        href="#"
                                        className="text-purple text-decoration-none d-flex align-items-center gap-1"
                                    >
                                        View details
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="bi bi-arrow-right"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
}
