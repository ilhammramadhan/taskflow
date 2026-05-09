import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import CategoryPage from "./pages/CategoryPage";

import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-task" element={<CreateTaskPage />} />
          <Route path="/category" element={<CategoryPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

fun

export default App;