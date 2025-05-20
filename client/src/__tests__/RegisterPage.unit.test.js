import React from 'react';
import {
    render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockRegisterUser = jest.fn();
jest.mock('../api/user', () => ({
    registerUser: (...args) => mockRegisterUser(...args),
}));

beforeEach(() => {
    mockNavigate.mockClear();
    mockRegisterUser.mockReset();
});

test('renders register form', () => {
    render(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
});

test('shows error on API error', async () => {
    mockRegisterUser.mockRejectedValueOnce(new Error('Email exists'));
    render(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
        target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: '123456' },
    });
    fireEvent.click(screen.getByText(/Register/i));
    expect(await screen.findByText(/Email exists/i)).toBeInTheDocument();
});

test('redirects on success', async () => {
    mockRegisterUser.mockResolvedValueOnce({ token: '123' });
    render(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
        target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: '123456' },
    });
    fireEvent.click(screen.getByText(/Register/i));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/users'));
});
