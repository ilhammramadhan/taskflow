import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function AuthInput({ type = "text", placeholder, value, onChange, name }) {
    const [show, setShow] = useState(false);

    const isPassword = type === "password";

    return (
        <div className="relative w-full">
            <input
                type={isPassword ? (show ? "text" : "password") : type}
                name={name}
                placeholder={placeholder}
                value={value || ""}
                onChange={onChange}
                className="w-full border-4 border-[#8bbcd3] bg-white px-4 py-3 pr-12 outline-none"
            />

            {isPassword && (
                <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                {show ? <FiEyeOff /> : <FiEye />}
                </button>
            )}
        </div>
    );
}

export default AuthInput;