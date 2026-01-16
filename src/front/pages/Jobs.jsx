import React from 'react'
import '../styles/jobs.css'
import JobCard from '../components/JobCard'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Jobs() {


    return (
        <div className="app-container">
            <h1 className="custom-title">Jobs</h1>

            <div className="cards-grid">
                {[1, 1, 1, 1, 1, 1, 1].map((card) => {
                    return (
                        <JobCard />
                    )
                })}
            </div>
        </>
    );
}
