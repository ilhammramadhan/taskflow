import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import CategoryPage from "./pages/CategoryPage";
import EditTaskPage from "./pages/EditTaskPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <Routes>

        {/* Public */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/create-task"
            element={<CreateTaskPage />}
          />

          <Route
            path="/edit-task/:id"
            element={<EditTaskPage />}
          />

          <Route
            path="/category"
            element={<CategoryPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;