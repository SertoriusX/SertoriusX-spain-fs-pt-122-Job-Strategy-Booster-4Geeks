import React from 'react'
import Sidebar from './SideBar'
import { Outlet } from 'react-router-dom'
import "../styles/AllPage.css"

export default function Layout() {
    return (
        <div>   <div className='container'>
            <div className='left'><Sidebar /></div>
            <div className='right' ><Outlet /></div>


        </div></div>
    )
}
