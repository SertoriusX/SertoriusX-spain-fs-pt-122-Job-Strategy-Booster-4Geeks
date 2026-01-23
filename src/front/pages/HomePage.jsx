import { faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "../styles/home.css";
import HomeStatisticsCard from "../components/HomeStatisticsCard";
import GraficoDinamico from "../components/GraphicComponent";
import Calendar from "../components/Calendar";
import '../styles/homeWidgets.css'
import MenuButttons from "../components/MenuButtons";
import { getPostulations } from "../Fetch/postulationFecth";
import { useGetAuthorizationHeader } from "../hooks/useGetAuthorizationHeader";
import { useEffect, useState } from "react";


function HomePage() {
	const options = ['Mes', 'Semana', 'Año']
	const [postulation, setPostulation] = useState([])
	const authorizationHeader = useGetAuthorizationHeader();

	const applicationStatistics = (state) => {
		const totalInterview = postulation.filter((p) => p.postulation_state === state).length
		return totalInterview
	}

	const graficoStats = [
		{ name: "Postulaciones", value: postulation.length, color: "#338fe1ff" },
		{ name: "Entrevistas", value: applicationStatistics('Entrevista'), color: "#8462bfff" },
		{ name: "Ofertas", value: applicationStatistics('oferta'), color: "#4c9e50ff" },
		{ name: "Descartado", value: applicationStatistics('descartado'), color: "#e44441ff" }
	];

	useEffect(() => {
		const fetchPostulations = async () => {
			const result = await getPostulations(authorizationHeader);
			setPostulation(result.postulations);
		};
		fetchPostulations()
	}, [])

	return (
		<div className="home_display">
			<div className="statistics_container">
				<HomeStatisticsCard title={'Postulaciones'} quantity={postulation.length} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={applicationStatistics('Entrevista')} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={applicationStatistics('oferta')} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={applicationStatistics('descartado')} date={'12/01/2026'} icon={faCircleXmark} />
			</div>
			<div className="grafica">
				<div className="title">
					<h3>Registro de actividad</h3>
					<MenuButttons options={options} />
				</div>
				<GraficoDinamico stats={graficoStats} />
			</div>
			<div className="calendar">
				<Calendar />
			</div>
			<div className="todo_list">hola</div>
		</div>
	);
}

export default HomePage;
