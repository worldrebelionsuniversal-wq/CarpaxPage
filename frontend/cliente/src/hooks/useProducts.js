import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const loadProducts = useCallback(async (newFilters = null) => {
        const currentFilters = newFilters || filters;
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getAll(currentFilters);
            setProducts(data);
            setFilteredProducts(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Error cargando productos:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const applyFilters = useCallback(async (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        return loadProducts({ ...filters, ...newFilters });
    }, [filters, loadProducts]);

    const searchProducts = useCallback(async (query) => {
        return applyFilters({ search: query });
    }, [applyFilters]);

    const getProductById = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const product = await productService.getById(id);
            return product;
        } catch (err) {
            setError(err.message);
            console.error('Error cargando producto:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getLatest = useCallback(async (limit = 8) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getLatest(limit);
            setProducts(data);
            setFilteredProducts(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Error cargando últimos productos:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const clearFilters = useCallback(async () => {
        setFilters({});
        return loadProducts({});
    }, [loadProducts]);

    useEffect(() => {
        loadProducts();
    }, []);

    return {
        products,
        filteredProducts,
        loading,
        error,
        filters,
        loadProducts,
        applyFilters,
        searchProducts,
        getProductById,
        getLatest,
        clearFilters,
        setFilters,
    };
};

export default useProducts;