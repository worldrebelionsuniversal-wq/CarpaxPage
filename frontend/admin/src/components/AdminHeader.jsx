import React from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminHeader.css';

function AdminHeader() {
    const { user } = useAuth();

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <h2>Panel de Administración</h2>
            </div>

            <div className="admin-header-right">
                <button className="header-icon-btn">
                    <FaBell />
                    <span className="notification-badge">3</span>
                </button>
                
                <div className="admin-user">
                    <FaUserCircle className="user-icon" />
                    <span>{user?.name || 'Administrador'}</span>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;