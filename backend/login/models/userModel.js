const pool = require('../../../database');
const bcrypt = require('bcrypt');

class UserModel {
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT id, name, email, is_admin, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async create(name, email, password, isAdmin = false) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password, is_admin) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, name, email, is_admin`,
            [name, email, hashedPassword, isAdmin]
        );
        return result.rows[0];
    }

    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = UserModel;