import { useEffect, useState } from 'react';
import { Link, useMatch, useParams } from 'react-router-dom';
import useGetAuthorizationHeader from '../../hooks/useGetAuthorizationHeader';
import { getPostulationById, removePostulation, updatePostulation } from '../../Fetch/postulationFecth';
import "../../styles/jobDetails.css"


import Stepper from '../CreateRouteMap';
import RouteMapPreview from '../RouteMapPreview';
import { getRoutes } from '../../Fetch/routeMapFecth';

export default function JobDetailsEdit({ postulation, setPostulation, isEdit, setIsEdit, stages }) {
    const { id } = useParams();
    const isRouteMap = useMatch('/postulations/:id/route-map');
    const authorizationHeader = useGetAuthorizationHeader();
    const [originalPostulation, setOriginalPostulation] = useState(postulation);

    const addRequirement = () => {
        setPostulation(prev => ({
            ...prev,
            requirements: [...prev.requirements, ""]
        }));
    };

    const removeRequirement = (index) => {
        setPostulation(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, id) => id !== index)
        }));
    };

    const updateRequirement = (index, value) => {
        setPostulation(prev => {
            const newRequirements = [...prev.requirements];
            newRequirements[index] = value;
            return { ...prev, requirements: newRequirements };
        });
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setPostulation(prev => ({
            ...prev,
            [name]:
                type === "number"
                    ? value === "" ? null : Number(value)
                    : value
        }));
    };

    const handleSave = async () => {
        const filteredPostulation = {
            ...postulation,
            requirements: postulation.requirements.filter(req => req.trim() !== "")
        };

        await updatePostulation(filteredPostulation, id, authorizationHeader);
        setPostulation(filteredPostulation);
        setOriginalPostulation(filteredPostulation);
        setIsEdit(false);
    };

    const handleCancel = () => {
        setPostulation(originalPostulation)
        setIsEdit(false);
    };


    if (!postulation) return <p>Postulation not found</p>;

    return (
        <div className="job_details">
            <div className="header">
                <div className="left_side">
                    <h1>
                        <input
                            type="text"
                            name="company_name"
                            value={postulation.company_name}
                            placeholder='Nombre de la compañia'
                            onChange={handleChange}
                        />
                    </h1>
                    <section>
                        <h5 className="role">
                            <input
                                type="text"
                                name="role"
                                value={postulation.role}
                                placeholder='Cargo'
                                onChange={handleChange}
                            />
                        </h5>
                        <h5>{postulation.postulation_state}</h5>
                    </section>
                </div>

                <div className="rigth_side">
                    <button onClick={handleSave} className='update'>Guardar</button>
                    <button onClick={handleCancel} className='delete'>Descartar</button>
                </div>
            </div>

            <div className="rode_map_details">
                <RouteMapPreview stages={stages} id={id} isEdit={isEdit} />
            </div>

            <div className="postulation_content">
                <div className="general_details_left">
                    <p>Descripcion del puesto</p>
                    <div className="job_description">
                        <textarea
                            name="job_description"
                            value={postulation.job_description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="requirement_details">
                        <div className="requirement">
                            <p>Requisitos</p>
                            <ul>

                                {postulation.requirements.map((requirement, index) => (
                                    <li key={index} className="requirement-item">
                                        <div className="requirement_container">
                                            <input
                                                type="text"
                                                value={requirement}
                                                onChange={(e) => updateRequirement(index, e.target.value)}
                                                placeholder="Escribe un requisito"
                                                className="requirement_input"
                                            />
                                            <button
                                                type="button"
                                                className="remove_requirement"
                                                onClick={() => removeRequirement(index)}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    </li>

                                ))}
                            </ul>

                            <button
                                type="button"
                                className="add_requirement"
                                onClick={addRequirement}
                            >
                                ➕ Añadir requisito
                            </button>
                        </div>
                        <div className="postulation_platform_de">
                            <div className="platform_detail">
                                <p>Plataforma</p>
                                <div className="platform_value">
                                    <input
                                        type="text"
                                        name="platform"
                                        value={postulation.platform}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="platform_detail">
                                <p>Ciudad</p>
                                <div className="platform_value">
                                    <input
                                        type="text"
                                        name="city"
                                        value={postulation.city}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="platform_detail">
                                <p>URL</p>
                                <div className="platform_value">

                                    <input
                                        type="url"
                                        name="postulation_url"
                                        value={postulation.postulation_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="platform_detail">
                                <p>Tipo de trabajo</p>
                                <div className="platform_value">
                                    <select
                                        name="work_type"
                                        value={postulation.work_type}
                                        onChange={handleChange}
                                    >
                                        <option>Presencial</option>
                                        <option>Remoto</option>
                                        <option>Híbrido</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="general_details_rigth">
                    <div className="postulation_detail">
                        <p>Salario</p>
                        <input type="number" name="salary" value={postulation.salary} onChange={handleChange} />
                    </div>
                    <div className="postulation_detail">
                        <p>Experiencia</p>
                        <input type="text" name='experience' value={postulation.experience} onChange={handleChange} />
                    </div>
                    <div className="postulation_detail">
                        <p>Candidatos</p>
                        <input type="text" name='candidates_applied' value={postulation.candidates_applied} onChange={handleChange} />
                    </div>
                    <div className="postulation_detail">
                        <p>Plazas</p>
                        <input type="text" name='available_positions' value={postulation.available_positions} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </div>

    );
}
