import { faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "../styles/home.css";
import HomeStatisticsCard from "../components/home/HomeStatisticsCard";
import GraficoDinamico from "../components/home/GraphicComponent";
import Calendar from "../components/home/Calendar";
import '../styles/homeWidgets.css'
import MenuButttons from "../components/home/MenuButtons";
import { getPostulations } from "../Fetch/postulationFecth";
import useGetAuthorizationHeader from "../hooks/useGetAuthorizationHeader";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../hooks/UserContextProvier";


function HomePage() {
	const options = ['Mes', 'Semana', 'Año']
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const [postulation, setPostulation] = useState([])
	const authorizationHeader = useGetAuthorizationHeader();
	const [oferta, setOferta] = useState(0)
	const [entrevista, setEntrevista] = useState(0)
	const [descartado, setDescartado] = useState(0)




	const [post, setPost] = useState(0)
	const applicationStatistics = (state) => {
		const totalInterview = postulation.filter((p) => p.postulation_state === state).length
		return totalInterview
	}
	const { token } = useContext(UserContext)

	const graficoStats = [
		{ name: "Postulaciones", value: postulation.length, color: "#338fe1ff" },
		{ name: "Entrevistas", value: applicationStatistics('Entrevista'), color: "#8462bfff" },
		{ name: "Ofertas", value: applicationStatistics('oferta'), color: "#4c9e50ff" },
		{ name: "Descartado", value: applicationStatistics('descartado'), color: "#e44441ff" }
	];
	useEffect(() => {
		axios.get(`${backendUrl}/postulacion/entrevista`).then((res) => { setEntrevista(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])

	useEffect(() => {
		axios.get(`${backendUrl}/postulacion/oferta`).then((res) => { setOferta(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])

	useEffect(() => {
		axios.get(`${backendUrl}/postulacion/descartado`).then((res) => { setDescartado(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])

	useEffect(() => {
		axios.get(`${backendUrl}/postulacion/count`, {
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${token}`
			}

		}).then((res) => { setPost(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [])





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
				<HomeStatisticsCard title={'Postulaciones'} quantity={post.postulation} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={entrevista.entrevista} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={oferta.oferta} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={descartado.descartado} date={'12/01/2026'} icon={faCircleXmark} />
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
