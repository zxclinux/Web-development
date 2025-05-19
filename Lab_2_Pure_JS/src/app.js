import registrationView from './views/registrationView.js';
import loginView from './views/loginView.js';
import catalogView from './views/catalogView.js';

function router() {
    const [route, typeIdRaw, pageRaw] = window.location.hash
        .replace('#', '')
        .split('/');

    switch (route) {
    case 'register':
        registrationView();
        break;

    case 'login':
        loginView();
        break;

    case 'catalog': {
        const typeId = typeIdRaw && !Number.isNaN(Number(typeIdRaw)) ? Number(typeIdRaw) : '';
        const page = pageRaw && !Number.isNaN(Number(pageRaw)) ? Number(pageRaw) : 1;
        catalogView({
            typeId,
            page,
        });
        break;
    }
    default:
        window.location.hash = 'catalog';
        router();
    }
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
