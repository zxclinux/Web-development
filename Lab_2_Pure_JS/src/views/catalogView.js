import { fetchDevices, fetchTypes } from '../api.js';

export default function catalogView({ typeId = '', page = 1 } = {}) {
    const app = document.getElementById('app');

    app.innerHTML = `
    <header class="global-header">
      <a href="#catalog" class="logo">BuyDevice</a>
      <nav>
        <a href="#admin" class="admin">Admin</a>
        <a href="#cart" class="cart" title="Cart"></a>
        <a href="#logout" class="logout">Logout</a>
      </nav>
    </header>
    <section class="catalog-content">
      <aside class="catalog-sidebar">
        <ul class="sidebar-list" id="sidebar-list">
          <li data-type="">All categories</li>
        </ul>
      </aside>
      <main class="catalog-main">
        <div class="catalog-main__title" id="catalog-title">
          Loading...
        </div>
        <div class="product-grid" id="product-grid">
          <div class="loader">Loading...</div>
        </div>
        <div class="pagination" id="pagination"></div>
      </main>
    </section>
  `;

    fetchTypes()
        .then((types) => {
            const sidebar = document.getElementById('sidebar-list');
            types.forEach((type) => {
                const liElem = document.createElement('li');
                liElem.textContent = type.name;
                liElem.dataset.type = type.id;
                sidebar.appendChild(liElem);
            });

            let found = false;
            document.querySelectorAll('.sidebar-list li').forEach((liElem) => {
                liElem.onclick = () => {
                    const tId = liElem.dataset.type;
                    window.location.hash = tId ? `catalog/${tId}/1` : 'catalog';
                };
                if (
                    liElem.dataset.type === String(typeId)
          || (!typeId && liElem.dataset.type === '')
                ) {
                    liElem.classList.add('active');
                    document.getElementById('catalog-title').textContent = liElem.textContent || 'All categories';
                    found = true;
                }
            });

            if (!found) {
                document.getElementById('catalog-title').textContent = 'All categories';
            }
        })
        .catch(() => {
            document.getElementById('catalog-title').textContent = 'All categories';
        });

    const grid = document.getElementById('product-grid');
    const pagination = document.getElementById('pagination');

    const fetchParams = {};
    if (typeId && !Number.isNaN(Number(typeId))) fetchParams.typeId = Number(typeId);
    fetchParams.page = page;
    fetchParams.limit = 12;

    fetchDevices(fetchParams)
        .then((result) => {
            let rows = [];
            if (Array.isArray(result.rows)) {
                rows = result.rows;
            } else if (Array.isArray(result)) {
                rows = result;
            }
            if (!rows.length) {
                grid.innerHTML = '<div class="empty">No devices found</div>';
                pagination.innerHTML = '';
                return;
            }
            grid.innerHTML = rows
                .map(
                    (dev) => `
      <article class="product-card">
        <div class="product-card__img">
          <img src="http://localhost:5000/static/${dev.img}" alt="${dev.name}" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div class="product-card__name">${dev.name}</div>
        <div class="product-card__rating">${dev.rating} ★</div>
      </article>
    `,
                )
                .join('');

            const total = result.count || rows.length;
            const totalPages = Math.ceil(total / fetchParams.limit);
            let pagHtml = '';
            for (let i = 1; i <= totalPages; i += 1) {
                pagHtml += `<button class="page${
                    i === page ? ' current' : ''
                }" data-page="${i}">${i}</button>`;
            }
            pagination.innerHTML = pagHtml;
            pagination.querySelectorAll('.page').forEach((btnElem) => {
                btnElem.onclick = () => {
                    window.location.hash = typeId
                        ? `catalog/${typeId}/${btnElem.dataset.page}`
                        : `catalog//${btnElem.dataset.page}`;
                };
            });
        })
        .catch((err) => {
            grid.innerHTML = `<div class="error">${err.message}</div>`;
            pagination.innerHTML = '';
        });
}
