const API_URL = 'http://localhost:5000/api/user';

export async function fetchUsers() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${text || 'Failed to fetch users'}`);
    }
    return res.json();
}

export async function loginUser({ email, password }) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        let msg = 'Login failed';
        try {
            const data = await res.json();
            msg = data.message || msg;
        } catch {}
        throw new Error(msg);
    }
    return res.json();
}

export async function registerUser({ email, password }) {
    const res = await fetch(`${API_URL}/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        let msg = 'Registration failed';
        try {
            const data = await res.json();
            msg = data.message || msg;
        } catch {}
        throw new Error(msg);
    }
    return res.json();
}

export async function deleteUser(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        let msg = 'Delete failed';
        try {
            const data = await res.json();
            msg = data.message || msg;
        } catch {}
        throw new Error(msg);
    }
    return res.json();
}
