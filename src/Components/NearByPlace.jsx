import { React, useRef } from "react";


import manali from "../assets/manali.jpg";
import jaipur from "../assets/jaipur.jpg";
import rishikesh from "../assets/rishikesh.jpg";
import udaipur from "../assets/udaipur.jpg";


function NearbyPlaces() {
    const sliderRef = useRef();
    const slideLeft = () => {
        sliderRef.current.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    };


    const slideRight = () => {
        sliderRef.current.scrollBy({
            left: 300,
            behavior: "smooth"

        });
    };

    const places = [
        {
            name: "Manali",
            location: "Himachal Pradesh, India",
            image: manali,
            distance: "520 km",
            time: "8 hrs",
            rating: "4.8"
        },
        {
            name: "Rishikesh",
            location: "Uttarakhand, India",
            image: rishikesh,
            distance: "450 km",
            time: "7 hrs",
            rating: "4.7"
        },
        {
            name: "Jaipur",
            location: "Rajasthan, India",
            image: jaipur,
            distance: "250 km",
            time: "4 hrs",
            rating: "4.6"
        },
        {
            name: "Udaipur",
            location: "Rajasthan, India",
            image: udaipur,
            distance: "300 km",
            time: "5 hrs",
            rating: "4.8"
        },
        {
            name: "Manali",
            location: "Himachal Pradesh, India",
            image: manali,
            distance: "520 km",
            time: "8 hrs",
            rating: "4.8"
        },
        {
            name: "Rishikesh",
            location: "Uttarakhand, India",
            image: rishikesh,
            distance: "450 km",
            time: "7 hrs",
            rating: "4.7"
        },
        {
            name: "Jaipur",
            location: "Rajasthan, India",
            image: jaipur,
            distance: "250 km",
            time: "4 hrs",
            rating: "4.6"
        },
        {
            name: "Udaipur",
            location: "Rajasthan, India",
            image: udaipur,
            distance: "300 km",
            time: "5 hrs",
            rating: "4.8"
        }
    ];


    return (
        <section className="py-16 px-10 bg-gray-50">

            <div className="mb-8">
                <h2 className="text-3xl font-bold">
                    Explore Near You
                </h2>

                <p className="text-gray-500 mt-2">
                    Discover amazing places around your city
                </p>
            </div>


            <div className="flex gap-6 overflow-x-auto pb-4 relative group">

                {/* Left Button */}
                <button
                    onClick={slideLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-400 shadow rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 scale-90 active:scale-75 transition duration-200"
                >
                    ←
                </button>


                {/* Cards Slider */}
                <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-hidden scroll-smooth px-12"
                >

                    {places.map((place, index) => (

                        <div
                            key={index}
                            className="min-w-[280px]  bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition "
                        >
                            <div className="h-70 bg-amber-900 overflow-hidden">
                                <img
                                    src={place.image}
                                    className="w-full h-full object-cover hover:scale-110 transition"
                                    alt={place.name}
                                />
                            </div>

                            <div className="p-4">

                                <h3 className="text-xl font-bold">
                                    {place.name}
                                </h3>

                                <p className="text-gray-500 text-sm">
                                    📍 {place.location}
                                </p>

                                <div className="flex justify-between mt-4 text-sm">
                                    <span>
                                        🚗 {place.distance}
                                    </span>

                                    <span>
                                        ⏱ {place.time}
                                    </span>
                                </div>

                                <div className="mt-3 text-yellow-500">
                                    ⭐ {place.rating}
                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* Right Button */}
                <button
                    onClick={slideRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-400 shadow rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 scale-90 active:scale-75 transition duration-200"
                >
                    →
                </button>

            </div>

        </section >
    );
}


export default NearbyPlaces;