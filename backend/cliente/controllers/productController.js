// backend/cliente/controllers/productController.js
const ProductModel = require('../models/productModel');

// ============================================
// OBTENER PRODUCTOS CON FILTROS
// ============================================
exports.getProducts = async (req, res) => {
    try {
        const { 
            type, capacity, color, weight, size, 
            search, min_price, max_price,
            orderBy, orderDir,
            limit, offset 
        } = req.query;
        
        const filters = { 
            type, capacity, color, weight, size, 
            search, min_price, max_price,
            orderBy, orderDir,
            limit, offset 
        };
        
        const products = await ProductModel.findAll(filters);
        
        // Obtener imágenes para cada producto
        const productsWithImages = await Promise.all(
            products.map(async (product) => {
                const images = await ProductModel.getImages(product.id);
                return { ...product, images };
            })
        );
        
        res.json(productsWithImages);
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// ============================================
// OBTENER PRODUCTO POR ID
// ============================================
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Obtener imágenes del producto
        const images = await ProductModel.getImages(product.id);
        
        // Obtener productos relacionados
        const related = await ProductModel.findRelated(product.id, product.type);
        
        res.json({ 
            ...product, 
            images,
            related 
        });
    } catch (error) {
        console.error('❌ Error al obtener producto:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

// ============================================
// OBTENER PRODUCTOS POR CATEGORÍA
// ============================================
exports.getByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await ProductModel.findByCategory(category);
        
        const productsWithImages = await Promise.all(
            products.map(async (product) => {
                const images = await ProductModel.getImages(product.id);
                return { ...product, images };
            })
        );
        
        res.json(productsWithImages);
    } catch (error) {
        console.error('❌ Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// ============================================
// OBTENER PRODUCTOS EN OFERTA
// ============================================
exports.getOffers = async (req, res) => {
    try {
        const products = await ProductModel.findOffers();
        
        const productsWithImages = await Promise.all(
            products.map(async (product) => {
                const images = await ProductModel.getImages(product.id);
                return { ...product, images };
            })
        );
        
        res.json(productsWithImages);
    } catch (error) {
        console.error('❌ Error al obtener productos en oferta:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// ============================================
// OBTENER ÚLTIMOS PRODUCTOS
// ============================================
exports.getLatest = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        const products = await ProductModel.findLatest(parseInt(limit));
        
        const productsWithImages = await Promise.all(
            products.map(async (product) => {
                const images = await ProductModel.getImages(product.id);
                return { ...product, images };
            })
        );
        
        res.json(productsWithImages);
    } catch (error) {
        console.error('❌ Error al obtener últimos productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// ============================================
// OBTENER ESTADÍSTICAS
// ============================================
exports.getStats = async (req, res) => {
    try {
        const stats = await ProductModel.getStats();
        res.json(stats);
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};