import React, { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { CiSearch } from "react-icons/ci"; // <-- Import search icon
import "./index.css";

const Navbar = ({ onSearch }) => {
  const [showForm, setShowForm] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // <-- NEW STATE
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    status: "",
  });

  const toggleForm = () => setShowForm(!showForm);
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch); // <-- NEW

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // url for local host http://localhost:5000/createTask
      const response = await fetch(
        "https://oristo-api.onrender.com/createTask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to create task");

      const result = await response.json();
      console.log("Task created:", result);

      setShowForm(false);
      setFormData({
        id: "",
        title: "",
        startDate: "",
        dueDate: "",
        status: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err.message);
    }
  };

  return (
    <>
      <div className="nav-container">
        <h1 className="nav-header">Organizo.</h1>
        <nav className="nav-wrap">
          {/* Desktop search */}
          <input
            type="search"
            placeholder="search..."
            className="input-nav desktop-only"
            onChange={handleSearchChange}
          />

          {/* Create button */}
          <button
            type="button"
            className="nav-button desktop-only"
            onClick={toggleForm}
          >
            + Create
          </button>

          {/* Mobile icons */}
          <button
            type="button"
            className="mobile-icon mobile-only"
            onClick={toggleMobileSearch}
          >
            <CiSearch />
          </button>
          <button
            type="button"
            className="mobile-icon mobile-only"
            onClick={toggleForm}
          >
            <CiSquarePlus />
          </button>
        </nav>
      </div>

      {/* Mobile search input field - shown below nav */}
      {showMobileSearch && (
        <div className="mobile-search-bar mobile-only">
          <input
            type="search"
            placeholder="search..."
            className="input-nav full-width"
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Task</h2>
            <form className="task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="Title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="due-date">Due Date</label>
                <input
                  id="due-date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  type="date"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={toggleForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
