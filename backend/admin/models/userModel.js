// backend/admin/models/userModel.js
const pool = require('../../../database');
const bcrypt = require('bcrypt');

class UserModel {
    // ===== OBTENER USUARIO POR EMAIL =====
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    // ===== OBTENER USUARIO POR ID =====
    static async findById(id) {
        const result = await pool.query('SELECT id, name, email, is_admin, created_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    // ===== CREAR USUARIO =====
    static async create(name, email, password, isAdmin = false) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, name, email, is_admin',
            [name, email, hashedPassword, isAdmin]
        );
        return result.rows[0];
    }

    // ===== VERIFICAR CONTRASEÑA =====
    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    // ===== ACTUALIZAR USUARIO =====
    static async update(id, data) {
        const fields = [];
        const params = [];
        let paramCount = 1;
        
        if (data.name) {
            fields.push(`name = $${paramCount}`);
            params.push(data.name);
            paramCount++;
        }
        
        if (data.email) {
            fields.push(`email = $${paramCount}`);
            params.push(data.email);
            paramCount++;
        }
        
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            fields.push(`password = $${paramCount}`);
            params.push(hashedPassword);
            paramCount++;
        }
        
        if (data.is_admin !== undefined) {
            fields.push(`is_admin = $${paramCount}`);
            params.push(data.is_admin);
            paramCount++;
        }
        
        if (fields.length === 0) return null;
        
        params.push(id);
        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, is_admin`,
            params
        );
        
        return result.rows[0];
    }

    // ===== ELIMINAR USUARIO =====
    static async delete(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }

    // ===== OBTENER TODOS LOS USUARIOS =====
    static async findAll(limit = 100, offset = 0) {
        const result = await pool.query(
            'SELECT id, name, email, is_admin, created_at FROM users ORDER BY id DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return result.rows;
    }
}

module.exports = UserModel;