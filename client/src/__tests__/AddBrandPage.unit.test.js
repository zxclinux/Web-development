import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddBrandPage from '../pages/AddBrandPage.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockCreateBrand = jest.fn();
jest.mock('../api/device.js', () => ({
    createBrand: (...args) => mockCreateBrand(...args),
}));

beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateBrand.mockReset();
});

test('renders form and buttons', () => {
    render(
        <MemoryRouter>
            <AddBrandPage />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Add new brand/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Insert name/i)).toBeInTheDocument();
    expect(screen.getByText(/^Add$/i)).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
});

test('shows required validation error', async () => {
    render(
        <MemoryRouter>
            <AddBrandPage />
        </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(/Insert name/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText(/^Add$/i));
    expect(
        await screen.findByText(/Brand name is required/i),
    ).toBeInTheDocument();
    expect(mockCreateBrand).not.toHaveBeenCalled();
});

test('shows success message on valid submit', async () => {
    mockCreateBrand.mockResolvedValueOnce({ id: 1, name: 'TestBrand' });
    render(
        <MemoryRouter>
            <AddBrandPage />
        </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(/Insert name/i);
    fireEvent.change(input, { target: { value: 'TestBrand' } });
    fireEvent.click(screen.getByText(/^Add$/i));
    expect(
        await screen.findByText(/Brand added successfully/i),
    ).toBeInTheDocument();
    expect(input).toHaveValue(''); // поле очищається після успіху
});

test('shows error message from API', async () => {
    mockCreateBrand.mockRejectedValueOnce(new Error('Brand exists'));
    render(
        <MemoryRouter>
            <AddBrandPage />
        </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(/Insert name/i);
    fireEvent.change(input, { target: { value: 'TestBrand' } });
    fireEvent.click(screen.getByText(/^Add$/i));
    expect(await screen.findByText(/Brand exists/i)).toBeInTheDocument();
});

test('shows default error if API throws without message', async () => {
    mockCreateBrand.mockRejectedValueOnce({});
    render(
        <MemoryRouter>
            <AddBrandPage />
        </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(/Insert name/i);
    fireEvent.change(input, { target: { value: 'TestBrand' } });
    fireEvent.click(screen.getByText(/^Add$/i));
    expect(await screen.findByText(/Failed to add brand/i)).toBeInTheDocument();
});

test('back button navigates to /admin', () => {
    render(
        <MemoryRouter>
            <AddBrandPage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Back/i));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
});
