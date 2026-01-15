import React from 'react'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import "../styles/app.css"

export default function App() {
    return (
        <div className="layout">
            <Sidebar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}
