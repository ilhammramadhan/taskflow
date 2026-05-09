import { useContext, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { CategoryContext } from "../context/CategoryContext";
import { TaskContext } from "../context/TaskContext";
import DeleteModal from "../components/DeleteModal";
import toast from "react-hot-toast";

function CategoryPage() {

  const { categories, addCategory, deleteCategory } = useContext(CategoryContext);

  const [categoryInput, setCategoryInput] = useState("");

  const [deleteCategoryName, setDeleteCategoryName] = useState(null);

  const { tasks } = useContext(TaskContext);

  // Add Category
  const handleAddCategory = () => {

    if (!categoryInput.trim())
      return;

    addCategory(categoryInput);

    toast.success("Category added!");

    setCategoryInput("");
  };

  // Delete Category
  const handleDeleteCategory = (categoryId) => {

    // cari category berdasarkan id
    const category = categories.find(
      (cat) => cat.id === categoryId
    );

    // cek apakah dipakai task
    const isUsed = tasks.some(
      (task) =>
        task.category === category.name
    );

    if (isUsed) {
      toast.error(
        "Category is still used by a task."
      );
      return;
    }

    deleteCategory(categoryId);

    toast.success("Category deleted!");
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
              {category.name}
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