import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CategoryContext = createContext();

export function CategoryProvider({ children, }) {

    const { currentUser } = useContext(AuthContext);

    const [categories, setCategories] =
        useState(() => {

            const savedCategories =
                localStorage.getItem(
                    "categories"
                );

            return savedCategories
                ? JSON.parse(savedCategories)
                : [];
        });

    // Save localStorage
    useEffect(() => {

        localStorage.setItem(
            "categories",
            JSON.stringify(categories)
        );

    }, [categories]);

    // Add Category
    const addCategory = (
        categoryName
    ) => {

        const trimmed =
            categoryName.trim();

        if (!trimmed) return;

        // Duplicate hanya user login
        const exists =
            categories.some(
                (category) =>
                    category.userId ===
                        currentUser?.id &&
                    category.name.toLowerCase() ===
                        trimmed.toLowerCase()
            );

        if (exists) return;

        const newCategory = {
            id: Date.now(),

            userId:
                currentUser?.id,

            name: trimmed,
        };

        setCategories((prev) => [
            ...prev,
            newCategory,
        ]);
    };

    // Delete Category
    const deleteCategory = (
        categoryId
    ) => {

        setCategories((prev) =>
            prev.filter(
                (category) =>
                    category.id !==
                    categoryId
            )
        );
    };

    // Category milik user login
    const userCategories =
        categories.filter(
            (category) =>
                category.userId ===
                currentUser?.id
        );

    return (
        <CategoryContext.Provider
            value={{
                categories:
                    userCategories,

                addCategory,

                deleteCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
}