import { useState } from "react";
import {
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
    auth,
    googleProvider,
} from "../firebase/firebase";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleGoogleLogin() {
        if (loading) return;

        try {
            setLoading(true);
            setError("");

            // Open Google account-selection popup
            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            // Firebase-generated ID token
            const firebaseToken =
                await result.user.getIdToken();

            const response = await fetch(
                `${import.meta.env.VITE_API_URL ||
                "http://localhost:5000"
                }/api/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firebaseToken,
                    }),
                }
            );

            const responseText = await response.text();

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
                    data.message || "Google login failed"
                );
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/home", {
                replace: true,
            });
        } catch (error) {
            console.error("Google login error:", error);

            if (error.code === "auth/popup-closed-by-user") {
                setError(
                    "Google login was cancelled before completion."
                );
            } else if (
                error.code === "auth/popup-blocked"
            ) {
                setError(
                    "The browser blocked the Google login popup."
                );
            } else if (
                error.code ===
                "auth/unauthorized-domain"
            ) {
                setError(
                    "This domain is not authorized in Firebase."
                );
            } else {
                setError(
                    error.message || "Google login failed."
                );
            }

            // Prevent Firebase and app login states from disagreeing
            await signOut(auth).catch(() => { });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 px-4">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Sign in to explore trails and share your
                        adventures.
                    </p>
                </div>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    New users are registered automatically after
                    successful Google authentication.
                </p>
            </section>
        </main>
    );
}