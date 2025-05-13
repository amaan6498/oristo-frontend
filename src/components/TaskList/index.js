import React from "react";
import "./index.css";

const TaskList = ({ tasks, onEdit, onDelete, onComplete }) => {
  const formatDueDate = (dueDate) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const date = new Date(dueDate);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return date.toLocaleDateString();
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <input
            type="radio"
            name={`selectedTask-${task.id}`}
            checked={task.status === "Completed"}
            onChange={() => onComplete(task)}
          />
          <span
            className={`task-title ${
              task.status === "Completed" ? "completed" : ""
            }`}
          >
            {task.title}
          </span>
          <span className="task-date">({formatDueDate(task.duedate)})</span>
          <button className="task-btn edit-btn" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button
            className="task-btn delete-btn"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
