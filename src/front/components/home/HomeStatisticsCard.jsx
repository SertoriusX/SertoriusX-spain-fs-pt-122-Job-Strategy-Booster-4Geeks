import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function HomeStatisticsCard({ title, icon, quantity, date }) {
    return (
        <div className="statistics_card">
            <h1>{quantity}</h1>
            <div className="relevant_information">
                <h2>{title}</h2>
                <p>{date}</p>
            </div>
        </div>
    )
}

export default HomeStatisticsCard