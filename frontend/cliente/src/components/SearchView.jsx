import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFilter, FaTimes, FaSlidersH } from 'react-icons/fa';
import { useProducts } from '../hooks/useProducts';
import { useCartContext } from '../context/CartContext';
import ProductList from './ProductList';
import '../styles/SearchView.css';

function SearchView() {
    const location = useLocation();
    const { products, loading, error, applyFilters, clearFilters, filters, setFilters } = useProducts();
    const { addToCart } = useCartContext();
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('q') || '';
        const type = params.get('type') || 'all';
        const offer = params.get('offer') === 'true';

        const newFilters = { search, type, offer };
        setLocalFilters(newFilters);
        applyFilters(newFilters);
    }, [location.search]);

    const handleFilterChange = (newFilters) => {
        setLocalFilters(newFilters);
        applyFilters(newFilters);
    };

    const handleClearFilters = () => {
        const resetFilters = { search: '', type: 'all', offer: false };
        setLocalFilters(resetFilters);
        clearFilters();
    };

    const categories = ['armable', 'plegable'];
    const capacities = ['2', '4', '6', '8+'];
    const colors = ['Blanca', 'Verde', 'Azul', 'Roja'];

    if (loading) {
        return (
            <div className="loading-screen">
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏕️</div>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                <p>Error: {error}</p>
                <button className="btn-primary" onClick={() => window.location.reload()}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="results-container">
            <div className="main-content">
                {/* ===== SIDEBAR ===== */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <FaFilter />
                        <h3>Filtros</h3>
                        <button className="clear-filters-btn" onClick={handleClearFilters}>
                            <FaTimes /> Limpiar
                        </button>
                    </div>

                    <div className="filter-section">
                        <h4>Tipo</h4>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="all"
                                    checked={localFilters.type === 'all'}
                                    onChange={() => handleFilterChange({...localFilters, type: 'all'})}
                                />
                                Todos
                            </label>
                            {categories.map(cat => (
                                <label key={cat} className="filter-option">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={cat}
                                        checked={localFilters.type === cat}
                                        onChange={() => handleFilterChange({...localFilters, type: cat})}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Capacidad</h4>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="capacity"
                                    value="all"
                                    checked={localFilters.capacity === 'all'}
                                    onChange={() => handleFilterChange({...localFilters, capacity: 'all'})}
                                />
                                Todos
                            </label>
                            {capacities.map(cap => (
                                <label key={cap} className="filter-option">
                                    <input
                                        type="radio"
                                        name="capacity"
                                        value={cap}
                                        checked={localFilters.capacity === cap}
                                        onChange={() => handleFilterChange({...localFilters, capacity: cap})}
                                    />
                                    {cap} pers.
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Color</h4>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="color"
                                    value="all"
                                    checked={localFilters.color === 'all'}
                                    onChange={() => handleFilterChange({...localFilters, color: 'all'})}
                                />
                                Todos
                            </label>
                            {colors.map(color => (
                                <label key={color} className="filter-option">
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color}
                                        checked={localFilters.color === color}
                                        onChange={() => handleFilterChange({...localFilters, color: color})}
                                    />
                                    <span className="color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                                    {color}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Ofertas</h4>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="offer"
                                    value="false"
                                    checked={localFilters.offer === false}
                                    onChange={() => handleFilterChange({...localFilters, offer: false})}
                                />
                                Todos
                            </label>
                            <label className="filter-option">
                                <input
                                    type="radio"
                                    name="offer"
                                    value="true"
                                    checked={localFilters.offer === true}
                                    onChange={() => handleFilterChange({...localFilters, offer: true})}
                                />
                                En oferta
                            </label>
                        </div>
                    </div>

                    <button className="clear-all-filters-btn" onClick={handleClearFilters}>
                        <FaTimes /> Limpiar todos los filtros
                    </button>
                </aside>

                {/* ===== PRODUCTOS ===== */}
                <ProductList 
                    products={products}
                    onAddToCart={addToCart}
                    onClearFilters={handleClearFilters}
                />
            </div>
        </div>
    );
}

export default SearchView;