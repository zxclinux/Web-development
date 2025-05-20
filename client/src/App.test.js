import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App.js';

test('renders header', () => {
    render(<App />);
    expect(screen.getByText(/BuyDevice/i)).toBeInTheDocument();
});
