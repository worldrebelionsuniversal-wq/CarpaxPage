const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'carpax_secret_key';

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }
    next();
};

module.exports = { authenticate, isAdmin };