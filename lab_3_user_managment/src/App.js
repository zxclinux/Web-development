import React from 'react';
import {
    BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import './main.scss';
import Header from './components/Header.jsx';
import UsersPage from './pages/UserPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/users" />} />
            </Routes>
        </Router>
    );
}

export default App;
