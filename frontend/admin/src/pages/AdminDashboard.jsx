import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import { adminApi } from '../services/adminApi';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const products = await adminApi.getProducts();
                setStats({
                    totalProducts: products.length || 0,
                    totalOrders: 0,
                    totalUsers: 0,
                    totalRevenue: 0
                });
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const cards = [
        { title: 'Productos', value: stats.totalProducts, icon: <FaBox />, color: '#1a1a1a' },
        { title: 'Pedidos', value: stats.totalOrders, icon: <FaShoppingCart />, color: '#333333' },
        { title: 'Usuarios', value: stats.totalUsers, icon: <FaUsers />, color: '#555555' },
        { title: 'Ventas', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign />, color: '#1a1a1a' },
    ];

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Cargando estadísticas...
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1a1a' }}>
                Dashboard
            </h1>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {cards.map((card, index) => (
                    <div key={index} style={{
                        background: 'white',
                        padding: '1.2rem 1.5rem',
                        borderRadius: '10px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {card.title}
                                </p>
                                <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a1a' }}>
                                    {card.value}
                                </p>
                            </div>
                            <div style={{
                                background: card.color,
                                color: 'white',
                                padding: '0.6rem',
                                borderRadius: '8px',
                                fontSize: '1.3rem',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;