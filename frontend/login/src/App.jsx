import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import './styles/Login.css';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/" element={
                isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;