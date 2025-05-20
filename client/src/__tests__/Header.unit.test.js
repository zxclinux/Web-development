import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function setToken(token) {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
}

afterEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
});

test('shows Login when not authenticated', () => {
    setToken(null);
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('shows Logout when authenticated', () => {
    setToken('test-token');
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
});

test('calls logout and navigates', () => {
    setToken('test-token');
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Logout/i));
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
});
