function AuthInput({ type = "text", placeholder, value, onChange, name }) {
    return (
        <input
            type={type}
            name={name} 
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="
                w-full
                border-4 border-[#8bbcd3]
                bg-white
                px-4 py-3
                outline-none
            "
        />
    );
}

export default AuthInput;