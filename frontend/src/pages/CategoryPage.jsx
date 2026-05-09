import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

function CategoryPage() {
  // Simulasi task yang memakai category
  const tasks = [
  {
    id: 1,
    category: "School",
  },
  ];

  const [categoryInput, setCategoryInput] = useState("");

  const [categories, setCategories] = useState([
    "School",
    "Personal",
  ]);

  // Add Category
  const handleAddCategory = () => {

    const trimmed = categoryInput.trim();

    // kosong
    if (!trimmed) return;

    // duplicate
    const alreadyExists =
      categories.some(
        (cat) =>
          cat.toLowerCase() ===
          trimmed.toLowerCase()
      );

    if (alreadyExists) {
      alert("Category already exists");
      return;
    }

    setCategories([
      ...categories,
      trimmed,
    ]);

    setCategoryInput("");
  };

  // Delete Category
  const handleDeleteCategory = (
    categoryName
  ) => {

    // cek apakah dipakai task
    const isUsed = tasks.some(
      (task) =>
        task.category === categoryName
    );

    if (isUsed) {
      alert(
        "Category cannot be deleted because it is still in use."
      );

      return;
    }

    setCategories(
      categories.filter(
        (cat) => cat !== categoryName
      )
    );
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Title */}
      <div>

        <h1 className="text-4xl font-bold text-orange-500">
          Category
        </h1>

      </div>

      {/* Input */}
      <div className="flex gap-3 max-w-3xl">

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
      <div className="flex flex-col gap-3 max-w-3xl">

        {categories.map((category) => (

          <div
            key={category}
            className="
              border-4 border-[#8bbcd3]
              bg-white

              px-4 py-3

              flex items-center
              justify-between
            "
          >

            <span className="text-2xl font-medium">
              {category}
            </span>

            <button
              onClick={() =>
                handleDeleteCategory(category)
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

    </div>
  );
}

export default CategoryPage;