import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createType } from '../api/device.js';

function AddTypePage() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccess(false);
        try {
            await createType({ name });
            setMessage('Type added successfully!');
            setSuccess(true);
            setName('');
        } catch (err) {
            let msg = 'Failed to add type';
            if (err && err.message) msg = err.message;
            setMessage(msg);
            setSuccess(false);
        }
    };

    return (
        <main className="full-height">
            <div className="container" style={{ maxWidth: 400 }}>
                <h1>Add new type</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type name"
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

export default AddTypePage;