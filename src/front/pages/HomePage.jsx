import { faBell, faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "../styles/home.css";
import HomeStatisticsCard from "../components/HomeStatisticsCard";
import GraficoDinamico from "../components/GraphicComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function HomePage() {
	return (
		<div className="home_display">

			<div className="header_bar">
				<FontAwesomeIcon className="notification_icon" icon={faBell} />
				<div className="user_data">
					<div className="user_personal_information">
						<h3>Hello</h3>
						<p>Hola</p>
					</div>
					<div className="user_picture"></div>
				</div>
			</div>

			<div className="statistics_container">
				<HomeStatisticsCard title={'Postulaciones'} quantity={10} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={5} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={0} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={0} date={'12/01/2026'} icon={faCircleXmark} />
			</div>

			<div className="widgets">
				<div className="grafica">
					<div className="title">
						<h3>Actividad</h3>
						<p>Semanal</p>
					</div>
					<GraficoDinamico />
				</div>
				<div className="remainders"></div>
				<div className="calendar"></div>
				<div className="todo_list"></div>
			</div>
		</div>
	);
}

export default HomePage;
