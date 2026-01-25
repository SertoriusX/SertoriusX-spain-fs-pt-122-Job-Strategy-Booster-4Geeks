import { faBell, faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "../styles/home.css";
import HomeStatisticsCard from "../components/home/HomeStatisticsCard";
import GraficoDinamico from "../components/home/GraphicComponent";
import Calendar from "../components/home/Calendar";
import '../styles/homeWidgets.css'
import MenuButttons from "../components/home/MenuButtons";
import { useEffect, useState } from "react";
import axios from "axios";


function HomePage() {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [count, setCount] = useState(0)
	const [entrevista, setEntrevista] = useState(0)
	const [descartado, setDescartado] = useState(0)

	const [oferta, setOferta] = useState(0)


	useEffect(() => {




		axios.get(`${backendUrl}/posts/my-post-count`).then((res) => { setCount(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])

	useEffect(() => {
		axios.get(`${backendUrl}/posts/entrevista`).then((res) => { setEntrevista(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])

	useEffect(() => {
		axios.get(`${backendUrl}/posts/descartado`).then((res) => { setDescartado(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])

	useEffect(() => {
		axios.get(`${backendUrl}/posts/oferta`).then((res) => { setOferta(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])



	const options = ['Mes', 'Semana', 'Año']
	return (
		<div className="home_display">
			<div className="statistics_container">
				<HomeStatisticsCard title={'Postulaciones'} quantity={count.count} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={entrevista.entrevista} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={descartado.descartado} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={oferta.oferta} date={'12/01/2026'} icon={faCircleXmark} />
			</div>
			<div className="grafica">
				<div className="title">
					<h3>Registro de actividad</h3>
					<MenuButttons options={options} />
				</div>
				<GraficoDinamico />
			</div>
			<div className="calendar">
				<Calendar />
			</div>
			<div className="todo_list">hola</div>
		</div>
	);
}

export default HomePage;
