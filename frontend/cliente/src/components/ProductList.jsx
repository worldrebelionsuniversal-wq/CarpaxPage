import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaStar, FaStarHalfAlt, FaShoppingCart, 
    FaFire, FaTruck, FaHandshake, FaShieldAlt
} from 'react-icons/fa';
import '../styles/ProductList.css';

function ProductList({ products, onAddToCart, onClearFilters }) {
    const navigate = useNavigate();
    const [addedProducts, setAddedProducts] = useState({});
    const [imageErrors, setImageErrors] = useState({});

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);
        
        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} className="star-filled" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="star-filled" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaStar key={`empty-${i}`} className="star-empty" />
                ))}
            </>
        );
    };

    const calculateDiscount = (price, oldPrice) => {
        if (!oldPrice) return 0;
        return Math.round(((oldPrice - price) / oldPrice) * 100);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleProductClick = (productId) => {
        navigate(`/producto/${productId}`);
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        onAddToCart(product);
        setAddedProducts({ ...addedProducts, [product.id]: true });
        setTimeout(() => {
            setAddedProducts({ ...addedProducts, [product.id]: false });
        }, 2000);
    };

    const getSpecs = (product) => {
        const specs = [
            { label: 'Capacidad', value: `${product.capacity} personas` },
            { label: 'Tipo', value: product.type },
            { label: 'Stock', value: `${product.stock} unidades` },
        ];
        
        if (product.color) specs.push({ label: 'Color', value: product.color });
        if (product.weight) specs.push({ label: 'Peso', value: `${product.weight} kg` });
        if (product.size) specs.push({ label: 'Medida', value: product.size });
        if (product.old_price) {
            specs.push({ 
                label: 'Ahorro', 
                value: `$${(product.old_price - product.price).toLocaleString()}`,
                isDiscount: true 
            });
        }
        
        return specs.slice(0, 4);
    };

    if (!products || products.length === 0) {
        return (
            <div className="empty-state">
                <p>No encontramos carpas con esos filtros.</p>
                <button className="btn-primary" onClick={onClearFilters}>
                    Limpiar filtros
                </button>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            {products.map(product => {
                const discount = calculateDiscount(product.price, product.old_price);
                const isAdded = addedProducts[product.id];
                const specs = getSpecs(product);
                const hasImageError = imageErrors[product.id];

                return (
                    <div 
                        key={product.id} 
                        className="product-card"
                        onClick={() => handleProductClick(product.id)}
                    >
                        {/* ===== FILA 1: TÍTULO + RATING ===== */}
                        <div className="product-row-title">
                            <h3 className="product-title">{product.name}</h3>
                            <div className="product-rating">
                                {renderStars(parseFloat(product.rating))}
                                <span className="rating-text">
                                    {product.rating} ({product.reviews || Math.floor(Math.random() * 20) + 5})
                                </span>
                            </div>
                        </div>

                        {/* ===== FILA 2: 3 COLUMNAS ===== */}
                        <div className="product-row-columns">
                            
                            {/* ===== COLUMNA 1: IMAGEN ===== */}
                            <div className="product-col col-1">
                                <div className="product-image-wrapper">
                                    {!hasImageError && product.image_url ? (
                                        <img 
                                            src={product.image_url}
                                            alt={product.name}
                                            className="product-image"
                                            onError={() => handleImageError(product.id)}
                                        />
                                    ) : (
                                        <span className="product-emoji">{product.icon || '🏕️'}</span>
                                    )}
                                </div>
                            </div>

                            {/* ===== COLUMNA 2: ESPECIFICACIONES ===== */}
                            <div className="product-col col-2">
                                {specs.map((spec, index) => (
                                    <div key={index} className="spec-item">
                                        <span className="spec-label">{spec.label}</span>
                                        <span className={`spec-value ${spec.isDiscount ? 'discount' : ''}`}>
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ===== COLUMNA 3: ACCIONES ===== */}
                            <div className="product-col col-3">
                                <div className="product-prices">
                                    <span className="current-price">{formatPrice(product.price)}</span>
                                    {product.old_price && (
                                        <span className="old-price">{formatPrice(product.old_price)}</span>
                                    )}
                                    {discount > 0 && (
                                        <span className="discount-badge">-{discount}%</span>
                                    )}
                                </div>

                                <div className="product-benefits">
                                    <span><FaTruck /> Envío gratis</span>
                                    <span><FaHandshake /> Pago contraentrega</span>
                                    <span><FaShieldAlt /> Garantía</span>
                                </div>

                                <div className="product-kombo">
                                    <FaFire />
                                    <span>Compra más de una unidad y recibe super descuento</span>
                                    <a href="#" onClick={(e) => e.stopPropagation()}>Ver más</a>
                                </div>

                                <button 
                                    className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
                                    onClick={(e) => handleAddToCart(product, e)}
                                >
                                    <FaShoppingCart />
                                    {isAdded ? 'Agregado ✓' : 'Agregar'}
                                </button>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ProductList;