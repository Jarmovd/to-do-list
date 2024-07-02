import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const initialTasks = [
  {
    id: 1,
    text: "Doctor Appointment 👨‍⚕️",
    completed: true,
  },
  {
    id: 2,
    text: "Meeting at School 🏫",
    completed: false,
  },
];

export default function App() {
  return (
    <div className="App">
      <h1 className="title">TO-DO LIST</h1>
      <div className="container">
        <ToDoList />
      </div>
    </div>
  );
}

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(text) {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleEditTask(id, newText) {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  }

  function handleToggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  function handleClearTasks() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the tasks?"
    );

    if (confirmed) setTasks([]);
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Incomplete") return !task.completed;
    return true; // "All"
  });

  return (
    <>
      <div className="buttons">
        <AddTask onAddTask={handleAddTask} />
        <FilterTask onFilterChange={handleFilterChange} />
      </div>
      <div className="task-list">
        {filteredTasks.map((task) => (
          <ToDoItem
            task={task}
            key={task.id}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>
      <DeleteTasks onDeleteTasks={handleClearTasks} />
    </>
  );
}

function ToDoItem({ task, onDeleteTask, onEditTask, onToggleTask }) {
  const date = new Date();
  const curDate = date.toLocaleString();

  return (
    <div className="task">
      <div className="task-col">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
        />
        <div className="task-text">
          <p style={task.completed ? { textDecoration: "line-through" } : {}}>
            {task.text}
          </p>
          <span>{curDate}</span>
        </div>
      </div>
      <div className="task-buttons">
        <button onClick={() => onDeleteTask(task.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          onClick={() => {
            const newText = prompt("Edit task text:", task.text);
            if (newText) onEditTask(task.id, newText);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
    </div>
  );
}

function AddTask({ onAddTask }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAddTask(text);
    setText("");
  }

  return (
    <form className="task-add" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

function FilterTask({ onFilterChange }) {
  return (
    <select
      className="task-select"
      onChange={(e) => onFilterChange(e.target.value)}
    >
      <option value="All">All</option>
      <option value="Completed">Completed</option>
      <option value="Incomplete">Incomplete</option>
    </select>
  );
}

function DeleteTasks({ onDeleteTasks }) {
  return (
    <button className="task-clear" onClick={onDeleteTasks}>
      Clear list
    </button>
  );
}
