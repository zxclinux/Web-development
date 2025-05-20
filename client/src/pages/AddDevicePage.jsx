import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDevice, fetchTypes, fetchBrands } from "../api/device.js";

function AddDevicePage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [brandId, setBrandId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes()
      .then(setTypes)
      .catch(() => setTypes([]));
    fetchBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddInfo = (e) => {
    e.preventDefault();
    setInfo([...info, { title: "", description: "", id: Date.now() }]);
  };

  const handleInfoChange = (idx, field, value) => {
    setInfo(
      info.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveInfo = (idx) => {
    setInfo(info.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    if (!name || !price || !brandId || !typeId || !file) {
      setMessage("Failed to add device");
      setSuccess(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("img", file);
      formData.append("brandId", brandId);
      formData.append("typeId", typeId);
      if (info.length > 0) {
        formData.append(
          "info",
          JSON.stringify(
            info.map(({ title, description }) => ({ title, description }))
          )
        );
      }
      await createDevice(formData);
      setMessage("Device added successfully!");
      setSuccess(true);
      setName("");
      setPrice("");
      setFile(null);
      setBrandId("");
      setTypeId("");
      setInfo([]);
    } catch (err) {
      let msg = "Failed to add device";
      if (err && err.message) msg = err.message;
      setMessage(msg);
      setSuccess(false);
    }
  };

  return (
    <main className="full-height">
      <div className="container" style={{ maxWidth: 400 }}>
        <h1>Add new device</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Device name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select
              className="form-control"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
            >
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select
              className="form-control"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              required
            >
              <option value="">Select type</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group file-upload-row">
            <button
              type="button"
              className="upload-btn"
              onClick={() =>
                document.getElementById("device-file-input").click()
              }
            >
              Upload file
            </button>
            <input
              id="device-file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              required
            />
            <span className="file-name-label">
              {file ? file.name : "Not uploaded"}
            </span>
          </div>
          <div className="info-list">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleAddInfo}
            >
              Add description
            </button>
            {info.map((item, idx) => (
              <div className="info-row" key={item.id}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) =>
                    handleInfoChange(idx, "title", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleInfoChange(idx, "description", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="info-remove-btn"
                  onClick={() => handleRemoveInfo(idx)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn--primary">
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

export default AddDevicePage;
