import React from 'react'
import '../styles/jobs.css'
import JobCard from '../components/JobCard'
export default function Jobs() {
    return (
        <div className="app-container">
            <h1 className="custom-title">Jobs</h1>

            <div className="cards-grid">
                {[1].map((card) => {
                    return (
                        <JobCard />
                    )
                })}
            </div>
        </div>
    )
}
