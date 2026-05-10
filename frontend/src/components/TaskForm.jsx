import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axios";

function TaskForm({ editTask = null }) {

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        hasDeadline: false,
        deadline: "",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editTask) {
            setFormData({
                title: editTask.judul || "",
                description: editTask.deskripsi || "",
                category: editTask.category?.id || "",
                hasDeadline: !!editTask.deadline,
                deadline: editTask.deadline
                    ? editTask.deadline.split("T")[0]
                    : "",
            });
        }
    }, [editTask]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/categories");

            setCategories(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const taskData = {
                judul: formData.title,
                deskripsi: formData.description || "",
                deadline:
                    formData.hasDeadline && formData.deadline
                        ? new Date(formData.deadline).toISOString()
                        : null,
                categoryId: formData.category
                    ? Number(formData.category)
                    : null,
            };

            if (editTask) {
                await axios.put(`/tasks/${editTask.id}`, taskData);

                toast.success("Task updated!");
            } else {
                await axios.post("/tasks", taskData);

                toast.success("Task created!");
            }

            navigate("/dashboard");

        } catch (err) {
            toast.error("Gagal save task");
            console.log(err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                w-full
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
                            key={category.id}
                            value={category.id}
                        >
                            {category.namaCategory}
                        </option>
                    ))}

                </select>

            </div>

            {/* Deadline */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">

                <label className="text-lg">
                    Deadline
                </label>

                <div>

                    <input
                        type="checkbox"
                        name="hasDeadline"
                        checked={
                            formData.hasDeadline
                        }
                        onChange={handleChange}
                        className="
                            w-6 h-6
                            accent-black
                        "
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