// backend/admin/controllers/authController.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'carpax_secret_key';

// ===== LOGIN =====
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValid = await UserModel.verifyPassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!user.is_admin) {
            return res.status(403).json({ error: 'No tienes permisos de administrador' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, isAdmin: user.is_admin },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// ===== VERIFICAR TOKEN =====
const verify = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.is_admin
            }
        });
    } catch (error) {
        return res.status(401).json({ valid: false, error: 'Token inválido' });
    }
};

module.exports = { login, verify };