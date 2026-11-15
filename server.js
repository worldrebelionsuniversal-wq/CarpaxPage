const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ARCHIVOS ESTÁTICOS (PRIMERO, ANTES DE TODO) =====
// 1. Public (imágenes, uploads, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Frontends builds (si tienen assets con nombres únicos no hay problema)
app.use(express.static(path.join(__dirname, 'frontend/cliente/dist')));
app.use(express.static(path.join(__dirname, 'frontend/login/dist')));
app.use(express.static(path.join(__dirname, 'frontend/admin/dist')));

// ===== RUTAS API =====
app.use('/api/products', require('./backend/cliente/routes/productRoutes'));
app.use('/api/auth', require('./backend/login/routes/authRoutes'));
app.use('/api/admin', require('./backend/admin/routes/adminRoutes'));

// ===== RUTAS DE SALUD =====
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// ===== RUTAS DEL FRONTEND (SPA) =====
// ⚠️ IMPORTANTE: Estas deben ir DESPUÉS de API pero ANTES del 404
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/login/dist/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/admin/dist/index.html'));
});

app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/admin/dist/index.html'));
});

// Catch-all para el cliente (debe ir al final de las rutas frontend)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/cliente/dist/index.html'));
});

// ===== 404 FINAL (SOLO PARA API) =====
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});