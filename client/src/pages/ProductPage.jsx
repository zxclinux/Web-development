import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDevice } from "../api/device.js";

function ProductPage() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchDevice(id).then(setDevice);
  }, [id]);

  if (!device) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  }

  return (
    <main className="product-page">
      <div className="product-page__top">
        <div className="product-page__image">
          <img
            src={`http://localhost:5000/static/${device.img}`}
            alt={device.name}
          />
        </div>
        <div className="product-page__info">
          <h1 className="product-page__title">{device.name}</h1>
          <div className="product-page__rating">
            <div className="star-icon"></div>
            <span className="rating-value">{device.rating ?? 0}</span>
          </div>
        </div>
        <div className="product-page__purchase purchase-bottom">
          <div className="product-page__price">from ${device.price}</div>
          <button className="btn btn-primary" onClick={() => setAdded(true)}>
            Add to cart
          </button>
          {added && (
            <div className="success" style={{ marginTop: 0 }}>
              Successfully added
            </div>
          )}
        </div>
      </div>
      <section className="product-page__specs">
        <h2>Specifications:</h2>
        <ul className="specs-list">
          {device.info && device.info.length > 0 ? (
            device.info.map((item) => (
              <li key={item.id}>
                {item.title}: {item.description}
              </li>
            ))
          ) : (
            <li>No specifications</li>
          )}
        </ul>
      </section>
    </main>
  );
}

export default ProductPage;
