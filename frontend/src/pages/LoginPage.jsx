import { useContext, useState, useEffect  } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axios";

function LoginPage() {
  useEffect(() => {
    document.title = "Login - TaskFlow";
  }, []);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("taskflow_user", JSON.stringify(user));

      setUser(user);

      toast.success("Login success!");
      navigate("/dashboard");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login gagal"
      );
    } finally {
      setLoading(false);
    }
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
          placeholder="Email"
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

        <button
          type="submit"
          disabled={loading}
          className="bg-[#8bbcd3] text-white py-3 mt-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
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