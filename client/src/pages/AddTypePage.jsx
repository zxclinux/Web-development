import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createType } from "../api/device";

function AddTypePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setMessage("Type name is required");
      setSuccess(false);
      return;
    }
    try {
      await createType({ name });
      setMessage("Type added successfully");
      setSuccess(true);
      setName("");
    } catch (err) {
      setMessage(err.message || "Failed to add type");
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
              className="form-control"
              placeholder="Type name"
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

export default AddTypePage;
