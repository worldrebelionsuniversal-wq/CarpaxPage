const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../../../database');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto';

// ===== MIDDLEWARE DE AUTENTICACIÓN =====
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// ============================================
// RUTAS DE PRODUCTOS
// ============================================

// OBTENER TODOS LOS PRODUCTOS
router.get('/products', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Error en GET /products:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// OBTENER PRODUCTO POR ID
router.get('/products/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error en GET /products/:id:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

// CREAR PRODUCTO
router.post('/products', auth, async (req, res) => {
    try {
        const { name, description, price, old_price, type, capacity, stock, image_url, color, weight, size, offer } = req.body;
        
        const result = await pool.query(
            `INSERT INTO products 
             (name, description, price, old_price, type, capacity, stock, image_url, color, weight, size, offer) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING *`,
            [name, description, price, old_price, type, capacity, stock, image_url, color, weight, size, offer || false]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error en POST /products:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

// ACTUALIZAR PRODUCTO
router.put('/products/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, old_price, type, capacity, stock, image_url, color, weight, size, offer } = req.body;
        
        const result = await pool.query(
            `UPDATE products SET 
                name = $1, description = $2, price = $3, old_price = $4, 
                type = $5, capacity = $6, stock = $7, image_url = $8, 
                color = $9, weight = $10, size = $11, offer = $12
             WHERE id = $13 
             RETURNING *`,
            [name, description, price, old_price, type, capacity, stock, image_url, color, weight, size, offer || false, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error en PUT /products/:id:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// ELIMINAR PRODUCTO
router.delete('/products/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error en DELETE /products/:id:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// ============================================
// RUTAS DE IMÁGENES (NUEVO)
// ============================================

// OBTENER IMÁGENES DE UN PRODUCTO
router.get('/products/:id/images', auth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Obteniendo imágenes del producto:', id);
        
        // Verificar que el producto existe
        const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Obtener imágenes
        const result = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order',
            [id]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Error en GET /products/:id/images:', error);
        res.status(500).json({ error: 'Error al obtener imágenes' });
    }
});

// AGREGAR IMAGEN
router.post('/products/:id/images', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { image_url, is_primary, sort_order } = req.body;
        
        console.log('📸 Agregando imagen al producto:', id);
        
        // Verificar que el producto existe
        const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        const result = await pool.query(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [id, image_url, is_primary || false, sort_order || 0]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error en POST /products/:id/images:', error);
        res.status(500).json({ error: 'Error al agregar imagen' });
    }
});

// ELIMINAR IMAGEN
router.delete('/images/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🗑️ Eliminando imagen:', id);
        
        const result = await pool.query('DELETE FROM product_images WHERE id = $1 RETURNING id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }
        
        res.json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
        console.error('❌ Error en DELETE /images/:id:', error);
        res.status(500).json({ error: 'Error al eliminar imagen' });
    }
});

// ESTABLECER IMAGEN PRINCIPAL
router.put('/images/:id/primary', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id } = req.body;
        
        console.log('⭐ Estableciendo imagen principal:', id);
        
        // Desmarcar todas las imágenes como principales
        await pool.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [product_id]);
        
        // Marcar la imagen seleccionada como principal
        const result = await pool.query(
            'UPDATE product_images SET is_primary = true WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error en PUT /images/:id/primary:', error);
        res.status(500).json({ error: 'Error al establecer imagen principal' });
    }
});

module.exports = router;