import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/jobs.css';
import JobCard2 from '../components/JobComponent/JobCard2';
import MenuButttons from '../components/home/MenuButtons';
import '../styles/JobCard2.css';
import { Link } from 'react-router-dom';
import useGetAuthorizationHeader from '../hooks/useGetAuthorizationHeader';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Jobs() {
  const authorizationHeader = useGetAuthorizationHeader();
  const options = ['Todos', 'Abierto', 'Cerrado', 'Espera'];

  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const statusMap = {
    'Abierto': 'open',
    'Cerrado': 'closed',
    'Espera': 'pending',
  };

  useEffect(() => {
    let url = `${backendUrl}/postulations`;

    if (selectedFilter === 'Todos') {
      url = `${backendUrl}/postulations`;
    } else {
      const status = statusMap[selectedFilter];
      url = `${backendUrl}/postulations/filter?status=${status}`;
    }

    axios.get(url, authorizationHeader)
      .then(res => {
        setPostulaciones(res.data.postulations);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  function handleFilterChange(filter) {
    setSelectedFilter(filter);
  }

  return (
    <div className="app-container">
      <div className="filters">
        <div className="filter">
          <MenuButttons options={options} onFilterChange={handleFilterChange} selected={selectedFilter} />
          <button className='advance_filter'>Filtros Avanzados</button>
        </div>

        <Link to='formulario'><button className="add_new_postulation">Add</button></Link>
      </div>
      <div className="cards-grid">
        {postulaciones.length > 0 ? (
          postulaciones.map(post => (
            <JobCard2 post={post} key={post.id} />
          ))
        ) : (
          <p>No hay trabajos para mostrar con este filtro.</p>
        )}
      </div>
    </div>
  );
}
