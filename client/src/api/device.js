const API_URL = 'http://localhost:5000/api';

export async function createType(type) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/type`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(type),
    });
    if (!res.ok) throw new Error('Failed to add type');
    return res.json();
}

export async function createBrand(brand) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/brand`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brand),
    });
    if (!res.ok) throw new Error('Failed to add brand');
    return res.json();
}

export async function createDevice(formData) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/device`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to add device');
    return res.json();
}

export async function fetchTypes() {
    const res = await fetch(`${API_URL}/type`);
    if (!res.ok) throw new Error('Failed to fetch types');
    return res.json();
}

export async function fetchBrands() {
    const res = await fetch(`${API_URL}/brand`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
}

export async function fetchDevices(typeId, brandId, page = 1, limit = 8) {
    let url = `${API_URL}/device?limit=${limit}&page=${page}`;
    if (typeId) url += `&typeId=${typeId}`;
    if (brandId) url += `&brandId=${brandId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch devices');
    return res.json();
}

export async function fetchDevice(id) {
    const res = await fetch(`${API_URL}/device/${id}`);
    if (!res.ok) throw new Error('Failed to fetch device');
    return res.json();
}
