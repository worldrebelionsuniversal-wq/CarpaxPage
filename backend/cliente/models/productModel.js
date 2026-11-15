// backend/cliente/models/productModel.js
const pool = require('../../../database');

class ProductModel {
    // ===== OBTENER TODOS LOS PRODUCTOS CON FILTROS =====
    static async findAll(filters = {}) {
        const { type, capacity, color, weight, size, search, limit = 100, offset = 0 } = filters;
        
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
        
        if (color && color !== 'all') {
            query += ` AND color = $${paramCount}`;
            params.push(color);
            paramCount++;
        }
        
        if (weight && weight !== 'all') {
            query += ` AND weight = $${paramCount}`;
            params.push(parseFloat(weight));
            paramCount++;
        }
        
        if (size && size !== 'all') {
            query += ` AND size = $${paramCount}`;
            params.push(size);
            paramCount++;
        }
        
        if (search) {
            query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }
        
        // 📌 Filtro por precio (rango)
        if (filters.min_price) {
            query += ` AND price >= $${paramCount}`;
            params.push(parseFloat(filters.min_price));
            paramCount++;
        }
        
        if (filters.max_price) {
            query += ` AND price <= $${paramCount}`;
            params.push(parseFloat(filters.max_price));
            paramCount++;
        }
        
        // 📌 Ordenar
        const orderBy = filters.orderBy || 'id';
        const orderDir = filters.orderDir || 'DESC';
        query += ` ORDER BY ${orderBy} ${orderDir}`;
        
        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        
        const result = await pool.query(query, params);
        return result.rows;
    }

    // ===== OBTENER PRODUCTO POR ID =====
    static async findById(id) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }

    // ===== OBTENER IMÁGENES DE UN PRODUCTO =====
    static async getImages(productId) {
        const result = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order',
            [productId]
        );
        return result.rows;
    }

    // ===== OBTENER PRODUCTOS POR CATEGORÍA =====
    static async findByCategory(category) {
        const result = await pool.query(
            'SELECT * FROM products WHERE type = $1 ORDER BY id DESC',
            [category]
        );
        return result.rows;
    }

    // ===== OBTENER PRODUCTOS EN OFERTA =====
    static async findOffers() {
        const result = await pool.query(
            'SELECT * FROM products WHERE offer = true ORDER BY id DESC'
        );
        return result.rows;
    }

    // ===== OBTENER ÚLTIMOS PRODUCTOS =====
    static async findLatest(limit = 8) {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC LIMIT $1',
            [limit]
        );
        return result.rows;
    }

    // ===== OBTENER PRODUCTOS RELACIONADOS =====
    static async findRelated(productId, type, limit = 4) {
        const result = await pool.query(
            'SELECT * FROM products WHERE type = $1 AND id != $2 ORDER BY id DESC LIMIT $3',
            [type, productId, limit]
        );
        return result.rows;
    }

    // ===== OBTENER ESTADÍSTICAS =====
    static async getStats() {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_products,
                SUM(stock) as total_stock,
                AVG(price) as average_price,
                MAX(price) as max_price,
                MIN(price) as min_price,
                COUNT(CASE WHEN offer = true THEN 1 END) as products_on_offer
            FROM products
        `);
        return result.rows[0];
    }
}

module.exports = ProductModel;