import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../components/UserList.jsx';

const users = [
    {
        id: 1,
        email: 'a@a.com',
        role: 'USER',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
    },
    {
        id: 2,
        email: 'b@b.com',
        role: 'ADMIN',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-04',
    },
];

test('renders user rows', () => {
    render(<UserList users={users} onDelete={() => {}} />);
    expect(screen.getByText('a@a.com')).toBeInTheDocument();
    expect(screen.getByText('b@b.com')).toBeInTheDocument();
});

test('calls onDelete with correct id', () => {
    const onDelete = jest.fn();
    render(<UserList users={users} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
});
