import { useState } from "react";
import TaskCard from "../components/TaskCard";

function DashboardPage() {

    // Simulasi user login
    const currentUser = "user123";

    const initialTasks = [
        {
            id: 1,
            user: "user123",
            title: "Belajar Matematika",
            category: "School",
            deadline: "",
            completed: false,
        },
        {
            id: 2,
            user: "user123",
            title: "Tugas Melukis",
            category: "School",
            deadline: "April 1, 2026",
            completed: true,
        },
        {
            id: 3,
            user: "user123",
            title: "Mencuci Sepatu",
            category: "Personal",
            deadline: "",
            completed: false,
        },
        {
            id: 4,
            user: "anotherUser",
            title: "Hidden Task",
            category: "Work",
            deadline: "",
            completed: false,
        },
    ];

    const [tasks, setTasks] = useState(initialTasks);

    const [categoryFilter, setCategoryFilter] = useState("All");

    const [deadlineFilter, setDeadlineFilter] = useState("All");

    // Filter task sesuai user login
    const userTasks = tasks.filter(
        (task) => task.user === currentUser
    );

    // Filter category + deadline
    const filteredTasks = userTasks.filter((task) => {

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

    // Toggle complete
    const handleToggleComplete = (id) => {
        setTasks((prev) =>
        prev.map((task) =>
            task.id === id
            ? {
                ...task,
                completed: !task.completed,
                }
            : task
        )
        );
    };

    // Delete task
    const handleDelete = (id) => {
        setTasks((prev) =>
        prev.filter((task) => task.id !== id)
        );
    };

    return (
        <div className="flex flex-col gap-6">

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
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDelete}
                    />
                ))}

                {filteredTasks.length === 0 && (
                    <div className="text-gray-500">
                        No tasks found.
                    </div>
                )}

            </div>

        </div>
    );
}

export default DashboardPage;