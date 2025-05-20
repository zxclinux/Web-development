import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductPage from '../pages/ProductPage.jsx';

jest.mock('../api/device.js', () => ({
    fetchDevice: () => Promise.resolve({
        id: 1,
        name: 'Galaxy S21',
        img: '',
        rating: 5,
        price: 1000,
        info: [{ id: 1, title: 'RAM', description: '8GB' }],
    }),
}));

test('renders product details', async () => {
    render(
        <MemoryRouter initialEntries={['/product/1']}>
            <Routes>
                <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Galaxy S21/i)).toBeInTheDocument();
    expect(await screen.findByText(/from \$1000/i)).toBeInTheDocument();
    expect(await screen.findByText(/RAM: 8GB/i)).toBeInTheDocument();
});

test('shows success message on add to cart', async () => {
    render(
        <MemoryRouter initialEntries={['/product/1']}>
            <Routes>
                <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
        </MemoryRouter>,
    );
    const btn = await screen.findByText(/Add to cart/i);
    fireEvent.click(btn);
    expect(await screen.findByText(/Successfully added/i)).toBeInTheDocument();
});
