import React from 'react'
import '../styles/jobs.css'
import JobCard from '../components/JobCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import JobCard2 from '../components/JobCard2';

import '../styles/JobCard2.css'
import MenuButttons from '../components/MenuButtons';

export default function Jobs() {
    const options = ['Todos', 'Abierto', 'Cerrado', 'Espera']
    return (
        <div className="app-container">
            <div className="filters">
                <MenuButttons options={options} />
                <button className='advance_filter'>Filtros Avanzados</button>
            </div>
            <div className="cards-grid">
                {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((card) => {
                    return (
                        <JobCard2 />
                    )
                })}
            </div>
        </div>
    );
}
