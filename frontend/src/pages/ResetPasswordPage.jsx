import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";

function ResetPasswordPage() {

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
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

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            toast.error(
                "Password does not match"
            );

            return;
        }

        toast.success( "Password updated!");
    };

  return (
    <AuthLayout title="Reset Password">

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          flex flex-col
          gap-4
        "
      >

        <AuthInput
          type="password"
          placeholder="New Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <AuthInput
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="
            bg-[#8bbcd3]
            text-white

            py-3

            hover:opacity-90
            transition
          "
        >
          Submit
        </button>

      </form>

    </AuthLayout>
  );
}

export default ResetPasswordPage;