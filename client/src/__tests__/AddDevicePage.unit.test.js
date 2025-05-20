import React from 'react';
import {
    render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddDevicePage from '../pages/AddDevicePage.jsx';

const mockNavigate = jest.fn();
const mockCreateDevice = jest.fn();
const mockFetchTypes = jest.fn();
const mockFetchBrands = jest.fn();

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});
jest.mock('../api/device', () => ({
    __esModule: true,
    createDevice: (...args) => mockCreateDevice(...args),
    fetchTypes: (...args) => mockFetchTypes(...args),
    fetchBrands: (...args) => mockFetchBrands(...args),
}));

beforeEach(() => {
    mockNavigate.mockClear();
    mockCreateDevice.mockReset();
    mockFetchTypes.mockReset();
    mockFetchBrands.mockReset();
});

test('рендерить форму та підвантажує типи і бренди', async () => {
    mockFetchTypes.mockResolvedValue([
        { id: 1, name: 'Phone' },
        { id: 2, name: 'Laptop' },
    ]);
    mockFetchBrands.mockResolvedValue([
        { id: 10, name: 'Samsung' },
        { id: 20, name: 'Apple' },
    ]);

    render(
        <BrowserRouter>
            <AddDevicePage />
        </BrowserRouter>,
    );

    await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Phone' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Samsung' })).toBeInTheDocument();
    });
});

test('показує повідомлення про помилку, якщо не всі поля заповнені', async () => {
    mockFetchTypes.mockResolvedValue([]);
    mockFetchBrands.mockResolvedValue([]);

    render(
        <BrowserRouter>
            <AddDevicePage />
        </BrowserRouter>,
    );

    // Вибираємо submit-кнопку (остання з "Add")
    const addButtons = screen.getAllByRole('button', { name: /^add$/i });
    fireEvent.click(addButtons[addButtons.length - 1]);

    expect(await screen.findByText('Failed to add device')).toBeInTheDocument();
});

test('успішно створює девайс при коректному заповненні', async () => {
    mockFetchTypes.mockResolvedValue([{ id: 1, name: 'Phone' }]);
    mockFetchBrands.mockResolvedValue([{ id: 10, name: 'Samsung' }]);
    mockCreateDevice.mockResolvedValue({ id: 99 });

    render(
        <BrowserRouter>
            <AddDevicePage />
        </BrowserRouter>,
    );

    await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Phone' })).toBeInTheDocument();
    });

    userEvent.type(screen.getByPlaceholderText('Device name'), 'My Phone');
    userEvent.type(screen.getByPlaceholderText('Price'), '1234');

    // Вибираємо селекти через getAllByRole
    const selects = screen.getAllByRole('combobox');
    userEvent.selectOptions(selects[0], '10'); // бренд
    userEvent.selectOptions(selects[1], '1'); // тип

    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    const fileInput = document.getElementById('device-file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /add description/i }));
    userEvent.type(screen.getByPlaceholderText('Title'), 'Spec1');
    userEvent.type(screen.getByPlaceholderText('Description'), 'Desc1');

    // Вибираємо submit-кнопку (остання з "Add")
    const addButtons = screen.getAllByRole('button', { name: /^add$/i });
    fireEvent.click(addButtons[addButtons.length - 1]);

    expect(
        await screen.findByText('Device added successfully!'),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Device name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Price')).toHaveValue(null);
    expect(screen.getByText('Not uploaded')).toBeInTheDocument();
});
