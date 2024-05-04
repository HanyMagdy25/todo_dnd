import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import CreateTasks from "./components/CreateTasks";
import ListTasks from "./components/ListTasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    setTasks(
      localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks"))
        : []
    );
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div
        className="bg-slate-100 w-screen h-screen flex flex-col 
       items-center p-3 pt-32 gap-16"
      >
        <CreateTasks tasks={tasks} setTasks={setTasks} />
        <ListTasks tasks={tasks} setTasks={setTasks} />
      </div>
    </DndProvider>
  );
}

export default App;
