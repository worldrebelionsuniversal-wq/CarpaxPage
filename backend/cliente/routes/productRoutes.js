const express = require('express');
const router = express.Router();
const pool = require('../../../database');

// ===== OBTENER TODOS LOS PRODUCTOS =====
router.get('/', async (req, res) => {
    try {
        const { type, capacity, search } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (type && type !== 'all') {
            query += ` AND type = $${paramCount}`;
            params.push(type);
            paramCount++;
        }

        if (capacity && capacity !== 'all') {
            query += ` AND capacity = $${paramCount}`;
            params.push(capacity);
            paramCount++;
        }

        if (search) {
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY id DESC';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Error en GET /products:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// ===== OBTENER PRODUCTO POR ID (CON IMÁGENES) =====
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Buscando producto ID:', id);
        
        // 1. Obtener el producto
        const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        const product = productResult.rows[0];
        console.log('📦 Producto encontrado:', product.name);
        console.log('📸 Imagen principal:', product.image_url);
        
        // 2. Obtener todas las imágenes del producto desde product_images
        const imagesResult = await pool.query(
            'SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY sort_order, id',
            [id]
        );
        
        console.log('📸 Imágenes en product_images:', imagesResult.rows);
        
        // 3. Crear un array con todas las URLs de imágenes
        const imageUrls = imagesResult.rows.map(row => row.image_url);
        console.log('📸 URLs de imágenes adicionales:', imageUrls);
        
        // 4. Crear array final con todas las imágenes
        let allImages = [];
        
        // Agregar la imagen principal
        if (product.image_url) {
            allImages.push(product.image_url);
            console.log('✅ Imagen principal agregada:', product.image_url);
        }
        
        // Agregar imágenes adicionales (evitando duplicados)
        imageUrls.forEach(img => {
            if (!allImages.includes(img)) {
                allImages.push(img);
                console.log('✅ Imagen adicional agregada:', img);
            }
        });
        
        // 5. ASIGNAR LAS IMÁGENES AL PRODUCTO
        product.images = allImages;
        
        console.log(`📸 TOTAL: ${product.images.length} imágenes para ${product.name}:`, product.images);
        
        // 6. Enviar el producto con las imágenes
        res.json(product);
    } catch (error) {
        console.error('❌ Error en GET /products/:id:', error);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

// ===== OBTENER IMÁGENES DE UN PRODUCTO (endpoint adicional) =====
router.get('/:id/images', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📸 Obteniendo imágenes del producto ID:', id);
        
        const result = await pool.query(
            'SELECT id, image_url, is_primary, sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order, id',
            [id]
        );
        
        console.log('📸 Imágenes encontradas:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Error en GET /products/:id/images:', error);
        res.status(500).json({ error: 'Error al obtener imágenes del producto' });
    }
});

module.exports = router;