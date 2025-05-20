import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CatalogPage from '../pages/CatalogPage.jsx';

jest.mock('../api/device.js', () => ({
    fetchTypes: () => Promise.resolve([{ id: 1, name: 'Phone' }]),
    fetchBrands: () => Promise.resolve([{ id: 1, name: 'Samsung' }]),
    fetchDevices: () => Promise.resolve({
        rows: [
            {
                id: 1,
                name: 'Galaxy S21',
                img: '',
                rating: 5,
            },
        ],
        count: 1,
    }),
}));

test('renders All categories in sidebar', async () => {
    render(
        <MemoryRouter>
            <CatalogPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/All categories/i)).toBeInTheDocument();
});

test('renders brand select', async () => {
    render(
        <MemoryRouter>
            <CatalogPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/All brands/i)).toBeInTheDocument();
});

test('renders product name', async () => {
    render(
        <MemoryRouter>
            <CatalogPage />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Galaxy S21/i)).toBeInTheDocument();
});
