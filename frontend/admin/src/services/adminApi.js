const API_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

export const adminApi = {
    // ===== PRODUCTOS =====
    getProducts: async () => {
        const response = await fetch(`${API_URL}/admin/products`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    getProduct: async (id) => {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    createProduct: async (data) => {
        const response = await fetch(`${API_URL}/admin/products`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updateProduct: async (id, data) => {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    deleteProduct: async (id) => {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    // ===== IMÁGENES =====
    getProductImages: async (productId) => {
        const response = await fetch(`${API_URL}/admin/products/${productId}/images`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    addImage: async (productId, imageData) => {
        const response = await fetch(`${API_URL}/admin/products/${productId}/images`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(imageData),
        });
        return handleResponse(response);
    },

    deleteImage: async (imageId) => {
        const response = await fetch(`${API_URL}/admin/images/${imageId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    setPrimaryImage: async (imageId, productId) => {
        const response = await fetch(`${API_URL}/admin/images/${imageId}/primary`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ product_id: productId }),
        });
        return handleResponse(response);
    },
};