import { useState } from "react";

function TaskForm() {

    // Simulasi category dari database
    const categories = [
        "School",
        "Personal",
        "Work",
    ];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        hasDeadline: false,
        deadline: "",
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                ? checked
                : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);

        alert("Task Created!");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                w-full
                max-w-4xl
                flex flex-col gap-5
            "
        >

            {/* Title */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">

                <label className="text-lg">
                    Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="
                        border-4 border-[#8bbcd3]
                        bg-white
                        px-4 py-2
                        outline-none
                    "
                    required
                />

            </div>

            {/* Description */}
            <div className="grid grid-cols-[120px_1fr] items-start gap-4">

                <label className="text-lg pt-2">
                    Description
                </label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={8}
                    className="
                        border-4 border-[#8bbcd3]
                        bg-white
                        px-4 py-2
                        outline-none
                        resize-none
                    "
                />

            </div>

            {/* Category */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">

                <label className="text-lg">
                    Category
                </label>

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="
                        border-4 border-[#8bbcd3]
                        bg-white
                        px-4 py-2
                        outline-none
                    "
                    required
                >

                    <option value="">
                        Category
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}

                </select>

            </div>

            {/* Deadline Checkbox */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">

                <label className="text-lg">
                    Deadline
                </label>

                <div>

                <input
                    type="checkbox"
                    name="hasDeadline"
                    checked={formData.hasDeadline}
                    onChange={handleChange}
                    className="w-7 h-7 accent-black"
                />

                </div>

            </div>

            {/* Date */}
            {formData.hasDeadline && (

                <div className="grid grid-cols-[120px_1fr] items-center gap-4">

                    <label className="text-lg">
                        Date
                    </label>

                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="
                        border-4 border-[#8bbcd3]
                        bg-white
                        px-4 py-2
                        outline-none
                        "
                    />

                </div>

            )}

            {/* Button */}
            <div className="flex justify-end">

                <button
                    type="submit"
                    className="
                        bg-[#8bbcd3]
                        px-8 py-3
                        text-white
                        text-xl
                        hover:opacity-90
                        transition
                    "
                >
                    Save
                </button>

            </div>

        </form>
    );
}

export default TaskForm;