const API_URL = '/api';

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
};

export const productService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        });
        const response = await fetch(`${API_URL}/products?${params.toString()}`, config);
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_URL}/products/${id}`, config);
        return handleResponse(response);
    },

    getLatest: async (limit = 8) => {
        const response = await fetch(`${API_URL}/products?limit=${limit}&orderBy=created_at&orderDir=DESC`, config);
        return handleResponse(response);
    },

    getOffers: async () => {
        const response = await fetch(`${API_URL}/products?offer=true`, config);
        return handleResponse(response);
    },

    search: async (query) => {
        return productService.getAll({ search: query });
    },
};

export default productService;