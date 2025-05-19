const BASE = 'http://localhost:5000/api';

export function registerUser({ email, password, role = 'USER' }) {
    return fetch(`${BASE}/user/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
    }).then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
    });
}

export function loginUser({ email, password }) {
    return fetch(`${BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
    });
}

export function fetchDevices({ typeId, page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams();
    if (typeId) params.append('typeId', typeId);
    params.append('page', page);
    params.append('limit', limit);

    return fetch(`${BASE}/device?${params.toString()}`, {
        cache: 'no-store',
    }).then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    });
}

export function fetchTypes() {
    return fetch(`${BASE}/type`, { cache: 'no-store' }).then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    });
}
