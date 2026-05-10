import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";
import axios from "../utils/axios";

function CategoryPage() {
  useEffect(() => {
    document.title = "Category - TaskFlow";
    fetchCategories();
    fetchTasks();
  }, []);

  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [deleteCategoryName, setDeleteCategoryName] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.data); 
    } catch (err) {
      console.log(err);
    }
  };

  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks");

      setTasks(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Add Category
  const handleAddCategory = async () => {

    if (!categoryInput.trim()) return;

    try {
      await axios.post("/categories", {
        namaCategory: categoryInput,
      });;

      toast.success("Category added!");
      setCategoryInput("");

      fetchCategories(); // refresh list

    } catch (err) {
      toast.error("Gagal tambah category");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (categoryId) => {
    const isUsed = tasks.some(
      (task) => task.category?.id === categoryId
    );

    if (isUsed) {
      toast.error("Category is still used by a task.");
      return;
    }

    try {
      await axios.delete(`/categories/${categoryId}`);

      toast.success("Category deleted!");

      await fetchCategories();
      await fetchTasks();
    } catch (err) {
      toast.error("Gagal delete category");
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8">

      {/* Title */}
      <div>

        <h1 className="text-4xl font-bold text-orange-500">
          Category
        </h1>

      </div>

      {/* Input */}
      <div className="flex gap-3 w-full">

        <input
          type="text"
          placeholder="Category Name"
          value={categoryInput}
          onChange={(e) =>
            setCategoryInput(e.target.value)
          }
          className="
            flex-1
            border-4 border-[#8bbcd3]
            bg-white
            px-4 py-2
            outline-none
          "
        />

        <button
          onClick={handleAddCategory}
          className="
            bg-[#8bbcd3]
            text-white
            px-6
            hover:opacity-90
            transition
          "
        >
          Add
        </button>

      </div>

      {/* Category List */}
      <div className="flex flex-col gap-3 w-full">

        {categories.map((category) => (

          <div
            key={category.id}
            className="
              border-4 border-[#8bbcd3]
              bg-white

              px-4 py-3

              flex items-center
              justify-between
            "
          >

            <span className="text-2xl font-medium">
              {category.namaCategory}
            </span>

            <button
              onClick={() =>
                setDeleteCategoryName(category)
              }
              className="
                hover:scale-110
                transition
              "
            >
              <FiTrash2 size={24} />
            </button>

          </div>

        ))}

      </div>

      {/* Warning */}
      <p className="text-orange-400 text-sm">
        *The category cannot be deleted if it is still in use.
      </p>

      <DeleteModal
        open={deleteCategoryName !== null}
        onClose={() =>
          setDeleteCategoryName(null)
        }
        onConfirm={() => {

          handleDeleteCategory(
            deleteCategoryName.id
          );

          setDeleteCategoryName(null);
        }}
      />

    </div>
  );
}

export default CategoryPage;