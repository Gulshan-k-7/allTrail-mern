import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(
                "Firebase logout error:",
                error
            );
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login", {
                replace: true,
            });
        }
    }

    return (
        <nav>
            {token && (
                <>
                    <span>{user?.name}</span>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
}

export default Navbar;