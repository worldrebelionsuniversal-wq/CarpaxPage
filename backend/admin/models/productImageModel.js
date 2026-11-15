// backend/admin/models/productImageModel.js
const pool = require('../../../database');

class ProductImageModel {
    // ===== OBTENER IMÁGENES DE UN PRODUCTO =====
    static async findByProduct(productId) {
        const result = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order',
            [productId]
        );
        return result.rows;
    }

    // ===== CREAR IMAGEN =====
    static async create(productId, imageUrl, isPrimary = false, sortOrder = 0) {
        const result = await pool.query(
            'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
            [productId, imageUrl, isPrimary, sortOrder]
        );
        return result.rows[0];
    }

    // ===== ELIMINAR IMAGEN =====
    static async delete(id) {
        const result = await pool.query('DELETE FROM product_images WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }

    // ===== ELIMINAR TODAS LAS IMÁGENES DE UN PRODUCTO =====
    static async deleteByProduct(productId) {
        const result = await pool.query('DELETE FROM product_images WHERE product_id = $1 RETURNING id', [productId]);
        return result.rows;
    }

    // ===== ESTABLECER IMAGEN PRINCIPAL =====
    static async setPrimary(productId, imageId) {
        // Desmarcar todas las imágenes como principales
        await pool.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productId]);
        // Marcar la imagen seleccionada como principal
        await pool.query('UPDATE product_images SET is_primary = true WHERE id = $2', [imageId]);
    }

    // ===== ACTUALIZAR ORDEN =====
    static async updateOrder(imageId, sortOrder) {
        const result = await pool.query(
            'UPDATE product_images SET sort_order = $1 WHERE id = $2 RETURNING *',
            [sortOrder, imageId]
        );
        return result.rows[0];
    }
}

module.exports = ProductImageModel;