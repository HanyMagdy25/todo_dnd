import { useState } from "react";
import toast from "react-hot-toast";
import { v4 } from "uuid";
const CreateTasks = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.length < 3)
      return toast.error("A task must have 3 or more characters");

    if (task.name.length > 100)
      return toast.error("A task must not be more than 100 characters");

    setTasks((prev) => {
      const list = [...prev, task];
      localStorage.setItem("tasks", JSON.stringify(list));
      return list;
    });
    toast.success("Task added");
    setTask({
      id: "",
      name: "",
      status: "todo",
    });
  };
  console.log(tasks);
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-slate-400 bg-slate-100 rounded-md 
         mr-4 h-12 w-64 px-1 "
        value={task.name}
        onChange={(e) => setTask({ ...task, id: v4(), name: e.target.value })}
      />
      <button
        type="submit"
        className="bg-cyan-500 rounded-md px-4 h-12 text-white "
      >
        Add Task
      </button>
    </form>
  );
};

export default CreateTasks;
