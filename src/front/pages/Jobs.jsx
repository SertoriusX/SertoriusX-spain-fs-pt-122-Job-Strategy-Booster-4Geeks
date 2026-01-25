import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/jobs.css';
import JobCard2 from '../components/JobComponent/JobCard2';
import MenuButttons from '../components/home/MenuButtons';
import '../styles/JobCard2.css';

export default function Jobs() {
  const options = ['Todos', 'Abierto', 'Cerrado', 'Espera'];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const statusMap = {
    'Abierto': 'open',
    'Cerrado': 'closed',
    'Espera': 'pending',
  };

  useEffect(() => {
    let url = `${backendUrl}/postulacion`;

    if (selectedFilter === 'Todos') {
      url = `${backendUrl}/postulacion`;
    } else {
      const status = statusMap[selectedFilter];
      url = `${backendUrl}/postulacion/filter?status=${status}`;
    }

    axios.get(url)
      .then(res => {
        setPostulaciones(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [selectedFilter, backendUrl]);

  function handleFilterChange(filter) {
    setSelectedFilter(filter);
  }

  return (
    <div className="app-container">
      <div className="filters">
        <MenuButttons options={options} onFilterChange={handleFilterChange} selected={selectedFilter} />
        <button className='advance_filter'>Filtros Avanzados</button>
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
