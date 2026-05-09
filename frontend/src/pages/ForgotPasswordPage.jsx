import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";

function ForgotPasswordPage() {

    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        toast.success(
        "Reset link sent!"
        );
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
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
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

export default ForgotPasswordPage;