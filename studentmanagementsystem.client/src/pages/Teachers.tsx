import React, { useState, useEffect } from "react";
import api from "../pages/api"; // Replace with the actual API service
import "./Students.css";

function Teachers() {
  const [teachers, setTeachers] = useState<
    { id: number; name: string; imageUrl: string | null }[]
  >([]);
  const [form, setForm] = useState<{ name: string; image: File | null }>({
    name: "",
    image: null,
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [actionType, setActionType] = useState<"add" | "update" | "delete">(
    "add"
  );
  const [selectedTeacher, setSelectedTeacher] = useState<{
    id: number;
    name: string;
    imageUrl: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTeachers = async () => {
    try {
      const response = await api.get("Teachers");
      setTeachers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch teachers.");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image) formData.append("image", form.image);

    try {
      if (actionType === "update" && selectedTeacher) {
        await api.put(`Teachers/${selectedTeacher.id}`, formData);
      } else if (actionType === "add") {
        await api.post("Teachers", formData);
      }
      fetchTeachers();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Failed to save teacher.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    try {
      await api.delete(`Teachers/${selectedTeacher.id}`);
      fetchTeachers();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Failed to delete teacher.");
    }
  };

  const openPopup = (
    type: "add" | "update" | "delete",
    teacher?: { id: number; name: string; imageUrl: string | null }
  ) => {
    setActionType(type);
    setSelectedTeacher(teacher || null);
    setForm({
      name: teacher?.name || "",
      image: null,
    });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedTeacher(null);
    setForm({ name: "", image: null });
  };

  return (
    <div className="container">
      <h1>Teachers</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary" onClick={() => openPopup("add")}>
        Add Teacher
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.name}</td>
              <td>
                {teacher.imageUrl && (
                  <img
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    className="teacher-image"
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => openPopup("update", teacher)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => openPopup("delete", teacher)}
                >
                  Delete
                </button>
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
                <p>
                  Are you sure you want to delete {selectedTeacher?.name}?
                </p>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
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
                <div className="mb-3">
                  <label>Image</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {actionType === "update" ? "Update" : "Add"}
                </button>
              </form>
            )}
            <button className="btn btn-secondary" onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
