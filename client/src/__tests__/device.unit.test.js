import * as api from '../api/device.js';

beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.setItem('token', 'test-token');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('createType', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
        });
        const data = await api.createType({ name: 'Phone' });
        expect(data).toEqual({ id: 1 });
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.createType({ name: 'Phone' })).rejects.toThrow(
            'Failed to add type',
        );
    });
});

describe('createBrand', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
        });
        const data = await api.createBrand({ name: 'Brand' });
        expect(data).toEqual({ id: 1 });
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.createBrand({ name: 'Brand' })).rejects.toThrow(
            'Failed to add brand',
        );
    });
});

describe('createDevice', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
        });
        const data = await api.createDevice(new FormData());
        expect(data).toEqual({ id: 1 });
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.createDevice(new FormData())).rejects.toThrow(
            'Failed to add device',
        );
    });
});

describe('fetchTypes', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: 'Phone' }]),
        });
        const data = await api.fetchTypes();
        expect(data).toEqual([{ id: 1, name: 'Phone' }]);
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.fetchTypes()).rejects.toThrow('Failed to fetch types');
    });
});

describe('fetchBrands', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: 'Brand' }]),
        });
        const data = await api.fetchBrands();
        expect(data).toEqual([{ id: 1, name: 'Brand' }]);
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.fetchBrands()).rejects.toThrow('Failed to fetch brands');
    });
});

describe('fetchDevices', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ rows: [], count: 0 }),
        });
        const data = await api.fetchDevices();
        expect(data).toEqual({ rows: [], count: 0 });
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.fetchDevices()).rejects.toThrow('Failed to fetch devices');
    });

    it('builds url with typeId and brandId', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ rows: [], count: 0 }),
        });
        await api.fetchDevices(1, 2, 3, 4);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('typeId=1'));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('brandId=2'));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('limit=4'));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=3'));
    });
});

describe('fetchDevice', () => {
    it('returns data on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 1, name: 'Device' }),
        });
        const data = await api.fetchDevice(1);
        expect(data).toEqual({ id: 1, name: 'Device' });
    });

    it('throws on error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(api.fetchDevice(1)).rejects.toThrow('Failed to fetch device');
    });
});
