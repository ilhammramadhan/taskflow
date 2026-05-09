import { createContext, useEffect, useState, } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    // load login session
    useEffect(() => {

        const storedUser =
        localStorage.getItem("taskflow_user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);

    // REGISTER
    const register = ({ username, email, password }) => {

        const users = JSON.parse(
            localStorage.getItem(
                "taskflow_users"
            )
        ) || [];

        // cek email duplicate
        const exists = users.some(
            (user) => user.email === email
        );

        if (exists) {
            return {
                success: false,
                message:
                "Email already registered",
            };
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
        };

        localStorage.setItem(
            "taskflow_users",
            JSON.stringify([
                ...users,
                newUser,
            ])
        );

        return {
            success: true,
        };
    };

    // LOGIN
    const login = ({ email, password }) => {

        const users = JSON.parse(
            localStorage.getItem(
            "taskflow_users"
            )
        ) || [];

        const foundUser = users.find(
            (user) =>
            user.email === email &&
            user.password === password
        );

        if (!foundUser) {
            return {
                success: false,
                message:
                "Invalid email or password",
            };
        }

        setUser(foundUser);

        localStorage.setItem(
            "taskflow_user",
            JSON.stringify(foundUser)
        );

        return {
            success: true,
        };
    };

    // LOGOUT
    const logout = () => {

        setUser(null);

        localStorage.removeItem(
            "taskflow_user"
        );
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}