export function showLoader() {
    document.getElementById('app').innerHTML = '<div class="loader">Loading...</div>';
}

export function showError(message) {
    document.getElementById(
        'app',
    ).innerHTML = `<div class="error">${message}</div>`;
}
