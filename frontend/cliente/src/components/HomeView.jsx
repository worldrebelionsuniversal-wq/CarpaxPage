import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUmbrellaBeach, FaCogs, FaTools, FaTruck } from 'react-icons/fa';
import { useProducts } from '../hooks/useProducts';
import '../styles/HomeView.css';

const categories = [
    { id: 'plegable', name: 'Carpas Plegables', icon: <FaUmbrellaBeach /> },
    { id: 'armable', name: 'Carpas Armables', icon: <FaCogs /> },
    { id: 'repuesto', name: 'Repuestos', icon: <FaTools /> }
];

// ===== SLIDES CON IMÁGENES =====
const infoSlides = [
    {
        image: '/images/banners/banner-ofertas.png',
        title: 'OFERTAS ESPECIALES',
        subtitle: 'Hasta 40% de descuento',
        color: '#dc143c'
    },
    {
        image: '/images/banners/banner-descuento.png',
        title: 'COMPRA EN KOMBO',
        subtitle: 'Ahorra comprando más de una unidad',
        color: '#e67e22'
    },
];

function HomeView() {
    const navigate = useNavigate();
    const { loading, error } = useProducts();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentSlide((prev) => (prev + 1) % infoSlides.length);
                setTimeout(() => setIsTransitioning(false), 500);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [isTransitioning]);

    const handleDotClick = (index) => {
        if (index !== currentSlide && !isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide(index);
            setTimeout(() => setIsTransitioning(false), 500);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/buscar?type=${categoryId}`);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏕️</div>
                    <p>Cargando...</p>
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
        <div className="home-layout">
            <section className="hero-horizontal">
                {/* ===== CATEGORÍAS ===== */}
                <div className="hero-inner">
                    <div className="hero-categories">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className="category-circle"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <span className="category-circle-icon">
                                    {category.icon}
                                </span>
                                <span className="category-circle-name">
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ===== BANNER DE ENVÍO ===== */}
                <div className="hero-shipping">
                    <div className="shipping-inner">
                        <FaTruck className="shipping-icon" />
                        <span className="shipping-text">
                            ENVÍO GRATIS PARA BOGOTÁ
                        </span>
                    </div>
                </div>

                {/* ===== CARRUSEL ===== */}
                <div className="hero-slider-horizontal" ref={sliderRef}>
                    <div
                        className="slider-track"
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                            transition: 'transform 0.5s ease-in-out'
                        }}
                    >
                        {infoSlides.map((slide, index) => (
                            <div key={index} className="slider-slide">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="slider-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div
                                    className="slider-overlay"
                                    style={{ borderLeftColor: slide.color }}
                                >
                                    <h3 className="slider-title">{slide.title}</h3>
                                    <p className="slider-subtitle">{slide.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="slider-dots">
                        {infoSlides.map((_, index) => (
                            <span
                                key={index}
                                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomeView;