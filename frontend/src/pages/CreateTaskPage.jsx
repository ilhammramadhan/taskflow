import TaskForm from "../components/TaskForm";
import { useEffect } from "react";

function CreateTaskPage() {
  useEffect(() => {
    document.title = "Add Task - TaskFlow";
  }, []);

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">

        <div>

            <h1 className="text-3xl font-bold text-orange-500">
                Add Task
            </h1>

        </div>

        <TaskForm />

    </div>
  );
}

export default CreateTaskPage;