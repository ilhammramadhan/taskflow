import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axios";

function RegisterPage() {
  useEffect(() => {
    document.title = "Register - TaskFlow";
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/auth/register", {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Register success!");
      navigate("/");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Register gagal"
      );
    } finally {
      setLoading(false);
    }
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
          placeholder="Name"
          name="nama"
          value={formData.nama}
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
          disabled={loading}
          className="bg-[#8bbcd3] text-white py-3 mt-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Register"}
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