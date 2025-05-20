import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBrand } from "../api/device";

function AddBrandPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setMessage("Brand name is required");
      setSuccess(false);
      return;
    }
    try {
      await createBrand({ name });
      setMessage("Brand added successfully!");
      setSuccess(true);
      setName("");
    } catch (err) {
      setMessage(err.message || "Failed to add brand");
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
              className="form-control"
              placeholder="Insert name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button className="btn btn--primary" type="submit">
            Add
          </button>
        </form>
        {message && (
          <div className={success ? "success" : "error"}>{message}</div>
        )}
        <button
          className="btn"
          style={{ marginTop: 16 }}
          onClick={() => navigate("/admin")}
        >
          Back
        </button>
      </div>
    </main>
  );
}

export default AddBrandPage;
