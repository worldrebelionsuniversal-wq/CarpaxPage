import React, { useState } from 'react';
import { FaTimes, FaWhatsapp, FaUser, FaMapMarkerAlt, FaHome, FaBuilding, FaTruck, FaShieldAlt, FaHandshake } from 'react-icons/fa';
import '../styles/CheckoutModal.css';

function CheckoutModal({ isOpen, onClose, cart, totalPrice, formatPrice }) {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        tipoVivienda: '',
        nombreConjunto: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const WHATSAPP_NUMBER = '573022160778';

    const getProductImageUrl = (product) => {
        // Usar el enlace de Google Drive como ejemplo
        return 'https://drive.google.com/file/d/16OxV1lJ4f2IQqIWAGkS5K3SA4LPomofF/view?usp=sharing';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.telefono || !formData.direccion || !formData.tipoVivienda) {
            alert('⚠️ Por favor, completa todos los campos obligatorios.');
            return;
        }

        if (formData.tipoVivienda === 'conjunto' && !formData.nombreConjunto) {
            alert('⚠️ Por favor, escribe el nombre del conjunto.');
            return;
        }

        setIsSubmitting(true);
        
        let tipoViviendaTexto = formData.tipoVivienda === 'casa' ? 'Casa' : '';
        if (formData.tipoVivienda === 'conjunto') {
            tipoViviendaTexto = formData.nombreConjunto || 'Conjunto';
        }

        const productList = cart.map(item => {
            const imageUrl = getProductImageUrl(item);
            return `. Producto: ${item.name}\n. Cantidad: ${item.quantity}\n. Precio unitario: ${formatPrice(item.price)}\n. Imagen: ${imageUrl}`;
        }).join('\n\n');

        const message = 
`*>>NUEVO PEDIDO DE CARPA<<*

📋 *DATOS:*

. Cliente: ${formData.nombre}
. Direccion: ${formData.direccion}
. Contacto: ${formData.telefono}
. Tipo: ${tipoViviendaTexto}
. Pago: Contraentrega

📦 *PRODUCTOS:*

${productList}

Presiona enviar`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`, '_blank');
        
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirmar Pedido</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-left">
                        <div className="mensaje-box">
                            <div className="mensaje-icon">
                                <FaWhatsapp />
                            </div>
                            <h3>¡Hola!</h3>
                            <p className="mensaje-texto">
                                Ingresa tus datos y espera pronta confirmación de hora y fecha de entrega.
                            </p>
                            <p className="mensaje-texto">
                                En un momento te atenderemos.
                            </p>
                            
                            <div className="mensaje-beneficios">
                                <div className="mensaje-beneficio">
                                    <FaTruck />
                                    <span>Envío gratis</span>
                                </div>
                                <div className="mensaje-beneficio">
                                    <FaHandshake />
                                    <span>Pago contraentrega</span>
                                </div>
                                <div className="mensaje-beneficio">
                                    <FaShieldAlt />
                                    <span>Garantía de entrega</span>
                                </div>
                            </div>

                            <div className="mensaje-footer">
                                <p>¡Gracias por tu compra! 🏕️</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-right">
                        <form className="modal-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    <FaUser className="form-icon" />
                                    Nombre completo <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaWhatsapp className="form-icon" />
                                    Contacto <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    placeholder="Ej: 3001234567"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaMapMarkerAlt className="form-icon" />
                                    Dirección de entrega <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Ej: Calle 123 #45-67"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <FaHome className="form-icon" />
                                    Tipo de vivienda <span className="required">*</span>
                                </label>
                                <select
                                    name="tipoVivienda"
                                    value={formData.tipoVivienda}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="casa">Casa</option>
                                    <option value="conjunto">Conjunto</option>
                                </select>
                            </div>

                            {formData.tipoVivienda === 'conjunto' && (
                                <div className="form-group form-group-conjunto">
                                    <label>
                                        <FaBuilding className="form-icon" />
                                        Nombre del conjunto <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreConjunto"
                                        placeholder="Ej: Torres del Parque"
                                        value={formData.nombreConjunto}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-confirm" disabled={isSubmitting}>
                                    <FaWhatsapp />
                                    {isSubmitting ? 'Enviando...' : 'Confirmar pedido'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;