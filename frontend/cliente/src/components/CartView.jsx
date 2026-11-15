import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaShoppingCart, FaTrash, FaPlus, FaMinus, 
    FaArrowLeft, FaTruck, FaHandshake, FaShieldAlt,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useCartContext } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';
import '../styles/CartView.css';

// ===== CONFIGURACIÓN =====
const WHATSAPP_NUMBER = '573022160778'; // 👈 CAMBIA POR TU NÚMERO

function CartView() {
    const { 
        cart, 
        removeFromCart, 
        updateQuantity, 
        addToCart,
        getTotalItems, 
        getTotalPrice 
    } = useCartContext();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedIndex, setRelatedIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadRelatedProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    const cartIds = cart.map(item => item.id);
                    const filtered = data.filter(p => !cartIds.includes(p.id));
                    setRelatedProducts(filtered);
                }
            } catch (error) {
                console.log('Error cargando productos relacionados:', error);
            }
        };
        loadRelatedProducts();

        const updateItemsPerPage = () => {
            if (window.innerWidth < 480) setItemsPerPage(2);
            else if (window.innerWidth < 768) setItemsPerPage(2);
            else if (window.innerWidth < 1024) setItemsPerPage(3);
            else setItemsPerPage(4);
        };
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, [cart]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(itemId, newQuantity);
    };

    const handlePrevRelated = () => {
        setRelatedIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextRelated = () => {
        const maxIndex = Math.max(0, relatedProducts.length - itemsPerPage);
        setRelatedIndex(prev => Math.min(maxIndex, prev + 1));
    };

    const handleAddRelatedToCart = (product) => {
        addToCart(product);
        setRelatedProducts(prev => prev.filter(p => p.id !== product.id));
        if (relatedIndex >= relatedProducts.length - 1) {
            setRelatedIndex(prev => Math.max(0, prev - 1));
        }
    };

    // ===== FUNCIÓN QUE SE EJECUTA CUANDO EL CLIENTE CONFIRMA EL PEDIDO =====
    const handleConfirmOrder = (formData) => {
        // 1. Construir mensaje para WhatsApp
        const productList = cart.map(item => 
            `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`
        ).join('\n');

        const message = 
`🏕️ *NUEVO PEDIDO*

👤 *Cliente:* ${formData.nombre}
📍 *Dirección:* ${formData.direccion}
📱 *Teléfono:* ${formData.telefono}

📦 *Productos:*
${productList}

💰 *Total: ${formatPrice(totalPrice)}*

📋 *Instrucciones adicionales:* ${formData.instrucciones || 'Ninguna'}

✅ *Forma de pago:* Contraentrega (pago al recibir)

¡Gracias por tu compra! 🏕️`;

        // 2. Abrir WhatsApp con el mensaje
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    const visibleProducts = relatedProducts.slice(relatedIndex, relatedIndex + itemsPerPage);

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <FaShoppingCart className="cart-empty-icon" />
                <h2>Tu carrito está vacío</h2>
                <p>¡Explora nuestras carpas y encuentra la perfecta para ti!</p>
                <Link to="/" className="btn-primary">
                    <FaArrowLeft /> Seguir comprando
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-content">
                {/* ===== COLUMNA IZQUIERDA ===== */}
                <div className="cart-items-wrapper">
                    <h2 className="cart-title">Mi Carrito</h2>

                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    {item.image_url ? (
                                        <img 
                                            src={item.image_url}
                                            alt={item.name}
                                        />
                                    ) : (
                                        <span className="cart-item-emoji">{item.icon || '🏕️'}</span>
                                    )}
                                </div>

                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                                    {item.old_price && (
                                        <span className="cart-item-old-price">{formatPrice(item.old_price)}</span>
                                    )}
                                </div>

                                <div className="cart-item-quantity">
                                    <button 
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="qty-number">{item.quantity}</span>
                                    <button 
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <div className="cart-item-subtotal">
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>

                                <button 
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="Eliminar producto"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ===== DIVISOR GRIS ===== */}
                    <div className="cart-divider"></div>

                    {/* ===== PRODUCTOS RELACIONADOS ===== */}
                    {relatedProducts.length > 0 && (
                        <div className="related-products-wrapper">
                            <h3 className="related-products-title">Productos que te pueden interesar</h3>
                            <div className="related-products-carousel">
                                <button 
                                    className="related-arrow related-arrow-left"
                                    onClick={handlePrevRelated}
                                    disabled={relatedIndex === 0}
                                >
                                    <FaChevronLeft />
                                </button>
                                
                                <div className="related-products-grid">
                                    {visibleProducts.map((product) => (
                                        <div 
                                            key={product.id} 
                                            className="related-product-card"
                                        >
                                            <div className="related-product-image">
                                                {product.image_url ? (
                                                    <img 
                                                        src={product.image_url} 
                                                        alt={product.name}
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
                                                <h4 className="related-product-name">{product.name}</h4>
                                                <div className="related-product-price">{formatPrice(product.price)}</div>
                                                <button 
                                                    className="related-product-btn"
                                                    onClick={() => handleAddRelatedToCart(product)}
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    className="related-arrow related-arrow-right"
                                    onClick={handleNextRelated}
                                    disabled={relatedIndex >= relatedProducts.length - itemsPerPage}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== COLUMNA DERECHA - RESUMEN ===== */}
                <div className="cart-summary">
                    <div className="cart-summary-inner">
                        <h3>Resumen del pedido</h3>
                        
                        <div className="summary-row">
                            <span>Productos ({totalItems})</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Envío</span>
                            <span className="summary-free">Gratis</span>
                        </div>
                        <div className="summary-row">
                            <span>Descuento</span>
                            <span>$0</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>

                        <div className="summary-benefits">
                            <div className="benefit-item">
                                <FaTruck /> Envío gratis
                            </div>
                            <div className="benefit-item">
                                <FaHandshake /> Pago contraentrega
                            </div>
                            <div className="benefit-item">
                                <FaShieldAlt /> Garantía de entrega
                            </div>
                        </div>
                    </div>

                    <button className="checkout-btn" onClick={() => setIsModalOpen(true)}>
                        SOLICITAR ENVÍO
                    </button>

                    <Link to="/" className="continue-shopping">
                        <FaArrowLeft /> Seguir comprando
                    </Link>
                </div>
            </div>

            {/* ===== MODAL DE CONFIRMACIÓN ===== */}
            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cart={cart}
                totalPrice={totalPrice}
                formatPrice={formatPrice}
                onConfirm={handleConfirmOrder}
            />
        </div>
    );
}

export default CartView;