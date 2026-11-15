import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaTruck, FaHandshake, FaShieldAlt, FaFire, FaPlus, FaMinus, FaChevronDown } from 'react-icons/fa';
import '../styles/ProductDetail.css';

function ProductDetail({ addToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    const techSpecsRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/products/${id}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Producto no encontrado en la base de datos');
                    }
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!data || Object.keys(data).length === 0) {
                    throw new Error('Producto vacío');
                }
                
                setProduct(data);
                setSelectedImage(0);

                try {
                    const relatedResponse = await fetch(`/api/products?type=${data.type}&capacity=${data.capacity}`);
                    if (relatedResponse.ok) {
                        const relatedData = await relatedResponse.json();
                        const filtered = relatedData.filter(p => p.id !== data.id).slice(0, 4);
                        setRelatedProducts(filtered);
                    }
                } catch (relatedError) {
                    setRelatedProducts([
                        { id: 1, name: 'Carpa Armable Blanca 3x3', price: 289900, image_url: '/images/carpasArmables/3x3blanca/1.webp' },
                        { id: 2, name: 'Carpa Armable Verde 3x3', price: 269900, image_url: '/images/carpasArmables/3x3verde/1.webp' },
                        { id: 3, name: 'Carpa Armable Azul 3x3', price: 279900, image_url: '/images/carpasArmables/3x3azul/1.webp' },
                        { id: 4, name: 'Carpa Plegable Azul 2x2', price: 280000, image_url: '/images/carpasPlegables/2x2azul/1.webp' }
                    ]);
                }
            } catch (err) {
                console.error('❌ Error cargando producto:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProduct();
        } else {
            setError('ID de producto no proporcionado');
            setLoading(false);
        }
    }, [id]);


    const scrollToTechSpecs = () => {
        if (techSpecsRef.current) {
            const element = techSpecsRef.current;
            const headerOffset = 100; // Ajusta este valor según necesites
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const getProductImages = () => {
        if (!product) return [];
        
        let images = [];
        
        if (product.images && product.images.length > 0) {
            images = product.images;
        } else if (product.image_url) {
            images = [product.image_url];
        } else {
            return [];
        }
        
        return images;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        alert(`✅ Agregado ${quantity} ${product.name} al carrito`);
    };

    const increaseQuantity = () => {
        if (quantity < (product?.stock || 10)) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleRelatedProductClick = (productId) => {
        navigate(`/producto/${productId}`);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏕️</div>
                    <p>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="detail-not-found">
                <h2>❌ Producto no encontrado</h2>
                <p>{error || 'Lo sentimos, no pudimos encontrar el producto que buscas.'}</p>
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                    ID solicitado: {id}
                </p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Volver al inicio
                </button>
            </div>
        );
    }

    const productImages = getProductImages();

    return (
        <div className="detail-container">
            <button className="detail-back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Volver
            </button>

            {/* ===== SECCIÓN PRINCIPAL: IMAGEN + INFORMACIÓN ===== */}
            <div className="detail-main">
                <div className="detail-image-wrapper">
                    <div className="detail-thumbnails-vertical">
                        {productImages.map((img, index) => (
                            <div
                                key={index}
                                className={`detail-thumbnail-vertical ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img 
                                    src={img}
                                    alt={`${product.name} - vista ${index + 1}`}
                                />
                                <span className="thumbnail-number">{index + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="detail-image-main">
                        {productImages[selectedImage] ? (
                            <img 
                                src={productImages[selectedImage]}
                                alt={product.name}
                                className="detail-product-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '🏕️';
                                }}
                            />
                        ) : (
                            <span className="detail-emoji">{product.icon || '🏕️'}</span>
                        )}
                    </div>
                </div>

                <div className="detail-info-col">
                    <h1 className="detail-title">{product.name}</h1>
                    
                    <div className="detail-prices">
                        <span className="detail-current-price">{formatPrice(product.price)}</span>
                        {product.old_price && (
                            <span className="detail-old-price">{formatPrice(product.old_price)}</span>
                        )}
                    </div>

                    <div className="detail-specs-list">
                        <div className="detail-spec-row">
                            <span className="detail-spec-label">Capacidad:</span>
                            <span className="detail-spec-value">{product.capacity} personas</span>
                        </div>
                        <div className="detail-spec-row">
                            <span className="detail-spec-label">Tipo:</span>
                            <span className="detail-spec-value">{product.type}</span>
                        </div>
                        {product.color && (
                            <div className="detail-spec-row">
                                <span className="detail-spec-label">Color:</span>
                                <span className="detail-spec-value">{product.color}</span>
                            </div>
                        )}
                        {product.weight && (
                            <div className="detail-spec-row">
                                <span className="detail-spec-label">Peso:</span>
                                <span className="detail-spec-value">{product.weight} kg</span>
                            </div>
                        )}
                        {product.size && (
                            <div className="detail-spec-row">
                                <span className="detail-spec-label">Medida:</span>
                                <span className="detail-spec-value">{product.size}</span>
                            </div>
                        )}
                        
                        <button 
                            className="specs-view-more"
                            onClick={scrollToTechSpecs}
                        >
                            Ver más características <FaChevronDown />
                        </button>
                    </div>

                    <div className="detail-quantity">
                        <span className="quantity-label">Cantidad:</span>
                        <div className="quantity-selector">
                            <button className="qty-btn" onClick={decreaseQuantity}>
                                <FaMinus />
                            </button>
                            <span className="qty-number">{quantity}</span>
                            <button className="qty-btn" onClick={increaseQuantity}>
                                <FaPlus />
                            </button>
                        </div>
                        <span className="stock-info">({product.stock || 0} disponibles)</span>
                    </div>

                    <button 
                        className="detail-add-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        <FaShoppingCart /> Agregar al carrito
                    </button>

                    <div className="detail-benefits-compact">
                        <span><FaTruck /> Envío gratis</span>
                        <span><FaHandshake /> Pago contraentrega</span>
                        <span><FaShieldAlt /> Garantía de entrega</span>
                    </div>

                    <div className="detail-kombo-compact">
                        <FaFire className="kombo-icon" />
                        <span>Compra más de una unidad y recibe un super descuento</span>
                    </div>
                </div>
            </div>

            {/* ===== SECCIÓN FICHA TÉCNICA + DESCRIPCIÓN ===== */}
            <div className="tech-specs-section" ref={techSpecsRef}>
                <div className="tech-specs-header">
                    <h3 className="tech-specs-title">Ficha Técnica</h3>
                    <h3 className="tech-specs-title-right">Descripción del producto</h3>
                </div>
                <div className="tech-specs-container">
                    <div className="tech-specs-left">
                        <div className="tech-spec-item">
                            <span className="tech-label">Capacidad</span>
                            <span className="tech-value">{product.capacity} personas</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="tech-label">Tipo</span>
                            <span className="tech-value">{product.type}</span>
                        </div>
                        {product.color && (
                            <div className="tech-spec-item">
                                <span className="tech-label">Color</span>
                                <span className="tech-value">{product.color}</span>
                            </div>
                        )}
                        {product.weight && (
                            <div className="tech-spec-item">
                                <span className="tech-label">Peso</span>
                                <span className="tech-value">{product.weight} kg</span>
                            </div>
                        )}
                        {product.size && (
                            <div className="tech-spec-item">
                                <span className="tech-label">Medida</span>
                                <span className="tech-value">{product.size}</span>
                            </div>
                        )}
                        <div className="tech-spec-item">
                            <span className="tech-label">Stock</span>
                            <span className="tech-value">{product.stock} unidades</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="tech-label">Material</span>
                            <span className="tech-value">Poliéster resistente</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="tech-label">Impermeable</span>
                            <span className="tech-value">Sí</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="tech-label">Protección UV</span>
                            <span className="tech-value">Sí</span>
                        </div>
                        <div className="tech-spec-item">
                            <span className="tech-label">Armado</span>
                            <span className="tech-value">Fácil y rápido</span>
                        </div>
                    </div>

                    <div className="tech-specs-right">
                        <div className="tech-description-box">
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== SECCIÓN PRODUCTOS RELACIONADOS ===== */}
            <div className="related-products-section">
                <h3 className="related-products-title">Productos que te pueden interesar</h3>
                {relatedProducts.length > 0 ? (
                    <div className="related-products-grid">
                        {relatedProducts.map((related) => (
                            <div 
                                key={related.id} 
                                className="related-product-card"
                                onClick={() => handleRelatedProductClick(related.id)}
                            >
                                <div className="related-product-image">
                                    {related.image_url ? (
                                        <img 
                                            src={related.image_url} 
                                            alt={related.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '🏕️';
                                            }}
                                        />
                                    ) : (
                                        <span>🏕️</span>
                                    )}
                                </div>
                                <div className="related-product-info">
                                    <h4 className="related-product-name">{related.name}</h4>
                                    <div className="related-product-price">{formatPrice(related.price)}</div>
                                    <button 
                                        className="related-product-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRelatedProductClick(related.id);
                                        }}
                                    >
                                        Ver producto
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="related-products-empty">No hay productos relacionados disponibles</p>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;