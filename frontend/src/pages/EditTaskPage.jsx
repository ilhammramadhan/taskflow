import { useContext } from "react";
import { useParams } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import TaskForm from "../components/TaskForm";
import toast from "react-hot-toast";

function EditTaskPage() {

    const { id } = useParams();

    const { tasks } = useContext(TaskContext);

    const task = tasks.find(
        (task) => task.id === Number(id)
    );

    if (!task) {
        return (
            <div>
                Task not found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">

        <div>

            <h1 className="text-3xl font-bold text-orange-500">
                Edit Task
            </h1>

        </div>

        <TaskForm editTask={task} />

        </div>
    );
}

export default EditTaskPage;