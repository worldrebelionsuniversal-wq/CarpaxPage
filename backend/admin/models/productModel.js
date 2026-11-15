// backend/admin/models/productModel.js
const pool = require('../../../database');

class ProductModel {
    // ===== OBTENER TODOS LOS PRODUCTOS =====
    static async findAll(filters = {}) {
        const { type, capacity, search, limit = 100, offset = 0 } = filters;
        
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
        
        query += ` ORDER BY id DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(parseInt(limit), parseInt(offset));
        
        const result = await pool.query(query, params);
        return result.rows;
    }

    // ===== OBTENER PRODUCTO POR ID =====
    static async findById(id) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }

    // ===== CREAR PRODUCTO =====
    static async create(data) {
        const { 
            name, description, price, old_price, rating, 
            type, capacity, icon, offer, stock, 
            image_url, color, weight, size 
        } = data;
        
        const result = await pool.query(
            `INSERT INTO products 
             (name, description, price, old_price, rating, type, capacity, icon, offer, stock, image_url, color, weight, size) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
             RETURNING *`,
            [name, description, price, old_price, rating, type, capacity, icon, offer || false, stock || 0, image_url, color, weight, size]
        );
        
        return result.rows[0];
    }

    // ===== ACTUALIZAR PRODUCTO =====
    static async update(id, data) {
        const fields = [];
        const params = [];
        let paramCount = 1;
        
        const allowedFields = [
            'name', 'description', 'price', 'old_price', 'rating', 
            'type', 'capacity', 'icon', 'offer', 'stock', 
            'image_url', 'color', 'weight', 'size'
        ];
        
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = $${paramCount}`);
                params.push(data[field]);
                paramCount++;
            }
        }
        
        if (fields.length === 0) return null;
        
        params.push(id);
        const result = await pool.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            params
        );
        
        return result.rows[0];
    }

    // ===== ELIMINAR PRODUCTO =====
    static async delete(id) {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
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