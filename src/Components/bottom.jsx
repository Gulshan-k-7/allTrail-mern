import {
    FaInstagram,
    FaFacebook,
    FaLinkedin,
    FaYoutube,
    FaXTwitter,
} from "react-icons/fa6";
import React from "react";
import { Link } from "react-router-dom";
function Footer() {
    const explore = [
        { name: "Countries", path: "/countries" },
        { name: "Regions", path: "/Regions" },
        { name: "Cities", path: "/Cities" },
        { name: "Parks", path: "/Parks" },
        { name: "Trails", path: "/Trails" },
        { name: "Waterfalls", path: "/Waterfalls" },

    ]
    const Adventure = [
        { name: "Hiking", path: "/Hiking" },
        { name: "Camping", path: "/Camping" },
        { name: "Cycling", path: "/Cycling" },
        { name: "Trekking", path: "/Trekking" },
        { name: "Mountain Climbing", path: "/Mountain Climbing" }

    ]
    const company = [
        { name: "About", path: "/About" },
        { name: "Careers", path: "/Careers" },
        { name: "Blog", path: "/Blog" },
        { name: "Contact", path: "/Contact" },
    ]
    const Community = [
        { name: "Support", path: "/Support" },
        { name: "Forums", path: "/Forums" },
        { name: "Events", path: "/Events" },
        { name: "Partners", path: "/Partners" },
    ]



    return (
        <footer className="bg-[#132012] text-white pt-16 pb-8 px-8 md:px-16">

            {/* Top */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

                {/* Logo */}
                <div>
                    <h2 className="text-3xl font-bold text-green-400">
                        TrailTracker
                    </h2>
                </div>

                {/* Explore */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Explore</h3>
                    <ul className="space-y-3 text-gray-300">

                        {explore.map((item) => (
                            <li key={item.path}>

                                <Link className="hover:underline" to={item.path}>{item.name} </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Adventure */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">
                        Adventure
                    </h3>

                    <ul className="space-y-3 text-gray-300">
                        {Adventure.map((item) => (
                            <li key={item.path}>

                                <Link className="hover:underline" to={item.path}>{item.name} </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">
                        Company
                    </h3>

                    <ul className="space-y-3 text-gray-300">
                        {company.map((item) => (
                            <li key={item.path}>

                                <Link className="hover:underline" to={item.path}>{item.name} </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Community */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">
                        Community
                    </h3>
                    <ul className="space-y-3 text-gray-300">
                        {Community.map((item) => (
                            <li key={item.path}>

                                <Link className="hover:underline" to={item.path}>{item.name} </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Middle */}

            <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 mt-14 pt-8">

                <div>
                    <h3 className="text-xl font-semibold">
                        Follow Us
                    </h3>

                    <div className="flex gap-4 mt-4 text-2xl">

                        <FaInstagram className="cursor-pointer hover:text-green-400 duration-300" />

                        <FaFacebook className="cursor-pointer hover:text-green-400 duration-300" />

                        <FaXTwitter className="cursor-pointer hover:text-green-400 duration-300" />

                        <FaYoutube className="cursor-pointer hover:text-green-400 duration-300" />

                        <FaLinkedin className="cursor-pointer hover:text-green-400 duration-300" />

                    </div>
                </div>

                <div className="text-gray-400 mt-8 md:mt-0">
                    Download our mobile app
                </div>

            </div>

            {/* Bottom */}

            <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">

                <p>
                    © 2026 TrailTracker. All rights reserved.
                </p>

                <div className="flex gap-6 mt-4 md:mt-0">
                    <span className="cursor-pointer hover:text-white">
                        Privacy Policy
                    </span>

                    <span className="cursor-pointer hover:text-white">
                        Terms
                    </span>

                    <span className="cursor-pointer hover:text-white">
                        Cookies
                    </span>
                </div>

            </div>

        </footer>
    );
}

export default Footer;