// backend/admin/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ===== RUTAS DE AUTENTICACIÓN =====
router.post('/login', authController.login);
router.get('/verify', authController.verify);

module.exports = router;