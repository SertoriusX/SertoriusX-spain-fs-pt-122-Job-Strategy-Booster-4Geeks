import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../../styles/JobDetail.css"
export default function JobsDetail() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { id } = useParams()
    const [postulacion, setPostulacion] = useState(null)
    useEffect(() => {
        axios.get(`${backendUrl}/postulacion/${id}`).then((res) => setPostulacion(res.data)).catch((err) => {
            console.error(err);
        })


    }, [])
    if (!postulacion) {
        return <p className="text-center my-5">Loading job...</p>;
    }
    return (

        <div
            className="my-container d-flex flex-column  justify-between my-5 bg-white rounded shadow px-4 py-4"
            style={{ maxWidth: '90rem', background: "#fff" }}
        >
            <div className="second-container d-flex align-items-center justify-content-between  p-3 mb-5">
                <div className="col-auto d-flex align-items-center gap-3 mb-3 mb-md-0">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
                        alt="React Logo"
                        className="rounded-circle"
                        style={{ backgroundColor: '#DBEAFE', padding: '0.5rem', width: 56, height: 56 }}
                    />
                    <h1 className="h4 mb-0 fw-semibold">{postulacion.company}</h1>
                </div>
                <div className=" d-flex  gap-3 justify-content-center justify-content-md-start">
                    <button
                        type="button"
                        className="btn btn-info d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
                        style={{ minWidth: 120 }}
                    >
                        <i className="fa-solid fa-pen"></i> Edit Job
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
                        style={{ minWidth: 120 }}
                    >
                        <i className="fa-solid fa-check text-danger"></i> Close Job
                    </button>
                    <button
                        type="button"
                        className="btn btn-light d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                        style={{ width: 44, height: 44 }}
                        aria-label="More options"
                        title="More options"
                    >
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                </div>
            </div>

            <div className="row g-5 ">
                <div className="col-12 col-md-8 border-danger">
                    <div className="row align-items-center mb-5  justify-content-around">
                        <div className="col-auto d-flex align-items-center gap-3">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
                                alt="React Logo"
                                className="rounded-circle"
                                style={{ backgroundColor: '#DBEAFE', padding: '0.5rem', width: 56, height: 56 }}
                            />
                            <h2 className="h5 mb-0 fw-semibold">{postulacion.title}</h2>
                        </div>
                        <div className="col-auto text-center">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 36 36"
                                role="img"
                                aria-label="90% Strong Match Candidates"
                                className="mb-1"
                            >
                                <circle stroke="#d1d5db" strokeWidth="3" fill="none" cx="18" cy="18" r="15" />
                                <circle
                                    stroke="#6b21a8"
                                    strokeWidth="3"
                                    strokeDasharray={`${postulacion.match_percentage}, 100`}
                                    strokeLinecap="round"
                                    fill="none"
                                    cx="18"
                                    cy="18"
                                    r="15"
                                />
                                <text
                                    x="18"
                                    y="22"
                                    fontSize="10"
                                    fill="#6b21a8"
                                    textAnchor="middle"
                                    fontWeight="bold"
                                >
                                    ${postulacion.match_percentage}%
                                </text>
                            </svg>
                            <div className="small text-muted">Strong Match Candidates</div>
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-sm-2 g-4 mb-5">
                        {[
                            {
                                icon: "fa-money-bill-wave",
                                iconColor: "text-primary",
                                title: "Salary",
                                value: `${postulacion.salary}`,
                            },
                            {
                                icon: "fa-users",
                                iconColor: "text-success",
                                title: "Candidates Applied",
                                value: `${postulacion.candidates_applied}`,
                            },
                            {
                                icon: "fa-check-circle",
                                iconColor: "text-purple",
                                title: "Completed Interviews",
                                value: `${postulacion.completed_interviews}`,
                                iconStyle: { fontSize: "1.6rem", color: "#6b21a8" },
                            },
                            {
                                icon: "fa-clipboard-list",
                                iconColor: "text-warning",
                                title: "Positions Open",
                                value: `${postulacion.total_positions} Positions,${postulacion.experience}`,
                            },
                        ].map(({ icon, iconColor, title, value, iconStyle }) => (
                            <div key={title} className="col">
                                <div className="bg-light p-4 rounded d-flex align-items-center gap-3 h-100 shadow-sm">
                                    <i
                                        className={`fa-solid ${icon} ${iconColor} fs-4`}
                                        style={iconStyle || {}}
                                        aria-hidden="true"
                                    ></i>
                                    <div>
                                        <h5 className="mb-1 text-secondary">{title}</h5>
                                        <p className="fs-5 fw-semibold mb-0">{value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 className="h5 mb-3 fw-semibold">Job Description</h3>
                        <p className="mb-5 text-secondary" style={{ lineHeight: 1.6 }}>
                            {postulacion.job_description}
                        </p>

                        <div className="row row-cols-1 row-cols-sm-2 g-5">
                            <div>
                                <h4 className="fw-semibold mb-3">Responsibilities</h4>
                                {postulacion.responsibilities.map((res) => (


                                    <ul key={res.id} className="list-unstyled text-secondary fs-6" style={{ lineHeight: 1.6 }}>
                                        <li>•{res}</li>

                                    </ul>
                                ))}

                            </div>

                            <div>
                                <h4 className="fw-semibold mb-3">Requirements</h4>

                                {postulacion.requirements.map((res) => (
                                    <ul key={res.div} className="list-unstyled text-secondary fs-6" style={{ lineHeight: 1.6 }}>
                                        <li>• {res}</li>

                                    </ul>

                                ))}

                            </div>
                        </div>
                    </div>
                </div>

                <aside className="col-12 col-md-4 border rounded p-4 d-flex flex-column gap-4 shadow-sm" style={{ minHeight: 'fit-content' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="h6 mb-0 fw-semibold">Open</h3>
                        <div className="form-check form-switch m-0">
                            <input className="form-check-input" type="checkbox" id="open-toggle" defaultChecked />
                            <label className="form-check-label" htmlFor="open-toggle" />
                        </div>
                    </div>

                    <hr />

                    {[
                        { icon: "fa-share-nodes", label: "Share Job", variant: "btn-light" },
                        { icon: "fa-copy", label: "Duplicate Job", variant: "btn-light" },
                        { icon: "fa-download", label: "Export Candidates", variant: "btn-light" },
                        { icon: "fa-xmark", label: "Close Hiring", variant: "btn-danger text-white" },
                    ].map(({ icon, label, variant }) => (
                        <button
                            key={label}
                            type="button"
                            className={`btn ${variant} d-flex align-items-center gap-2 justify-content-center fw-semibold shadow-sm`}
                            style={{ minHeight: 44 }}
                        >
                            <i className={`fa-solid ${icon}`}></i> {label}
                        </button>
                    ))}
                </aside>
            </div>
        </div>
    );
}
