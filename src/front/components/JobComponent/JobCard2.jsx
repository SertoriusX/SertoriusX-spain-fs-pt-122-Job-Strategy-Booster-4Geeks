import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faEuroSign, faPeopleGroup, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


function JobCard2({post}) {
    const navigate=useNavigate()
    return (
        <div onClick={()=>navigate(`/postulacion/${post.id}`)} className="card_container">

            <div className="card_header">
                <div className="header_title">
                    <span className="status">{post.status}</span>
                    <span className="category">{post.company}</span>
                </div>
                <button className="view_details">Detalles</button>
            </div>

            <div className="application_card_title">
                <div className="title">
                    <h2>{post.title}</h2>
                    <div className="created_at">
                        <h4><FontAwesomeIcon icon={faLocationDot} />{post.location}</h4>
                        <h4><FontAwesomeIcon icon={faCalendarDays} />{post.posted_date}</h4>
                    </div>
                    <div className="progres_chart">

                    </div>
                </div>
                <span>Chart</span>
            </div>

            <div className="application_body">
                <div className="application_details">
                    <div className="app_stat salary">
                        <p><FontAwesomeIcon icon={faEuroSign} />Salario</p>
                        <span className="data">{post.salary}</span>
                    </div>
                    <div className="app_stat candidates">
                        <p><FontAwesomeIcon icon={faPeopleGroup} />Candidatos</p>
                        <span className="data">{post.candidates_applied}</span>
                    </div>
                    <div className="app_stat application_status">
                        <p><FontAwesomeIcon icon={faClipboardList} />Proceso</p>
                        <span className="data">{post.proceso}</span>
                    </div>
                </div>
                <div className="application_tags">
                    <span style={{ "--tag-color": "var(--job-type)" }}>{post.work_type}</span>
                    <span style={{ "--tag-color": "var(--contract-type)" }}>{post.tiempo}</span>
                    <span style={{ "--tag-color": "var(--experience)" }}>{post.experience}</span>
                    <span style={{ "--tag-color": "var(--slots)" }}>{post.total_positions} Plazas</span>
                </div>
            </div>
        </div>
    )
}

export default JobCard2