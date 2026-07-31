import { useState } from "react";
import logo from "../assets/logo.png";
import { IoClose } from "react-icons/io5";
import {
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
    auth,
    googleProvider,
} from "../firebase/firebase";

export default function Login({ open, onClose }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    if (!open) return null;

    async function handleGoogleLogin() {
        if (loading) return;

        try {
            setLoading(true);
            setError("");

            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            const firebaseToken =
                await result.user.getIdToken(true);

            const apiUrl =
                import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${apiUrl}/api/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        firebaseToken,
                    }),
                }
            );

            const responseText =
                await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error(
                    "The backend returned an invalid response"
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Google login failed"
                );
            }

            if (!data.token) {
                throw new Error(
                    "Backend did not return a login token"
                );
            }

            if (!data.user) {
                throw new Error(
                    "Backend did not return user data"
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            if (onClose) {
                onClose();
            }

            navigate("/home", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Google login error:",
                error
            );

            switch (error.code) {
                case "auth/popup-closed-by-user":
                    setError(
                        "Google login was cancelled."
                    );
                    break;

                case "auth/popup-blocked":
                    setError(
                        "The browser blocked the Google login popup. Please allow popups and try again."
                    );
                    break;

                case "auth/unauthorized-domain":
                    setError(
                        "This domain is not authorized in Firebase."
                    );
                    break;

                case "auth/network-request-failed":
                    setError(
                        "Network error. Make sure your backend server is running."
                    );
                    break;

                default:
                    setError(
                        error.message ||
                        "Google login failed."
                    );
            }

            await signOut(auth).catch(() => { });
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        if (loading) return;

        setError("");

        if (onClose) {
            onClose();
        }
    }

    return (
        <main
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={handleClose}
        >
            <section
                className="relative w-full max-w-[520px] rounded-3xl bg-gray-300 p-8 sm:p-10"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close login modal"
                    className="absolute right-6 top-6 text-2xl text-gray-800 duration-300 hover:rotate-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <IoClose />
                </button>

                <div className="mb-6 flex justify-center">
                    <img
                        src={logo}
                        alt="AllTrail logo"
                        className="w-14"
                    />
                </div>

                <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
                    Keep exploring trails
                </h2>

                <p className="mb-8 mt-3 text-center text-gray-700 sm:mb-10">
                    Log in or sign up for free
                </p>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            fill="#4285F4"
                            d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
                        />

                        <path
                            fill="#34A853"
                            d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
                        />

                        <path
                            fill="#FBBC05"
                            d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.62.39 3.15 1.04 4.55l3.35-2.62Z"
                        />

                        <path
                            fill="#EA4335"
                            d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.66 9.66 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
                        />
                    </svg>

                    {loading
                        ? "Signing in..."
                        : "Continue with Google"}
                </button>

                <p className="mt-6 text-center text-xs leading-5 text-gray-500">
                    New users are registered
                    automatically after successful
                    Google authentication.
                </p>
            </section>
        </main>
    );
}