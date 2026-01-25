import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGetAuthorizationHeader from '../../hooks/useGetAuthorizationHeader';
import { getPostulationById, removePostulation } from '../../Fetch/postulationFecth';
import "../../styles/JobDetail.css"

export default function JobsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const authorizationHeader = useGetAuthorizationHeader();
    const [postulation, setPostulation] = useState(null);

    const handleDelete = async () => {
        if (!postulation) return;
        try {
            await removePostulation(postulation.id, authorizationHeader);
            console.log('Postulation eliminada correctamente');
            navigate('/jobs');
        } catch (error) {
            console.error('Error eliminando la postulación:', error);
        }
    };


    useEffect(() => {
        const fetchPostulation = async () => {
            const result = await getPostulationById(id, authorizationHeader);
            setPostulation({
                ...result,
                requirements: result.requirements || []
            });
        };

        fetchPostulation();
    }, [id]);

    if (!postulation) return <p>Postulation not found</p>;

    return (
        <div
            className=" my-container d-flex flex-column my-5 bg-white rounded shadow px-4 py-4"
            style={{ maxWidth: '90rem' }}
        >
            <div className="d-flex align-items-center justify-content-between p-3 mb-5">
                <div className="col-auto d-flex align-items-center gap-3">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"
                        alt="React Logo"
                        className="rounded-circle"
                        style={{ backgroundColor: '#DBEAFE', padding: '0.5rem', width: 56, height: 56 }}
                    />
                    <h1 className="h4 mb-0 fw-semibold">{postulation.company_name}</h1>
                </div>
            </div>

            <div className="row g-5">
                <div className="col-12 col-md-8">
                    <div className="row align-items-center mb-5">
                        <div className="col-auto d-flex align-items-center gap-3">
                            <h2 className="h5 mb-0 fw-semibold">{postulation.role}</h2>
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-sm-2 g-4 mb-5">
                        {[
                            { title: 'Salary', value: postulation.salary },
                            { title: 'Candidates Applied', value: postulation.candidates_applied },
                            { title: 'Process', value: postulation.postulation_state },
                            {
                                title: 'Positions Open',
                                value: `${postulation.available_positions} · ${postulation.experience}`
                            }
                        ].map(({ title, value }) => (
                            <div key={title} className="col">
                                <div className="bg-light p-4 rounded shadow-sm">
                                    <h5 className="mb-1 text-secondary">{title}</h5>
                                    <p className="fs-5 fw-semibold mb-0">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 className="h5 mb-3 fw-semibold">Job Description</h3>
                        <p className="mb-5 text-secondary">{postulation.job_description}</p>

                        <div className="row row-cols-1 row-cols-sm-2 g-5">
                            <div>
                                <h4 className="fw-semibold mb-3">Responsibilities</h4>
                                <ul className="list-unstyled text-secondary">
                                    {postulation.requirements.map((res, index) => (
                                        <li key={index}>• {res}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="fw-semibold mb-3">Requirements</h4>
                                <ul className="list-unstyled text-secondary">
                                    {postulation.requirements.map((res, index) => (
                                        <li key={index}>• {res}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="col-12 col-md-4 border rounded p-4 shadow-sm">
                    <h3 className="h6 fw-semibold mb-3">Actions</h3>
                    <button className="btn btn-danger w-100" onClick={handleDelete}>Eliminar postulacion</button>
                </aside>
            </div>
        </div>
    );
}
