import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaStar } from 'react-icons/fa';
import { adminApi } from '../services/adminApi';

function AdminImages() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Cargar producto
            const productData = await adminApi.getProduct(id);
            setProduct(productData);
            
            // Cargar imágenes
            const imagesData = await adminApi.getProductImages(id);
            setImages(imagesData);
            
            console.log('📦 Producto:', productData);
            console.log('🖼️ Imágenes:', imagesData);
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            setError(error.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = async () => {
        if (!newImageUrl.trim()) {
            alert('Ingresa una URL de imagen');
            return;
        }

        setSaving(true);
        try {
            await adminApi.addImage(id, {
                image_url: newImageUrl,
                is_primary: images.length === 0,
                sort_order: images.length
            });
            setNewImageUrl('');
            loadData();
        } catch (error) {
            console.error('❌ Error agregando imagen:', error);
            alert('Error al agregar la imagen');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

        try {
            await adminApi.deleteImage(imageId);
            loadData();
        } catch (error) {
            console.error('❌ Error eliminando imagen:', error);
            alert('Error al eliminar la imagen');
        }
    };

    const handleSetPrimary = async (imageId) => {
        try {
            await adminApi.setPrimaryImage(imageId, id);
            loadData();
        } catch (error) {
            console.error('❌ Error estableciendo imagen principal:', error);
            alert('Error al establecer imagen principal');
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Cargando imágenes...
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
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                    Imágenes de {product?.name || 'Producto'}
                </h1>
            </div>

            {error && (
                <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '0.8rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    border: '1px solid #f5c6cb'
                }}>
                    ❌ {error}
                </div>
            )}

            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #e0e0e0',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Agregar nueva imagen</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="/images/nueva-imagen.webp"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.7rem 1rem',
                            border: '1px solid #d0d0d0',
                            borderRadius: '6px',
                            fontSize: '1rem'
                        }}
                    />
                    <button 
                        onClick={handleAddImage}
                        className="btn-primary"
                        disabled={saving}
                    >
                        <FaPlus /> Agregar
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1.5rem'
            }}>
                {images.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', color: '#888', textAlign: 'center', padding: '2rem' }}>
                        No hay imágenes para este producto
                    </p>
                ) : (
                    images.map((image) => (
                        <div key={image.id} style={{
                            background: 'white',
                            borderRadius: '8px',
                            border: image.is_primary ? '2px solid #1a1a1a' : '1px solid #e0e0e0',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '180px',
                                background: '#f8f8f8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                <img 
                                    src={image.image_url}
                                    alt="Producto"
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '🏕️';
                                    }}
                                />
                                {image.is_primary && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: '#1a1a1a',
                                        color: 'white',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700'
                                    }}>
                                        Principal
                                    </div>
                                )}
                            </div>
                            <div style={{
                                padding: '0.8rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                    #{image.sort_order + 1}
                                </span>
                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                    {!image.is_primary && (
                                        <button
                                            onClick={() => handleSetPrimary(image.id)}
                                            className="btn-secondary"
                                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}
                                            title="Establecer como principal"
                                        >
                                            <FaStar />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteImage(image.id)}
                                        className="btn-danger"
                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}
                                        title="Eliminar imagen"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminImages;