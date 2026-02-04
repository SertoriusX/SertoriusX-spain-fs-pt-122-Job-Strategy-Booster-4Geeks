import { useContext, useEffect, useState } from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';
import useGetAuthorizationHeader from '../../hooks/useGetAuthorizationHeader';
import { getPostulationById, removePostulation } from '../../Fetch/postulationFecth';
import "../../styles/jobDetails.css"

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Stepper from '../CreateRouteMap';
import RouteMapPreview from '../RouteMapPreview';
import { getRoutes } from '../../Fetch/routeMapFecth';
import { UserContext } from '../../hooks/UserContextProvier';
import axios from 'axios';

export default function JobsDetail() {
    const status = ['Closet', 'Open']
    const { id } = useParams();
    const navigate = useNavigate();
    const isRouteMap = useMatch('/postulations/:id/route-map');
    const authorizationHeader = useGetAuthorizationHeader();
    const [postulation, setPostulation] = useState(null);
    const [stages, setStages] = useState([])
    const { token } = useContext(UserContext);
    const [editStatus, setEditStatus] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleDelete = async () => {
        if (!postulation) return;
        await removePostulation(postulation.id, authorizationHeader);
        navigate('/postulations');

    };

    const formatLink = (link) => {
        return link.split('/').slice(0, 3).join('')
    }

    useEffect(() => {
        const fetchPostulation = async () => {
            const result = await getPostulationById(id, authorizationHeader);
            setPostulation({
                ...result,
                requirements: result.requirements
            });
        };

        const getRouteMap = async () => {
            const routeMapList = await getRoutes(id, authorizationHeader)
            setStages(routeMapList.stages)
        }

        fetchPostulation();
        getRouteMap()
    }, [id]);
    const handleStatusUpdate = async (e) => {
        e.preventDefault();

        if (!editStatus) {
            alert("Please select a status");
            return;
        }

        try {
            await axios.put(
                `${backendUrl}/postulations/status/${id}`,
                { postulation_state: editStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            navigate('/postulations');

            setPostulation(prev => ({ ...prev, postulation_state: editStatus }));

            alert("Status updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    if (!postulation) return <p>Postulation not found</p>;

    return (
        <div className="job_details">
            <div className="header">
                <div className="left_side">
                    <Link to='/postulations'><span><FontAwesomeIcon icon={faArrowLeft} />Volver a lista de postulaciones</span></Link>
                    <h1>{postulation.company_name}</h1>
                    <section>
                        <h5 className='role'>{postulation.role}</h5>
                        <h5>{postulation.postulation_state}</h5>
                    </section>
                </div>

                <div className="rigth_side">
                    <button className='update'>Actualizar</button>
                    <button onClick={handleDelete} className='delete'>Eliminar</button>
                    {!isRouteMap && (
                        <button onClick={() => navigate(`/postulations/${id}/route-map`)}>
                            Modificar ruta
                        </button>
                    )}
                </div>
            </div>
            <form className="status_form" onSubmit={handleStatusUpdate}>
                <select
                    value={editStatus || postulation.postulation_state || ""}
                    onChange={(e) => setEditStatus(e.target.value)}
                >
                    <option value="">Select status</option>
                    {status.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button type="submit" className="update">Actualizar</button>
            </form>

            <div className="rode_map_details">
                {isRouteMap
                    ? <Stepper stages={stages} id={id} setStages={setStages} />
                    : <RouteMapPreview stages={stages} id={id} setStages={setStages} />
                }
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
