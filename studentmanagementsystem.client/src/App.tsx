import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Navbar from './pages/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                {isAuthenticated && (
                    <>
                        <Route path="/students" element={<Students />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/classes" element={<Classes />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
