import { useState,useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FiMenu, FiLogOut, FiGrid, FiCheckSquare, FiTag } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuClass = ({ isActive }) =>
    `
        flex items-center
        gap-3
        px-4 py-3
        rounded-xl
        transition-all
        text-sm

        ${sidebarOpen ? "justify-start" : "justify-center"}

        ${
        isActive
            ? "bg-white text-black font-semibold shadow-sm"
            : "hover:bg-white/40"
        }
    `;

    const { logout, user } = useContext(AuthContext);

    const handleLogout = () => {
        logout();

        toast.success(
            "Logout success!"
        );
    };

    return (
        <div className="min-h-screen bg-[#f3efe9]">

            {/* Overlay Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#8bbcd3] border-b border-black/5 z-50">

                <div className="h-full flex items-center justify-between px-4 md:px-6">

                    {/* Left */}
                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="flex items-center justify-center"
                        >
                            <FiMenu size={22} />
                        </button>

                        <h1 className="text-2xl font-bold tracking-tight">
                            TaskFlow
                        </h1>

                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">

                        <p className="hidden sm:block text-sm">
                            Hello, {user?.nama}!
                        </p>

                        <button
                            onClick={handleLogout}
                            className="
                                flex items-center
                                justify-center
                                hover:scale-110
                                transition
                            "
                        >
                            <FiLogOut size={20} />
                        </button>

                    </div>

                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`
                fixed top-16 left-0 z-40
                h-[calc(100vh-64px)]
                bg-[#c7dfeb] border-r border-black/5

                transition-all duration-300
                overflow-hidden

                ${sidebarOpen ? "w-56" : "w-0"}

                md:${sidebarOpen ? "w-56" : "w-20"}
                `}
            >

                <nav className="flex flex-col gap-2 p-3">

                    {/* Dashboard */}
                    <NavLink
                        to="/dashboard"
                        className={menuClass}
                    >
                        <FiGrid size={20} />

                        {sidebarOpen && (
                            <span className="whitespace-nowrap">
                                Dashboard
                            </span>
                        )}
                    </NavLink>

                    {/* Tasks */}
                    <NavLink
                        to="/create-task"
                        className={menuClass}
                    >
                        <FiCheckSquare size={20} />

                        {sidebarOpen && (
                            <span className="whitespace-nowrap">
                                Create Task
                            </span>
                        )}
                    </NavLink>

                    {/* Category */}
                    <NavLink
                        to="/category"
                        className={menuClass}
                    >
                        <FiTag size={20} />

                        {sidebarOpen && (
                            <span className="whitespace-nowrap">
                                Category
                            </span>
                        )}
                    </NavLink>

                </nav>
            </aside>

            {/* Main Content */}
            <main
                className={`
                pt-20 pb-6 px-4 md:px-6
                transition-all duration-300

                ${sidebarOpen ? "md:ml-56" : "md:ml-20"}
                `}
            >
                <Outlet />
            </main>

        </div>
    );
}

export default DashboardLayout;