import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
  });
  const [isEditMode, setIsEditMode] = useState(false); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get("https://taskmanagement-backend-b267.onrender.com/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const handleSaveTask = async () => {
    if (!currentTask.title.trim() || !currentTask.description.trim()) {
      alert("Both title and description are required!");
      return;
    }

    try {
      if (isEditMode) {
        const response = await axios.put(
          `https://taskmanagement-backend-b267.onrender.com/api/tasks/${currentTask._id}`,
          currentTask
        );
        setTasks(
          tasks.map((task) =>
            task._id === currentTask._id ? response.data : task
          )
        );
      } else {
        const response = await axios.post(
          "https://taskmanagement-backend-b267.onrender.com/api/tasks",
          currentTask
        );
        setTasks([...tasks, response.data]);
      }

      setCurrentTask({ title: "", description: "" });
      setIsEditMode(false);
      setShowModal(false);
    } catch (error) {
      console.error(
        isEditMode ? "Error updating task:" : "Error adding task:",
        error
      );
    }
  };

  const handleEditTask = (task) => {
    setCurrentTask(task); 
    setIsEditMode(true);
    setShowModal(true); 
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://taskmanagement-backend-b267.onrender.com/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <h1 className="text-center mb-4">Task Management</h1>

        {tasks.length === 0 ? (
          <div className="text-center">
            <p>No tasks added yet.</p>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-success"
                onClick={() => {
                  setCurrentTask({ title: "", description: "" });
                  setIsEditMode(false);
                  setShowModal(true);
                }}
              >
                <FaPlus className="me-2" />
                Add Task
              </button>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <button
                        className="btn btn-sm me-3"
                        onClick={() => handleEditTask(task)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => deleteTask(task._id)}
                      >
                        <FaTrash color="red" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-success"
                onClick={() => {
                  setCurrentTask({ title: "", description: "" }); 
                  setIsEditMode(false);
                  setShowModal(true);
                }}
              >
                <FaPlus className="me-2" />
                Add Task
              </button>
            </div>
          </div>
        )}

        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          tabIndex="-1"
          style={{ display: showModal ? "block" : "none" }}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {isEditMode ? "Edit Task" : "Add New Task"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={currentTask.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={currentTask.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveTask}
                >
                  {isEditMode ? "Update Task" : "Save Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
