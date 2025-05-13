import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import TaskList from "../TaskList";
import Navbar from "../Navbar";
import "./index.css";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // url for localhost http://localhost:5000/getAllTasks
        const response = await fetch(
          "https://oristo-api.onrender.com/getAllTasks"
        );
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = (id) => {
    console.log(id);
    fetch(`http://localhost:5000/deleteTask/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsEditing(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/updateTask/${editTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editTask),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setTasks((prev) =>
          prev.map((t) => (t.id === editTask.id ? editTask : t))
        );
        setIsEditing(false);
        setEditTask(null);
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  const handleComplete = (task) => {
    const updatedTask = { ...task, status: "Completed" };

    fetch(`http://localhost:5000/updateTask/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? updatedTask : t))
        );
      })
      .catch((err) => console.error("Error completing task:", err));
  };

  const isSameDate = (date1, date2) => {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  };

  const tasksDueToday = tasks.filter((task) =>
    isSameDate(task.duedate, selectedDate)
  );
  console.log(tasksDueToday);

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <div className="home-container">
        <div className="first-container">
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <h2 className="heading">Due Today</h2>

          <div className="task-list">
            {tasksDueToday.length > 0 ? (
              tasksDueToday.map((task) => (
                <div className="task-item" key={task.id}>
                  <input
                    type="radio"
                    name={`selectedTaskToday-${task.id}`}
                    checked={task.status === "Completed"}
                    onChange={() => handleComplete(task)}
                  />
                  <span
                    className={`task-title ${
                      task.status === "Completed" ? "completed" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="task-date">
                    ({task.duedate.split("T")[0]})
                  </span>
                  <button
                    className="task-btn edit-btn"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="task-btn delete-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div>No tasks due today</div>
            )}
          </div>
        </div>

        <div className="second-container">
          <h2 className="heading">All Tasks</h2>
          <TaskList
            tasks={tasks.filter((task) =>
              task.title.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onComplete={handleComplete}
          />
        </div>

        {isEditing && (
          <div className="overlay">
            <div className="edit-form">
              <h2>Edit Task</h2>
              <form onSubmit={handleUpdateSubmit}>
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  placeholder="Task Title"
                />

                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>

                <label htmlFor="edit-duedate">Due Date</label>
                <input
                  id="edit-duedate"
                  type="date"
                  value={editTask.duedate?.split("T")[0]}
                  onChange={(e) =>
                    setEditTask({ ...editTask, duedate: e.target.value })
                  }
                />

                <div className="btn-group">
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
