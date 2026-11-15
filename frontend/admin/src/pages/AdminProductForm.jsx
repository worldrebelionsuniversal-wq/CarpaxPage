import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import { adminApi } from '../services/adminApi';

function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        old_price: '',
        type: 'armable',
        capacity: '2',
        color: '',
        weight: '',
        size: '',
        stock: '0',
        offer: false,
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditing) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const product = await adminApi.getProduct(id);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                old_price: product.old_price || '',
                type: product.type || 'armable',
                capacity: product.capacity || '2',
                color: product.color || '',
                weight: product.weight || '',
                size: product.size || '',
                stock: product.stock || '0',
                offer: product.offer || false,
                image_url: product.image_url || ''
            });
        } catch (error) {
            console.error('Error cargando producto:', error);
            alert('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                old_price: formData.old_price ? parseFloat(formData.old_price) : null,
                stock: parseInt(formData.stock),
                weight: formData.weight ? parseFloat(formData.weight) : null,
            };

            if (isEditing) {
                await adminApi.updateProduct(id, data);
            } else {
                await adminApi.createProduct(data);
            }

            navigate('/productos');
        } catch (error) {
            console.error('Error guardando producto:', error);
            alert('Error al guardar el producto');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Cargando producto...
            </div>
        );
    }

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <button onClick={() => navigate('/productos')} className="btn-secondary">
                    <FaArrowLeft /> Volver
                </button>
                <h1 style={{ fontSize: '1.8rem' }}>
                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                border: '1px solid #e0e0e0',
                maxWidth: '800px'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Nombre del producto *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Precio *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="100"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Precio antiguo</label>
                        <input
                            type="number"
                            name="old_price"
                            value={formData.old_price}
                            onChange={handleChange}
                            step="100"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                background: 'white'
                            }}
                        >
                            <option value="armable">Armable</option>
                            <option value="plegable">Plegable</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Capacidad (personas)</label>
                        <select
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                background: 'white'
                            }}
                        >
                            <option value="2">2 personas</option>
                            <option value="4">4 personas</option>
                            <option value="6">6 personas</option>
                            <option value="8">8 personas</option>
                            <option value="8+">8+ personas</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            placeholder="Ej: Blanca, Azul, Roja"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Peso (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            step="0.1"
                            placeholder="Ej: 8.5"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Medida</label>
                        <input
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            placeholder="Ej: 3x3m"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            name="offer"
                            checked={formData.offer}
                            onChange={handleChange}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <label style={{ margin: 0 }}>Producto en oferta</label>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>URL de la imagen</label>
                        <input
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="/images/carpaxxx.webp"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                        {formData.image_url && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <img 
                                    src={formData.image_url}
                                    alt="Vista previa"
                                    style={{ 
                                        maxWidth: '100px', 
                                        maxHeight: '100px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '1.5rem',
                    borderTop: '1px solid #eee',
                    paddingTop: '1.5rem'
                }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        <FaSave /> {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/productos')}
                        className="btn-secondary"
                    >
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminProductForm;