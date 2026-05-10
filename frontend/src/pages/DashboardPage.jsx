import TaskCard from "../components/TaskCard";
import DeleteModal from "../components/DeleteModal";
import { useEffect, useState } from "react";
import axios from "../utils/axios";

function DashboardPage() {

    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [deadlineFilter, setDeadlineFilter] = useState("All");
    const [error, setError] = useState(null);

    useEffect(() => {
        init();
        document.title = "Dashboard - TaskFlow";
    }, []);

    const init = async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([
                fetchTasks(),
                fetchCategories()
            ]);
        } catch (err) {
            setError("Gagal load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get("/tasks");
            const normalized = (res.data?.data || []).map((t) => ({
                ...t,
                completed: t.status === "SELESAI", // mapping
            }));

            setTasks(normalized);
        } catch (err) {
            console.log(err);
            setError(prev => prev || "Gagal ambil tasks");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/categories");
            setCategories(res.data?.data || []);
        } catch (err) {
            console.log(err);
            setError(prev => prev || "Gagal ambil categories");
        }
    }; 

    // Filter category + deadline
    const filteredTasks = tasks.filter((task) => {

        const categoryMatch =
            categoryFilter === "All" ||
            task.category?.namaCategory === categoryFilter;

        const hasDeadline = task.deadline !== null && task.deadline !== "";

        const deadlineMatch =
            deadlineFilter === "All" ||
            (deadlineFilter === "With Deadline" && hasDeadline) ||
            (deadlineFilter === "No Deadline" && !hasDeadline);

        return categoryMatch && deadlineMatch;
    });

    const deleteTask = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`/tasks/${id}`);
            await fetchTasks();
        } catch (err) {
            setError("Gagal delete task");
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id) => {
        try {
            setTasks((prev) =>
            prev.map((t) =>
                t.id === id
                ? {
                    ...t,
                    completed: !t.completed,
                    status: !t.completed ? "SELESAI" : "BELUM",
                    }
                : t
            )
            );

            await axios.patch(`/tasks/${id}/toggle`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full max-w-6xl flex flex-col gap-6">
            {error && (
                <div className="text-red-500">
                    {error}
                </div>
            )}

            {/* Title */}
            <div>

                <h1 className="text-3xl md:text-4xl font-bold text-orange-500">
                    Task List
                </h1>

            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-6 items-center">

                {/* Category */}
                <div className="flex items-center gap-3">

                    <label className="text-sm font-medium">
                        Category
                    </label>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="
                            border-2 border-[#8bbcd3]
                            rounded-lg
                            px-4 py-2 bg-white
                        "
                    >
                        <option value="All">All</option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.namaCategory}>
                            {cat.namaCategory}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Deadline */}
                <div className="flex items-center gap-3">

                    <label className="text-sm font-medium">
                        Deadline
                    </label>

                    <select
                        value={deadlineFilter}
                        onChange={(e) =>
                        setDeadlineFilter(e.target.value)
                        }
                        className="
                        border-2 border-[#8bbcd3]
                        rounded-lg
                        px-4 py-2 bg-white
                        min-w-[180px]
                        "
                    >
                        <option>All</option>
                        <option>With Deadline</option>
                        <option>No Deadline</option>
                    </select>

                </div>

            </div>

            <DeleteModal
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    deleteTask(deleteId);
                    setDeleteId(null);
                }}
            />

            <div className="flex flex-col gap-4">

                {loading ? (
                    <div>Loading...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-gray-500">
                    No tasks found.
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleTask}
                        onDelete={setDeleteId}
                    />
                    ))
                )}

            </div>

        </div>
    );
}

export default DashboardPage;