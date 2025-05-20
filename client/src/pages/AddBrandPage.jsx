import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBrand } from '../api/device.js';

function AddBrandPage() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccess(false);
        try {
            await createBrand({ name });
            setMessage('Brand added successfully!');
            setSuccess(true);
            setName('');
        } catch (err) {
            setMessage(err.message || 'Failed to add brand');
            setSuccess(false);
        }
    };

    return (
        <main className="full-height">
            <div className="container" style={{ maxWidth: 400 }}>
                <h1>Add new brand</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Insert name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn--primary">Add</button>
                </form>
                {message && (
                    <div className={success ? 'success' : 'error'}>{message}</div>
                )}
                <button className="btn" style={{ marginTop: 16 }} onClick={() => navigate('/admin')}>Back</button>
            </div>
        </main>
    );
}

export default AddBrandPage;
