import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { adminApi } from '../services/adminApi';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredProducts(
                products.filter(p => 
                    p.name.toLowerCase().includes(term) || 
                    p.description?.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, products]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await adminApi.deleteProduct(id);
            loadProducts();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            alert('Error al eliminar el producto');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Cargando productos...
            </div>
        );
    }

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h1 style={{ fontSize: '1.8rem' }}>Productos</h1>
                <Link to="/productos/nuevo" className="btn-primary">
                    <FaPlus /> Nuevo Producto
                </Link>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '0.3rem 1rem',
                marginBottom: '1.5rem',
                maxWidth: '400px'
            }}>
                <FaSearch style={{ color: '#888', marginRight: '0.5rem' }} />
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        border: 'none',
                        outline: 'none',
                        padding: '0.6rem 0',
                        flex: 1,
                        fontSize: '0.95rem'
                    }}
                />
            </div>

            <div style={{
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                border: '1px solid #e0e0e0',
                overflow: 'hidden'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.9rem'
                }}>
                    <thead>
                        <tr style={{
                            background: '#f8f9fa',
                            borderBottom: '2px solid #e0e0e0'
                        }}>
                            <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Imagen</th>
                            <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Nombre</th>
                            <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Precio</th>
                            <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Stock</th>
                            <th style={{ padding: '0.8rem 1rem', textAlign: 'left' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                    No hay productos
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product, index) => (
                                <tr key={product.id} style={{
                                    borderBottom: '1px solid #eee',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <td style={{ padding: '0.8rem 1rem' }}>{index + 1}</td>
                                    <td style={{ padding: '0.8rem 1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            background: '#f8f8f8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img 
                                                src={product.image_url || '/images/default.webp'}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '🏕️';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.8rem 1rem', fontWeight: '500' }}>{product.name}</td>
                                    <td style={{ padding: '0.8rem 1rem', fontWeight: '600', color: '#E63946' }}>
                                        {formatPrice(product.price)}
                                    </td>
                                    <td style={{ padding: '0.8rem 1rem' }}>{product.stock || 0}</td>
                                    <td style={{ padding: '0.8rem 1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link 
                                                to={`/productos/editar/${product.id}`}
                                                className="btn-secondary"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Link 
                                                to={`/productos/${product.id}/imagenes`}
                                                className="btn-secondary"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                                            >
                                                <FaEye />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn-danger"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProducts;