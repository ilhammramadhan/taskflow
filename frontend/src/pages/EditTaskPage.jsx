import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import axios from "../utils/axios";

function EditTaskPage() {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        fetchTaskDetail();
        document.title = "Edit Task - TaskFlow";
    }, []);

    const fetchTaskDetail = async () => {
        try {
            const res = await axios.get(`/tasks/${id}`);
            setTask(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-orange-500">
                Edit Task
            </h1>

            <TaskForm editTask={task} />
        </div>
    );
}

export default EditTaskPage;