// backend/admin/controllers/adminController.js
const ProductModel = require('../models/productModel');
const ProductImageModel = require('../models/productImageModel');
const UserModel = require('../models/userModel');

// ============================================
// PRODUCTOS
// ============================================

// ===== OBTENER TODOS LOS PRODUCTOS =====
exports.getProducts = async (req, res) => {
    try {
        const { type, capacity, search, limit, offset } = req.query;
        const products = await ProductModel.findAll({ type, capacity, search, limit, offset });
        
        // Obtener imágenes para cada producto
        const productsWithImages = await Promise.all(
            products.map(async (product) => {
                const images = await ProductImageModel.findByProduct(product.id);
                return { ...product, images };
            })
        );
        
        res.json(productsWithImages);
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// ===== CREAR PRODUCTO =====
exports.createProduct = async (req, res) => {
    try {
        const product = await ProductModel.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// ===== ACTUALIZAR PRODUCTO =====
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.update(id, req.body);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// ===== ELIMINAR PRODUCTO =====
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.delete(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

// ============================================
// IMÁGENES
// ============================================

// ===== OBTENER IMÁGENES DE UN PRODUCTO =====
exports.getProductImages = async (req, res) => {
    try {
        const { productId } = req.params;
        const images = await ProductImageModel.findByProduct(productId);
        res.json(images);
    } catch (error) {
        console.error('❌ Error al obtener imágenes:', error);
        res.status(500).json({ error: 'Error al obtener imágenes' });
    }
};

// ===== AGREGAR IMAGEN =====
exports.addImage = async (req, res) => {
    try {
        const { productId } = req.params;
        const { image_url, is_primary, sort_order } = req.body;
        
        const image = await ProductImageModel.create(productId, image_url, is_primary, sort_order);
        res.status(201).json(image);
    } catch (error) {
        console.error('❌ Error al agregar imagen:', error);
        res.status(500).json({ error: 'Error al agregar imagen' });
    }
};

// ===== ELIMINAR IMAGEN =====
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await ProductImageModel.delete(id);
        
        if (!image) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }
        
        res.json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar imagen:', error);
        res.status(500).json({ error: 'Error al eliminar imagen' });
    }
};

// ===== ESTABLECER IMAGEN PRINCIPAL =====
exports.setPrimaryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id } = req.body;
        
        await ProductImageModel.setPrimary(product_id, id);
        res.json({ message: 'Imagen principal actualizada' });
    } catch (error) {
        console.error('❌ Error al actualizar imagen principal:', error);
        res.status(500).json({ error: 'Error al actualizar imagen principal' });
    }
};

// ============================================
// USUARIOS
// ============================================

// ===== OBTENER TODOS LOS USUARIOS =====
exports.getUsers = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const users = await UserModel.findAll(limit, offset);
        res.json(users);
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// ===== OBTENER USUARIO POR ID =====
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('❌ Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

// ===== CREAR USUARIO =====
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, is_admin } = req.body;
        
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        
        const user = await UserModel.create(name, email, password, is_admin);
        res.status(201).json(user);
    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

// ===== ACTUALIZAR USUARIO =====
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.update(id, req.body);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// ===== ELIMINAR USUARIO =====
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.delete(id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};