import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useGetAuthorizationHeader from '../../hooks/useGetAuthorizationHeader';
import { getPostulationById, removePostulation } from '../../Fetch/postulationFecth';
import "../../styles/jobDetails.css"

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/* import Stepper from '../components/CreateRouteMap';
 */
export default function JobsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const authorizationHeader = useGetAuthorizationHeader();
    const [postulation, setPostulation] = useState(null);
    const [shortUrl, setShortUrl] = useState(null);

    const handleDelete = async () => {
        if (!postulation) return;
        try {
            await removePostulation(postulation.id, authorizationHeader);
            console.log('Postulation eliminada correctamente');
            navigate('/postulations');
        } catch (error) {
            console.error('Error eliminando la postulación:', error);
        }
    };

    const formatLink = (link) => {
        return link.split('/').slice(0, 3).join('')
    }


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
        <div className="job_details">
            <div className="header">
                <div className="left_side">
                    <Link to='/postulations'><span><FontAwesomeIcon icon={faArrowLeft} />Volver a lista de postulaciones</span></Link>
                    <h1>{postulation.company_name}</h1>
                    <p>{postulation.role}</p>
                </div>

                <div className="rigth_side">
                    <button className='update'>Actualizar</button>
                    <button onClick={handleDelete} className='delete'>Eliminar</button>
                </div>
            </div>

            <div className="rode_map_details">
                <h2>{postulation.postulation_state}</h2>
                <div className="rode_map_options">
                    <button className='modify_route'>Modificar ruta</button>
                    <div className="progress_">
                        <button>Prev</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>


            <div className="postulation_content">
                <div className="general_details_left">
                    <p>Descripcion del puesto</p>
                    <div className="job_description">
                        {postulation.job_description}
                    </div>
                    <div className="requirement_details">
                        <div className="requirement">
                            <p>Requisitos</p>
                            <ul>
                                {postulation.requirements.map((requirement) => {
                                    return (
                                        <li>{requirement}</li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="postulation_platform_de">
                            <div className="platform_detail">
                                <p>Plataforma</p>
                                <div className="platform_value">
                                    <span>{postulation.platform}</span>
                                </div>
                            </div>

                            <div className="platform_detail">
                                <p>Ciudad</p>
                                <div className="platform_value">
                                    <span>{postulation.city}</span>
                                </div>
                            </div>

                            <div className="platform_detail">
                                <p>URL</p>
                                <div className="platform_value">
                                    <a
                                        href={postulation.postulation_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {formatLink(postulation.postulation_url)}
                                    </a>
                                </div>
                            </div>

                            <div className="platform_detail">
                                <p>Tipo de trabajo</p>
                                <div className="platform_value">
                                    <span>{postulation.work_type}</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="general_details_rigth">
                    <div className="postulation_detail">
                        <p>Salario</p>
                        <span>{postulation.salary}</span>
                    </div>
                    <div className="postulation_detail">
                        <p>Experiencia</p>
                        <span>{postulation.experience}</span>
                    </div>
                    <div className="postulation_detail">
                        <p>Candidatos</p>
                        <span>{postulation.candidates_applied}</span>
                    </div>
                    <div className="postulation_detail">
                        <p>Plazas</p>
                        <span>{postulation.available_positions}</span>
                    </div>
                </div>
            </div>
        </div>

    );
}
