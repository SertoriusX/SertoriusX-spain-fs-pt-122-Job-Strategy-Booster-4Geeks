import React from 'react'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import "../styles/app.css"

export default function App() {
    return (
        <div className="main_container">
            <Sidebar />
            <div className="display_component">
                <Outlet />
            </div>
        </div>
    )
}
