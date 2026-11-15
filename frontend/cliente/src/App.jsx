import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useCartContext } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import ScrollToTop from './components/ScrollToTop'; 
import './App.css';

function App() {
    const { addToCart, getTotalItems } = useCartContext();

    return (
        <div className="app">
            <ScrollToTop />  
            <Header cartCount={getTotalItems()} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomeView />} />
                    <Route path="/buscar" element={<SearchView />} />
                    <Route path="/producto/:id" element={<ProductDetail addToCart={addToCart} />} />
                    <Route path="/carrito" element={<CartView />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;