import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import logo from "../assets/logo.png"

function LoginModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="relative w-[520px] bg-gray-300 rounded-3xl p-10">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute text-gray-800 right-6 top-6 text-2xl hover:rotate-90 duration-300"
                >
                    <IoClose />
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-14"
                    />
                </div>

                {/* Heading */}
                <h2 className="text-4xl text-gray-900 font-bold text-center">
                    Keep exploring trails
                </h2>

                <p className="text-center text-gray-700 mt-3 mb-10">
                    Log in or sign up for free
                </p>

                {/* Google */}
                <button className="w-full flex items-center justify-center gap-3 text-gray-900 py-4 rounded-full bg-gray-100 hover:bg-gray-200 mb-4 hover:cursor-pointer">

                    <FaGoogle className="text-red-500 text-xl" />

                    Continue with Google

                </button>



                {/* Email */}
                <button className="w-full py-4 rounded-full hover:cursor-pointer bg-black text-white hover:bg-gray-900">
                    Continue with Email
                </button>

                <p className="text-center text-xs text-gray-500 mt-8">
                    By continuing you agree to our
                    <span className="underline cursor-pointer">
                        {" "}Terms of Service
                    </span>
                    {" "}and{" "}
                    <span className="underline cursor-pointer">
                        Privacy Policy
                    </span>
                </p>

            </div>

        </div>
    );
}

export default LoginModal;