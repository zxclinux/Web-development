import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "ADMIN") {
        navigate("/users");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <main className="main-section">
      <div className="buttons">
        <button
          className="btn btn--primary"
          onClick={() => navigate("/add-type")}
        >
          Add new type
        </button>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/add-brand")}
        >
          Add new brand
        </button>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/add-product")}
        >
          Add new device
        </button>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/admin/users")}
        >
          User listing
        </button>
      </div>
    </main>
  );
}

export default AdminPage;
