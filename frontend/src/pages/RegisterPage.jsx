import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import { AuthContext } from "../context/AuthContext";

function RegisterPage() {

  const navigate = useNavigate();

  const { register } = useContext(AuthContext);

  const [formData, setFormData] =
    useState({
      username: "",
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

    const result = register(formData);

    if (!result.success) {

      toast.error(
        result.message
      );

      return;
    }

    toast.success("Register success!");

    navigate("/");
  };

  return (
    <AuthLayout title="Sign Up">

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          flex flex-col
          gap-4
        "
      >
        <AuthInput
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <AuthInput
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <AuthInput
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

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
          Register
        </button>

        <p className="text-sm text-center">
          Have an account?{" "}
          <Link
            to="/"
            className="text-orange-500"
          >
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;