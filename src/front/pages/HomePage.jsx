import { faSuitcase, faUserTie, faEnvelopesBulk, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "../styles/OrdersTable.css";

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
import { Todo } from "../components/home/TodoConponents.jsx/Todo";
import { ProfileHook } from "../hooks/ProfileHook";
import CreateProfile from "../components/ProfileComponents/CreateProfile";


function HomePage() {

	const { navigate, profile, handleChange, inputValue, setInputValue, handleKeyDown, removeTag, handleSend, parseSkills, form } = ProfileHook()
	const options = ['Mes', 'Semana', 'Año']
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const [postulation, setPostulation] = useState([])
	const authorizationHeader = useGetAuthorizationHeader();
	const [status, setStatus] = useState(0)
	const [showCreateProfile, setShowCreateProfile] = useState(false);
	const [postulaciones, setPostulaciones] = useState([])
	const [active, setActive] = useState("All");

	const filters = [
		"All",
		"hr_interview",
		"technical_interview",
		"practical_test",
		"results_review",
		"final_interview",
		"offer",
	];

	const { token } = useContext(UserContext);

	useEffect(() => {
		axios.get(`${backendUrl}/postulations`, {
			headers: { Authorization: `Bearer ${token}` }
		}).then((res) => { setPostulaciones(res.data.postulations) }).catch((err) => {
			console.error(err);
		})
	}, [backendUrl, token])

	const filtered =
		active === "All"
			? postulaciones
			: postulaciones.filter(
				d => d.stages?.[d.stages.length - 1]?.stage_name === active
			);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 3;
	const totalPages = Math.ceil(filtered.length / itemsPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, [active, postulaciones]);

	const nextPageIndex = currentPage * itemsPerPage;
	const previousPageIndex = nextPageIndex - itemsPerPage;
	const paginatedData = filtered.slice(previousPageIndex, nextPageIndex);

	const nextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const [post, setPost] = useState(0)
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
		axios.get(`${backendUrl}/status`).then((res) => { setStatus(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [backendUrl])

	useEffect(() => {
		axios.get(`${backendUrl}/postulacion/count`, {
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${token}`
			}

		}).then((res) => { setPost(res.data) }).catch((err) => {
			console.error(err);
		})
	}, [backendUrl, token])

	useEffect(() => {
		const fetchPostulations = async () => {
			try {
				const result = await getPostulations({ headers: { Authorization: `Bearer ${token}` } });
				setPostulation(result.postulations);
			} catch (error) {
				console.error(error);
			}
		};
		if (token) fetchPostulations();
	}, [token]);
	function formatFilterName(name) {
		return name
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	return (
		<div className="home_display">
			<div className="statistics_container">
				<HomeStatisticsCard title={'Postulaciones'} quantity={post.postulation} date={'12/01/2026'} icon={faSuitcase} />
				<HomeStatisticsCard title={'Entrevistas'} quantity={status.entrevista} date={'12/01/2026'} icon={faUserTie} />
				<HomeStatisticsCard title={'Ofertas'} quantity={status.offer} date={'12/01/2026'} icon={faEnvelopesBulk} />
				<HomeStatisticsCard title={'Descartado'} quantity={status.descartado} date={'12/01/2026'} icon={faCircleXmark} />
			</div>
			<div className="grafica">
				{profile && (
					<div className="tableCard">

						<div className="tabs">
							{filters.map((f) => (
								<button
									key={f}
									className={active === f ? "tab active" : "tab"}
									onClick={() => setActive(f)}
								>
									{formatFilterName(f)}
								</button>
							))}
						</div>

						<table className="ordersTable">
							<thead>
								<tr>
									<th>Company Name</th>
									<th>Cargo</th>
									<th>Date</th>
									<th>Platform</th>
								</tr>
							</thead>

							<tbody>
								{paginatedData.map((o) => {
									const stage = o.stages?.[o.stages.length - 1]?.stage_name;

									return (
										<tr key={o.id}>
											<td className="userCell">
												{o.company_name}
											</td>
											<td>{o.role}</td>
											<td>{new Date(o.inscription_date).toLocaleDateString()}</td>
											<td>{o.platform}</td>

										</tr>
									);
								})}
							</tbody>
						</table>

						<div style={{ marginTop: 16, textAlign: "center" }}>
							<button onClick={prevPage} disabled={currentPage === 1} style={{ marginRight: 8 }}>
								Prev
							</button>
							<span>Page {currentPage} of {totalPages}</span>
							<button onClick={nextPage} disabled={currentPage === totalPages} style={{ marginLeft: 8 }}>
								Next
							</button>
						</div>

					</div>
				)}

				{!profile && !showCreateProfile && (
					<button
						className="open-create-profile-btn"
						onClick={() => setShowCreateProfile(true)}
					>
						Create Profile
					</button>
				)}

				{!profile && showCreateProfile && (
					<CreateProfile
						handleKeyDown={handleKeyDown}
						form={form}
						handleSend={handleSend}
						handleChange={handleChange}
						removeTag={removeTag}
						inputValue={inputValue}
						setInputValue={setInputValue}
						setShowCreateProfile={setShowCreateProfile}
					/>
				)}
			</div>
			<div className="calendar">
				<Calendar />
			</div>
			<div className="todo_list">
				<Todo />
			</div>
		</div>
	);
}

export default HomePage;
