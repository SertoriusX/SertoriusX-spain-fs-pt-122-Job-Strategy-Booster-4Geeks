import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard2 from '../components/JobComponent/JobCard2';
import MenuButttons from '../components/home/MenuButtons';
import { Link } from 'react-router-dom';
import useGetAuthorizationHeader from '../hooks/useGetAuthorizationHeader';
import '../styles/jobs.css';
import '../styles/JobCard2.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Jobs() {
  const authorizationHeader = useGetAuthorizationHeader();
  const options = ['All', 'Closet', 'Open'];

  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    axios.get(`${backendUrl}/postulations`, authorizationHeader)
      .then(res => {
        setPostulaciones(res.data.postulations);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredPostulations = selectedFilter === 'All'
    ? postulaciones
    : postulaciones.filter(p => p.postulation_state === selectedFilter);

  return (
    <div className="app-container">
      <div className="filters">
        <div className="filter">
          <MenuButttons options={options} onFilterChange={setSelectedFilter} />
        </div>

        <Link to='/img-post'>
          <button className="add_new_postulation">Agregar img</button>
        </Link>
        <Link to='/formulario'>
          <button className="add_new_postulation">Agregar</button>
        </Link>
      </div>

      <div className="cards-grid">
        {filteredPostulations.length > 0 ? (
          filteredPostulations.map(post => (
            <JobCard2 post={post} key={post.id} />
          ))
        ) : (
          <p>No hay trabajos para mostrar con este filtro.</p>
        )}
      </div>
    </div>
  );
}
