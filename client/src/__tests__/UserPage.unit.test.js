import React from 'react';
import {
    render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserPage from '../pages/UserPage.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockFetchUsers = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock('../api/user', () => ({
    fetchUsers: (...args) => mockFetchUsers(...args),
    deleteUser: (...args) => mockDeleteUser(...args),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('показує Loading... під час завантаження', async () => {
    let resolve;
    mockFetchUsers.mockReturnValue(new Promise((res) => (resolve = res)));
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    resolve([]);
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());
});

test('показує список користувачів', async () => {
    mockFetchUsers.mockResolvedValueOnce([
        { id: 1, email: 'test@mail.com', role: 'USER' },
        { id: 2, email: 'admin@mail.com', role: 'ADMIN' },
    ]);
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/test@mail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@mail.com/i)).toBeInTheDocument();
});

test('показує помилку доступу для 403/401', async () => {
    mockFetchUsers.mockRejectedValueOnce(new Error('403 Forbidden'));
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Access denied/i)).toBeInTheDocument();
});

test('показує іншу помилку', async () => {
    mockFetchUsers.mockRejectedValueOnce(new Error('Network error'));
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
});

test('видаляє користувача після підтвердження', async () => {
    window.confirm = jest.fn(() => true);
    mockFetchUsers.mockResolvedValueOnce([
        { id: 1, email: 'test@mail.com', role: 'USER' },
    ]);
    mockDeleteUser.mockResolvedValueOnce({});
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/test@mail.com/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(mockDeleteUser).toHaveBeenCalledWith(1));
});

test('не видаляє користувача без підтвердження', async () => {
    window.confirm = jest.fn(() => false);
    mockFetchUsers.mockResolvedValueOnce([
        { id: 1, email: 'test@mail.com', role: 'USER' },
    ]);
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/test@mail.com/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDeleteUser).not.toHaveBeenCalled();
});

test('показує помилку при видаленні', async () => {
    window.confirm = jest.fn(() => true);
    mockFetchUsers.mockResolvedValueOnce([
        { id: 1, email: 'test@mail.com', role: 'USER' },
    ]);
    mockDeleteUser.mockRejectedValueOnce(new Error('Delete error'));
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/test@mail.com/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText(/Delete error/i)).toBeInTheDocument();
});

test('кнопка Back to admin panel викликає navigate', async () => {
    mockFetchUsers.mockResolvedValueOnce([]);
    render(
        <MemoryRouter>
            <UserPage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Back to admin panel/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
});
