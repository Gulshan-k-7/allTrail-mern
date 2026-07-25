import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./loginModel";
import mountain1 from "../assets/mountain1.jpg";
import mountain2 from "../assets/mountain2.jpg";
import mountain3 from "../assets/mountain3.jpg";
import mountain4 from "../assets/mountain4.jpg";



function Hero() {
    const [open, setOpen] = useState(false);

    const images = [
        mountain1,
        mountain2,
        mountain3,
        mountain4,

    ];

    const [currentImage, setCurrentImage] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) =>
                (prev + 1) % images.length
            );
        }, 4000);

        return () => clearInterval(interval);

    }, []);


    return (
        <section className="relative h-130 w-full overflow-hidden bg-center flex items-center justify-center">
            <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-5 text-white">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide">
                    Trail<span className="text-green-400">Tracker</span>
                </Link>

                {/* Login Buttons */}
                <div className="flex items-center gap-4">

                    <button
                        onClick={() => setOpen(true)}
                        className="hover:text-green-400 transition"
                    >
                        Login
                    </button>
                    <LoginModal
                        open={open}
                        onClose={() => setOpen(false)}
                    />

                    <Link
                        to="/register"
                        className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-full font-semibold transition"
                    >
                        Sign Up
                    </Link>

                </div>

            </nav>
            <img
                src={images[currentImage]}
                className="absolute inset-0 w-full h-130 object-cover transition"
                alt="Adventure"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>


            {/* Content */}
            <div className="relative text-white text-center">

                <h1 className="text-5xl font-bold mb-5">
                    Discover Your Next Adventure
                </h1>


                <p className="text-lg mb-8">
                    Explore hiking trails, mountains and hidden places
                </p>


                <div className="bg-white rounded-full flex ml-20 p-2 w-[500px]">

                    <input
                        type="text"
                        placeholder="Search trails or destinations..."
                        className="flex-1 px-5 outline-none text-black"
                    />

                    <button className="bg-green-600 text-white px-8 py-3 rounded-full">
                        Search
                    </button>

                </div>

            </div>

        </section>
    );
}


export default Hero;