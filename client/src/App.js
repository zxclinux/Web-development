import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import './main.scss';
import Header from './components/Header.jsx';
import UserPage from './pages/UserPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AddTypePage from './pages/AddTypePage.jsx';
import AddBrandPage from './pages/AddBrandPage.jsx';
import AddDevicePage from './pages/AddDevicePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<UserPage />} />
                <Route path="/add-type" element={<AddTypePage />} />
                <Route path="/add-brand" element={<AddBrandPage />} />
                <Route path="/add-product" element={<AddDevicePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/users" element={<CatalogPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/users" />} />
                <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
        </Router>
    );
}

export default App;
