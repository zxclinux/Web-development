import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../pages/AdminPage.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

function setTokenWithRole(role) {
    const payload = btoa(JSON.stringify({ role }));
    const token = `header.${payload}.signature`;
    localStorage.setItem('token', token);
}

test('редіректить на /login якщо токена немає', () => {
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
});

test('редіректить на /users якщо роль не ADMIN', () => {
    setTokenWithRole('USER');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/users');
});

test('редіректить на /login якщо токен некоректний', () => {
    localStorage.setItem('token', 'bad.token');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
});

test('рендерить кнопки для адміна', () => {
    setTokenWithRole('ADMIN');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Add new type/i)).toBeInTheDocument();
    expect(screen.getByText(/Add new brand/i)).toBeInTheDocument();
    expect(screen.getByText(/Add new device/i)).toBeInTheDocument();
    expect(screen.getByText(/User listing/i)).toBeInTheDocument();
});

test('кнопка Add new type веде на /add-type', () => {
    setTokenWithRole('ADMIN');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Add new type/i));
    expect(mockNavigate).toHaveBeenCalledWith('/add-type');
});

test('кнопка Add new brand веде на /add-brand', () => {
    setTokenWithRole('ADMIN');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Add new brand/i));
    expect(mockNavigate).toHaveBeenCalledWith('/add-brand');
});

test('кнопка Add new device веде на /add-product', () => {
    setTokenWithRole('ADMIN');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Add new device/i));
    expect(mockNavigate).toHaveBeenCalledWith('/add-product');
});

test('кнопка User listing веде на /admin/users', () => {
    setTokenWithRole('ADMIN');
    render(
        <MemoryRouter>
            <AdminPage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/User listing/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
});
