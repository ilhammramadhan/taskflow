import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TaskCard({ task, onToggleComplete, onDelete, }) {
    const navigate = useNavigate();

    return (
        <div
            className={`
                w-full
                border-2
                rounded-2xl
                p-4 md:p-5
                shadow-sm

                flex items-start justify-between
                gap-4

                transition-all duration-200

                ${
                task.completed
                    ? "bg-[#c7dfeb] border-[#8bbcd3]"
                    : "bg-white border-[#8bbcd3]"
                }
            `}
        >

            {/* LEFT */}
            <div className="flex gap-3 flex-1 min-w-0">

                {/* Checkbox */}
                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`
                        mt-1
                        min-w-6 h-6
                        rounded-md
                        border-2 border-black

                        flex items-center justify-center

                        transition-all

                        ${
                        task.completed
                            ? "bg-white"
                            : "bg-transparent"
                        }
                    `}
                >
                    {task.completed && (
                        <span className="text-xs font-bold">
                        ✓
                        </span>
                    )}
                </button>

                {/* CONTENT */}
                <div className="min-w-0">

                <h2
                    className={`
                    text-lg md:text-xl
                    font-semibold
                    break-words

                    ${
                        task.completed
                        ? "line-through text-gray-500"
                        : "text-orange-500"
                    }
                    `}
                >
                    {task.title}
                </h2>

                <p className="text-sm text-gray-700 mt-2 break-words">
                    Category: {task.category}
                    {" | "}
                    Deadline: {task.deadline || "-"}
                </p>

                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 shrink-0">

                <button
                    onClick={() =>
                        navigate(`/edit-task/${task.id}`)
                    }
                    className="hover:scale-110 transition"
                >
                    <FiEdit2 size={20} />
                </button>

                <button
                    onClick={() => onDelete(task.id)}
                    className="hover:scale-110 transition"
                >
                    <FiTrash2 size={20} />
                </button>

            </div>

        </div>
    );
}

export default TaskCard;