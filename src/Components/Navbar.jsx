import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import Login from "./Login";
import logo from "../assets/logo.png";

export default function Navbar() {
    const navigate = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const navLinkStyle = ({ isActive }) =>
        `relative py-2 transition-colors duration-300 hover:text-[#e6a85c]
     ${isActive
            ? "text-[#e6a85c] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#e6a85c]"
            : "text-white"
        }`;

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Firebase logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/home", { replace: true });
        }
    }

    return (
        <>
            <nav className="absolute left-0 top-0 z-50 w-full border-b border-white/15 bg-transparent text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                    {/* Logo */}
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="flex items-center gap-2"
                    >
                        <img
                            src={logo}
                            alt="TrailTracker logo"
                            className="h-11 w-11 object-contain"
                        />

                        <span className="text-2xl font-bold">
                            Trail<span className="text-green-600">Tracker</span>
                        </span>
                    </button>

                    {/* Navigation */}
                    <div className="hidden items-center gap-8 text-base font-medium md:flex">
                        <NavLink to="/home" className={navLinkStyle}>
                            Home
                        </NavLink>

                        <NavLink to="/community" className={navLinkStyle}>
                            Community
                        </NavLink>

                        <NavLink to="/explore" className={navLinkStyle}>
                            Explore
                        </NavLink>

                        <NavLink to="/about" className={navLinkStyle}>
                            About
                        </NavLink>
                    </div>

                    {/* Authentication */}
                    <div className="flex items-center">
                        {!token ? (
                            <button
                                type="button"
                                onClick={() => setOpenLogin(true)}
                                className="rounded-full bg-green-600 px-6 py-2.5 font-semibold text-[#17372d] transition hover:bg-green-900"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/profile")}
                                    aria-label="Open profile"
                                >
                                    <img
                                        src={
                                            user?.photo ||
                                            user?.photoURL ||
                                            "https://ui-avatars.com/api/?name=User"
                                        }
                                        alt="Profile"
                                        className="h-11 w-11 rounded-full border-2 border-green-600 object-cover"
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 font-medium backdrop-blur-sm transition hover:bg-green-600 hover:text-green-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <Login open={openLogin} onClose={() => setOpenLogin(false)} />
        </>
    );
}