import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useCartContext } from '../context/CartContext';
import '../styles/Header.css';

function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { getTotalItems } = useCartContext();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
            setMenuOpen(false);
        }
    };

    return (
        <header className="header">
            {/* ===== LOGO ===== */}
            <div className="logo">
                <Link to="/">
                    <span className="logo-text">Carpax</span>
                </Link>
            </div>

            {/* ===== MENU HAMBURGUESA (SOLO PARA MÓVIL) ===== */}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* ===== BUSCADOR (CENTRADO) ===== */}
            <form className="search-box" onSubmit={handleSearch}>
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Buscar carpas..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">Buscar</button>
            </form>

            {/* ===== CARRITO ===== */}
            <div className="header-actions">
                <Link to="/carrito" className="cart" onClick={() => setMenuOpen(false)}>
                    <FaShoppingCart />
                    <span className="badge">{getTotalItems()}</span>
                </Link>
            </div>
        </header>
    );
}

export default Header;