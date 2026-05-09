function AuthLayout({ title, children }) {
    return (
        <div
            className="
                min-h-screen
                bg-[#f3efe9]

                flex items-center
                justify-center

                px-4
            "
        >
            <div
                className="
                    w-full
                    max-w-md

                    bg-[#f3efe9]

                    flex flex-col
                    items-center

                    py-12
                "
            >
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-orange-500
                        mb-10
                    "
                >
                    {title}
                </h1>

                {children}
            </div>
        </div>
    );
}

export default AuthLayout;