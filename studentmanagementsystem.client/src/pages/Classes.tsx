import React, { useState, useEffect } from "react";
import api from "../pages/api"; // Adjust the API path as per your setup
import "./Students.css"; // Adjust the CSS file as per your styling

function Classes() {
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<{ name: string }>({ name: "" });
  const [popupVisible, setPopupVisible] = useState(false);
  const [actionType, setActionType] = useState<"add" | "update" | "delete">("add");
  const [selectedClass, setSelectedClass] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    try {
      const response = await api.get("Classes");
      setClasses(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch classes.");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (actionType === "update" && selectedClass) {
        await api.put(`Classes/${selectedClass.id}`, form);
      } else if (actionType === "add") {
        await api.post("Classes", form);
      }
      fetchClasses();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Failed to save class.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;
    try {
      await api.delete(`Classes/${selectedClass.id}`);
      fetchClasses();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Failed to delete class.");
    }
  };

  const openPopup = (
    type: "add" | "update" | "delete",
    classData?: { id: number; name: string }
  ) => {
    setActionType(type);
    setSelectedClass(classData || null);
    setForm({ name: classData?.name || "" });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedClass(null);
    setForm({ name: "" });
  };

  return (
    <div className="container">
      <h1>Classes</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary" onClick={() => openPopup("add")}>Add Class</button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.name}</td>
              <td>
                <button className="btn btn-warning" onClick={() => openPopup("update", cls)}>Update</button>
                <button className="btn btn-danger" onClick={() => openPopup("delete", cls)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            {actionType === "delete" ? (
              <>
                <p>Are you sure you want to delete {selectedClass?.name}?</p>
                <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                  Yes, Delete
                </button>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {actionType === "update" ? "Update" : "Add"}
                </button>
              </form>
            )}
            <button className="btn btn-secondary" onClick={closePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
