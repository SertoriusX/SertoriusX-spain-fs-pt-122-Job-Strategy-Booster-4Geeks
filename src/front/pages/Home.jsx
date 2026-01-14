import { faBell, faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/home.css";
import HomeStatisticsCard from "../Components/HomeStatisticsCard";
import GraficoDinamico from "../components/GraphicComponent";

function HomePage() {
	return (
		<div className="home_display">

			<div className="header_bar">
				<FontAwesomeIcon className="notification_icon" icon={faBell} />

				<div className="user_data">
					<div className="user_personal_information">
						<h3>Nombre del usuario</h3>
						<p>correodelusuario@gmailcom</p>
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
					<h3>Actividad del mes</h3>
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
