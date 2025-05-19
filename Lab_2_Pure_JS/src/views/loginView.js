import { loginUser } from '../api.js';
import { showError } from '../utils.js';

export default function loginView() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="full-height">
            <div class="container">
                <h1>Login</h1>
                <form id="loginForm">
                    <div class="form-group">
                        <input type="email" id="email" class="form-control" placeholder="Enter your email..." required />
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" class="form-control" placeholder="Enter your password..." required />
                    </div>
                    <button type="submit" class="btn btn--primary">Sign In</button>
                    <p class="text-link">
                        Don't have an account? <a href="#register">Register</a>
                    </p>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('token', data.token);
            window.location.hash = 'catalog';
        } catch (err) {
            showError(err.message);
        }
    });
}
