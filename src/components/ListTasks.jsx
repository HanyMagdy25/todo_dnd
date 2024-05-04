import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    const ftodos = tasks.filter((task) => task.status === "todo");
    const fInProgress = tasks.filter((task) => task.status === "inProgress");
    const fClosed = tasks.filter((task) => task.status === "closed");
    setTodos(ftodos);
    setInProgress(fInProgress);
    setClosed(fClosed);
  }, [tasks]);

  const statuses = ["todo", "inProgress", "closed"];
  return (
    <div className="flex gap-16">
      {statuses.map((status) => (
        <Section
          key={status}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = "todo";
  let bg = "bg-slate-500";
  let tasksToMap = todos;

  if (status === "inProgress") {
    text = "inProgress";
    bg = "bg-yellow-500";
    tasksToMap = inProgress;
  }
  if (status === "closed") {
    text = "closed";
    bg = "bg-green-500";
    tasksToMap = closed;
  }

  const addItemToSection = (id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status: status,
          };
        }
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      toast("Task moved ", { icon: "👍" });
      return updatedTasks;
    });
  };
  return (
    <div
      className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-200" : ""} `}
      ref={drop}
    >
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};
const Header = ({ text, bg, count }) => {
  return (
    <div>
      <h2
        className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase
      text-sm font-bold text-white`}
      >
        {text}{" "}
        <div
          className="ml-2 bg-white w-5 h-5 text-black rounded-full
        flex justify-center items-center "
        >
          {count}
        </div>
      </h2>
    </div>
  );
};
const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  console.log(isDragging);
  const handleRemove = (id) => {
    const fTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(fTasks));
    setTasks(fTasks);
    toast.success("Task removed");
  };
  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md rounded-md 
      cursor-grab ${isDragging ? "opacity-25" : "opacity-100"}`}
    >
      <p>{task.name}</p>
      <button
        className="absolute bottom-1 right-1 text-slate-400"
        onClick={() => handleRemove(task.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
