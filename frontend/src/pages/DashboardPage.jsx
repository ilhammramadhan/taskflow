import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";
import DeleteModal from "../components/DeleteModal";

function DashboardPage() {

    const {
        tasks,
        toggleTask,
        deleteTask,
        updateTask
    } = useContext(TaskContext);

    const [categoryFilter, setCategoryFilter] = useState("All");

    const [deadlineFilter, setDeadlineFilter] = useState("All");

    // Filter category + deadline
    const filteredTasks = tasks.filter((task) => {

        const categoryMatch =
        categoryFilter === "All" ||
        task.category === categoryFilter;

        const deadlineMatch =
        deadlineFilter === "All" ||

        (deadlineFilter === "With Deadline" &&
            task.deadline !== "") ||

        (deadlineFilter === "No Deadline" &&
            task.deadline === "");

        return categoryMatch && deadlineMatch;
    });

    const [deleteId, setDeleteId] = useState(null);

    return (
        <div className="w-full max-w-6xl flex flex-col gap-6">

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
                        onChange={(e) =>
                        setCategoryFilter(e.target.value)
                        }
                        className="
                        border-2 border-[#8bbcd3]
                        rounded-lg
                        px-4 py-2 bg-white
                        min-w-[140px]
                        "
                    >
                        <option>All</option>
                        <option>School</option>
                        <option>Personal</option>
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

            {/* Task List */}
            <div className="flex flex-col gap-4">

                {filteredTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleTask}
                        onDelete={(id) => setDeleteId(id)}
                        onUpdate={updateTask}
                    />
                ))}

                {filteredTasks.length === 0 && (
                    <div className="text-gray-500">
                        No tasks found.
                    </div>
                )}

            </div>

            <DeleteModal
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    deleteTask(deleteId);
                    setDeleteId(null);
                }}
            />

        </div>
    );
}

export default DashboardPage;