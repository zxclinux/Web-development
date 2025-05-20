import * as api from '../api/user.js';

beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.setItem('token', 'test-token');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('fetchUsers', () => {
    it('returns users on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 1, email: 'a@a.com' }]),
        });
        const data = await api.fetchUsers();
        expect(data).toEqual([{ id: 1, email: 'a@a.com' }]);
    });

    it('throws error with status and text', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 403,
            text: () => Promise.resolve('Forbidden'),
        });
        await expect(api.fetchUsers()).rejects.toThrow('403 Forbidden');
    });

    it('throws error with status and default text', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: () => Promise.resolve(''),
        });
        await expect(api.fetchUsers()).rejects.toThrow('500 Failed to fetch users');
    });
});

describe('loginUser', () => {
    it('returns token on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'abc' }),
        });
        const data = await api.loginUser({ email: 'a', password: 'b' });
        expect(data).toHaveProperty('token', 'abc');
    });

    it('throws error with message from response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Invalid credentials' }),
        });
        await expect(api.loginUser({ email: 'a', password: 'b' })).rejects.toThrow(
            'Invalid credentials',
        );
    });

    it('throws default error if response has no message', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}),
        });
        await expect(api.loginUser({ email: 'a', password: 'b' })).rejects.toThrow(
            'Login failed',
        );
    });

    it('throws default error if response is not JSON', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => {
                throw new Error('not json');
            },
        });
        await expect(api.loginUser({ email: 'a', password: 'b' })).rejects.toThrow(
            'Login failed',
        );
    });
});

describe('registerUser', () => {
    it('returns token on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'abc' }),
        });
        const data = await api.registerUser({ email: 'a', password: 'b' });
        expect(data).toHaveProperty('token', 'abc');
    });

    it('throws error with message from response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Email exists' }),
        });
        await expect(
            api.registerUser({ email: 'a', password: 'b' }),
        ).rejects.toThrow('Email exists');
    });

    it('throws default error if response has no message', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}),
        });
        await expect(
            api.registerUser({ email: 'a', password: 'b' }),
        ).rejects.toThrow('Registration failed');
    });

    it('throws default error if response is not JSON', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => {
                throw new Error('not json');
            },
        });
        await expect(
            api.registerUser({ email: 'a', password: 'b' }),
        ).rejects.toThrow('Registration failed');
    });
});

describe('deleteUser', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        });
        const data = await api.deleteUser(1);
        expect(data).toEqual({ success: true });
    });

    it('throws error with message from response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'No rights' }),
        });
        await expect(api.deleteUser(1)).rejects.toThrow('No rights');
    });

    it('throws default error if response has no message', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}),
        });
        await expect(api.deleteUser(1)).rejects.toThrow('Delete failed');
    });

    it('throws default error if response is not JSON', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => {
                throw new Error('not json');
            },
        });
        await expect(api.deleteUser(1)).rejects.toThrow('Delete failed');
    });
});
