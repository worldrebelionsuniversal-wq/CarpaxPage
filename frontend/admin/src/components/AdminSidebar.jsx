import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaImages, FaUsers, FaShoppingCart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminSidebar.css';

function AdminSidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/productos', icon: <FaBox />, label: 'Productos' },
        { path: '/imagenes', icon: <FaImages />, label: 'Imágenes' },
        { path: '/usuarios', icon: <FaUsers />, label: 'Usuarios' },
        { path: '/pedidos', icon: <FaShoppingCart />, label: 'Pedidos' },
        { path: '/configuracion', icon: <FaCog />, label: 'Configuración' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <small>Panel de Admin</small>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={logout}>
                    <FaSignOutAlt /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;