import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddTypePage from '../pages/AddTypePage.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockCreateType = jest.fn();
jest.mock('../api/device.js', () => ({
    createType: (...args) => mockCreateType(...args),
}));

beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateType.mockReset();
});

test('renders form and buttons', () => {
    render(
        <MemoryRouter>
            <AddTypePage />
        </MemoryRouter>,
    );
    expect(screen.getByText(/Add new type/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Add$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
});

test('shows required validation error', async () => {
    render(
        <MemoryRouter>
            <AddTypePage />
        </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(/Type name/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(await screen.findByText(/Type name is required/i)).toBeInTheDocument();
    expect(mockCreateType).not.toHaveBeenCalled();
});

test('shows success message on valid submit', async () => {
    mockCreateType.mockResolvedValueOnce({ id: 1, name: 'TestType' });
    render(
        <MemoryRouter>
            <AddTypePage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Type name/i), {
        target: { value: 'TestType' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(
        await screen.findByText(/Type added successfully/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type name/i)).toHaveValue('');
});

test('shows error message from API', async () => {
    mockCreateType.mockRejectedValueOnce(new Error('Type exists'));
    render(
        <MemoryRouter>
            <AddTypePage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Type name/i), {
        target: { value: 'TestType' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(await screen.findByText(/Type exists/i)).toBeInTheDocument();
});

test('shows default error if API throws without message', async () => {
    mockCreateType.mockRejectedValueOnce({});
    render(
        <MemoryRouter>
            <AddTypePage />
        </MemoryRouter>,
    );
    fireEvent.change(screen.getByPlaceholderText(/Type name/i), {
        target: { value: 'TestType' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(await screen.findByText(/Failed to add type/i)).toBeInTheDocument();
});

test('back button navigates to /admin', () => {
    render(
        <MemoryRouter>
            <AddTypePage />
        </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
});
