import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function HomeStatisticsCard({ title, icon, quantity, date }) {
    return (
        <div className="statistics_card">
            <div className="title">
                <h2>{title}</h2>
                <FontAwesomeIcon className="icon" icon={icon} />
            </div>
            <h1>{quantity}</h1>
            <div className="last_update">
                <p>Actualizado</p>
                <p>{date}</p>
            </div>
        </div>
    )
}

export default HomeStatisticsCard