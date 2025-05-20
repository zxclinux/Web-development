import React from 'react';
import {
    render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockLoginUser = jest.fn();
jest.mock('../api/user', () => ({
    loginUser: (...args) => mockLoginUser(...args),
}));

beforeEach(() => {
    mockNavigate.mockClear();
    mockLoginUser.mockReset();
});

test('renders login form', () => {
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('shows error on API error', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('Invalid credentials'));
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
        target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: '123456' },
    });
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
});

test('redirects on success', async () => {
    mockLoginUser.mockResolvedValueOnce({ token: '123' });
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
        target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: '123456' },
    });
    fireEvent.click(screen.getByText(/Sign In/i));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/users'));
});
