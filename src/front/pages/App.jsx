import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './SideBar';
import HomePage from './Home';

import '../styles/app.css'
import Jobs from './Jobs';
import Registration from './RegisterPage';

const App = () => {
    return (
        <Registration />
        /*         <div className='main_container'>
                    <Sidebar />
        
                    <div className='display_component'>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/jobs" element={<Jobs />} />
                        </Routes>
                    </div>
                </div> */
    );
};

export default App;
