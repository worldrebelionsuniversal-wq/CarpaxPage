import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminImages from './pages/AdminImages';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/" element={
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="productos" element={<AdminProducts />} />
                <Route path="productos/nuevo" element={<AdminProductForm />} />
                <Route path="productos/editar/:id" element={<AdminProductForm />} />
                <Route path="productos/:id/imagenes" element={<AdminImages />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;