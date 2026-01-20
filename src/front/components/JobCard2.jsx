import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarDays, faEuroSign, faPeopleGroup, faClipboardList } from "@fortawesome/free-solid-svg-icons";


function JobCard2() {
    return (
        <div className="card_container">

            <div className="card_header">
                <div className="header_title">
                    <span className="status">Open</span>
                    <span className="category">Developer</span>
                </div>
                <button className="view_details">Detalles</button>
            </div>

            <div className="application_card_title">
                <div className="title">
                    <h2>React developer</h2>
                    <div className="created_at">
                        <h4><FontAwesomeIcon icon={faLocationDot} />Location</h4>
                        <h4><FontAwesomeIcon icon={faCalendarDays} />Ene 20,2026</h4>
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
                        <span className="data">€30k/anual</span>
                    </div>
                    <div className="app_stat candidates">
                        <p><FontAwesomeIcon icon={faPeopleGroup} />Candidatos</p>
                        <span className="data">20</span>
                    </div>
                    <div className="app_stat application_status">
                        <p><FontAwesomeIcon icon={faClipboardList} />Proceso</p>
                        <span className="data">Entrevista Tectinca</span>
                    </div>
                </div>
                <div className="application_tags">
                    <span style={{ "--tag-color": "var(--job-type)" }}>Remoto</span>
                    <span style={{ "--tag-color": "var(--contract-type)" }}>M Tiempo</span>
                    <span style={{ "--tag-color": "var(--experience)" }}>2 Años</span>
                    <span style={{ "--tag-color": "var(--slots)" }}>2 Plazas</span>
                </div>
            </div>
        </div>
    )
}

export default JobCard2