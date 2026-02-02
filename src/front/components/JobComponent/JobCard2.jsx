import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faEuroSign, faPeopleGroup, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";


function JobCard2({ post }) {
    const navigate = useNavigate()
    const formatDate = (date) => {
        if (!date) return ""
        const dateFormated = date.split(' ').slice(0, 4).join(' ')
        return dateFormated
    }

    return (
        <div className="card_container">

            <div className="card_header">
                <div className="header_title">
                    <span className="status">{post.postulation_state}</span>
                    <span className="category">{post.company_name}</span>
                </div>
                <button onClick={() => navigate(`/postulations/${post.id}`)} className="view_details">Detalles</button>
            </div>

            <div className="application_card_title">
                <div className="title">
                    <h2>{post.role}</h2>
                    <div className="created_at">
                        <h4><FontAwesomeIcon icon={faLocationDot} />{post.city}</h4>
                        <h4><FontAwesomeIcon icon={faCalendarDays} />{formatDate(post.inscription_date)}</h4>
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
                    <span style={{ "--tag-color": "var(--experience)" }}>{post.experience} Años de exp</span>
                    <span style={{ "--tag-color": "var(--slots)" }}>{post.available_positions} Plazas</span>
                </div>
            </div>
        </div>
    )
}

export default JobCard2