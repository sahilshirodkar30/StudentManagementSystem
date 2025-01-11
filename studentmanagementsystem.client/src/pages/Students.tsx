import React, { useState, useEffect } from "react";
import api from "../pages/api";
import "./Students.css";


function Students() {
  const [students, setStudents] = useState<
    { id: number; name: string; imageUrl: string | null; classId: number | null }[]
  >([]);
  const [clases, setClases] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<{ name: string; image: File | null; classId: number | null }>({
    name: "",
    image: null,
    classId: null,
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [actionType, setActionType] = useState<"add" | "update" | "delete">("add");
  const [selectedStudent, setSelectedStudent] = useState<
    { id: number; name: string; imageUrl: string | null; classId: number | null } | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await api.get("Students");
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students.");
    }
  };

  const fetchClases = async () => {
    try {
      const response = await api.get("Classes");
      setClases(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch classes.");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClases();
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

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, classId: Number(e.target.value) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image) formData.append("image", form.image);
    if (form.classId !== null) formData.append("classId", form.classId.toString());

    try {
      if (actionType === "update" && selectedStudent) {
        await api.put(`students/${selectedStudent.id}`, formData);
      } else if (actionType === "add") {
        await api.post("students", formData);
      }
      fetchStudents();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Failed to save student.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await api.delete(`students/${selectedStudent.id}`);
      fetchStudents();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Failed to delete student.");
    }
  };

  const openPopup = (
    type: "add" | "update" | "delete",
    student?: { id: number; name: string; imageUrl: string | null; classId: number | null }
  ) => {
    setActionType(type);
    setSelectedStudent(student || null);
    setForm({
      name: student?.name || "",
      image: null,
      classId: student?.classId || null,
    });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedStudent(null);
    setForm({ name: "", image: null, classId: null });
  };

  return (
    <div className="container">
      <h1>Students</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary" onClick={() => openPopup("add")}>Add Student</button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                {student.imageUrl && (
                  <img
                    src={student.imageUrl}
                    alt={student.name}
                    className="student-image"
                  />
                )}
              </td>
              <td>{clases.find((cls) => cls.id === student.classId)?.name || "N/A"}</td>
              <td>
                <button className="btn btn-warning" onClick={() => openPopup("update", student)}>Update</button>
                <button className="btn btn-danger" onClick={() => openPopup("delete", student)}>Delete</button>
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
                <p>Are you sure you want to delete {selectedStudent?.name}?</p>
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
                <div className="mb-3">
                  <label>Image</label>
                  <input type="file" onChange={handleFileChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label>Class</label>
                  <select
                    name="classId"
                    value={form.classId || ""}
                    onChange={handleDropdownChange}
                    className="form-control"
                    required
                  >
                    <option value="" disabled>Select a class</option>
                    {clases.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
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

export default Students;
