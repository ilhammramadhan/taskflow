import { useContext, createContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

export function TaskProvider({ children }) {

    const { currentUser } = useContext(AuthContext);

    const [tasks, setTasks] =
        useState(() => {

            const savedTasks =
                localStorage.getItem("tasks");

            return savedTasks
                ? JSON.parse(savedTasks)
                : [];
        });

    // Save ke localStorage
    useEffect(() => {

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

    }, [tasks]);

    // Add Task
    const addTask = (taskData) => {

        const newTask = {
            id: Date.now(),

            // task milik user login
            userId: currentUser.id,

            completed: false,

            ...taskData,
        };

        setTasks((prev) => [
            ...prev,
            newTask,
        ]);
    };

    // Toggle Complete
    const toggleTask = (id) => {

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        completed:
                            !task.completed,
                    }
                    : task
            )
        );
    };

    // Delete Task
    const deleteTask = (id) => {

        setTasks((prev) =>
            prev.filter(
                (task) =>
                    task.id !== id
            )
        );
    };

    // Update Task
    const updateTask = (
        id,
        updatedData
    ) => {

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        ...updatedData,
                    }
                    : task
            )
        );
    };

    // Hanya task milik user login
    const userTasks =
        tasks.filter(
            (task) =>
                task.userId ===
                currentUser?.id
        );

    return (
        <TaskContext.Provider
            value={{
                tasks: userTasks,
                addTask,
                toggleTask,
                deleteTask,
                updateTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}