import { registerUser } from '../api.js';
import { showError } from '../utils.js';

export default function registrationView() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="full-height">
            <div class="container">
                <h1>Registration</h1>
                <form id="regForm">
                    <div class="form-group">
                        <input type="email" id="email" class="form-control" placeholder="Enter your email..." required />
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" class="form-control" placeholder="Enter your password..." required />
                    </div>
                    <button type="submit" class="btn btn--primary">Register</button>
                    <p class="text-link">
                        Already have an account? <a href="#login">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    `;

    document.getElementById('regForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const data = await registerUser({ email, password });
            localStorage.setItem('token', data.token);
            window.location.hash = 'catalog';
        } catch (err) {
            showError(err.message);
        }
    });
}
