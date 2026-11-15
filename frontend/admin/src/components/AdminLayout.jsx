import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

function AdminLayout() {
    return (
        <div className="admin-app">
            <AdminSidebar />
            <div className="admin-main">
                <AdminHeader />
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;