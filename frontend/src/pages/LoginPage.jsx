import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const result =
      login(formData);

    if (!result.success) {

      toast.error(
        result.message
      );

      return;
    }

    toast.success(
      "Login success!"
    );

    navigate("/dashboard");
  };

  return (
    <AuthLayout title="TaskFlow">

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          flex flex-col
          gap-4
        "
      >

        <AuthInput
          placeholder="Username / Email"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />

        <AuthInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          name="password"
        />

        <Link
          to="/forgot-password"
          className="
            text-[#8bbcd3]
            text-sm
          "
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          className="
            bg-[#8bbcd3]
            text-white
            py-3
            mt-2
            hover:opacity-90
            transition
          "
        >
          Login
        </button>

        <p className="text-sm text-center">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-orange-500"
          >
            Sign Up
          </Link>

        </p>

      </form>

    </AuthLayout>
  );
}

export default LoginPage;