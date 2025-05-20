import React, { useEffect, useState } from "react";
import { fetchTypes, fetchBrands, fetchDevices } from "../api/device.js";
import { Link } from "react-router-dom";

function CatalogPage() {
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTypes().then(setTypes);
    fetchBrands().then(setBrands);
  }, []);

  useEffect(() => {
    fetchDevices(selectedType, selectedBrand, page, 10).then((data) => {
      setDevices(data.rows || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
    });
  }, [selectedType, selectedBrand, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedType, selectedBrand]);

  return (
    <section className="catalog-content">
      <aside className="catalog-sidebar">
        <ul className="sidebar-list">
          <li
            className={selectedType === null ? "active" : ""}
            onClick={() => setSelectedType(null)}
            style={{ cursor: "pointer" }}
          >
            All categories
          </li>
          {types.map((type) => (
            <li
              key={type.id}
              className={selectedType === type.id ? "active" : ""}
              onClick={() => setSelectedType(type.id)}
              style={{ cursor: "pointer" }}
            >
              {type.name}
            </li>
          ))}
        </ul>
      </aside>
      <main className="catalog-main">
        <div style={{ marginBottom: 24 }}>
          <select
            className="brand-select"
            value={selectedBrand || ""}
            onChange={(e) =>
              setSelectedBrand(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="product-grid">
          {devices.map((device) => (
            <article className="product-card" key={device.id}>
              <Link to={`/product/${device.id}`} className="product-card__img">
                {device.img && (
                  <img
                    src={`http://localhost:5000/static/${device.img}`}
                    alt={device.name}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                  />
                )}
              </Link>
              <div className="product-card__name">
                <Link to={`/product/${device.id}`} className="plain-link">
                  {device.name}
                </Link>
              </div>
              <div className="product-card__rating">
                {typeof device.rating !== "undefined" && device.rating !== null
                  ? `${device.rating} ★`
                  : "0 ★"}
              </div>
            </article>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page${page === i + 1 ? " current" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </section>
  );
}

export default CatalogPage;
