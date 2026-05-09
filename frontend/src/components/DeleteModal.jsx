function DeleteModal({ open, onClose, onConfirm }) {

    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0 z-[100]
                bg-black/40

                flex items-center
                justify-center

                px-4
            "
        >

            {/* Modal */}
            <div
                className="
                bg-white
                w-full
                max-w-md

                rounded-2xl
                p-6

                shadow-xl
                animate-[fadeIn_.2s_ease]
                "
            >

                {/* Title */}
                <h2 className="text-2xl font-bold text-red-500">
                    Delete Task
                </h2>

                {/* Desc */}
                <p className="mt-3 text-gray-600">
                    Are you sure you want to delete this task?
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-8">

                    {/* Cancel */}
                    <button
                        onClick={onClose}
                        className="
                        px-5 py-2
                        rounded-xl

                        border border-gray-300
                        hover:bg-gray-100
                        transition
                        "
                    >
                        Cancel
                    </button>

                    {/* Delete */}
                    <button
                        onClick={onConfirm}
                        className="
                        px-5 py-2
                        rounded-xl

                        bg-red-500
                        text-white

                        hover:bg-red-600
                        transition
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DeleteModal;