import { useState } from "react";
import MapComponent from "../components/Map";

export default function Explore() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (
        <main className="bg-gray-800">
            <div className="h-20 container"></div>
            <div className="flex h-screen overflow-hidden">

                <div className="w-[380px] overflow-y-auto border-r bg-gray-300 p-4">
                    <h1 className="mb-1 text-2xl font-bold">
                        Explore places
                    </h1>

                    <p className="mb-5 text-sm text-gray-500">
                        Click anywhere on the map to discover nearby attractions.
                    </p>

                    {loading && (
                        <div className="py-10 text-center">
                            <p className="font-medium">
                                Finding nearby places...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading && !error && places.length === 0 && (
                        <p className="rounded-lg bg-gray-100 p-4 text-gray-600">
                            Click somewhere on the map.
                        </p>
                    )}

                    {!loading &&
                        places.map((place) => (
                            <article
                                key={`${place.type}-${place.id}`}
                                className="mb-5 overflow-hidden rounded-xl border bg-white shadow-sm"
                            >
                                {place.image ? (
                                    <img
                                        src={place.image}
                                        alt={place.name}
                                        className="h-44 w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-44 items-center justify-center bg-gray-200 text-gray-500">
                                        No image available
                                    </div>
                                )}

                                <div className="p-4">
                                    <h2 className="text-lg font-bold">
                                        {place.name}
                                    </h2>

                                    <p className="mt-1 text-sm capitalize text-green-700">
                                        {place.category?.replaceAll("_", " ")}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        {place.description}
                                    </p>

                                    {place.wikipediaUrl && (
                                        <a
                                            href={place.wikipediaUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
                                        >
                                            Read more on Wikipedia
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                </div>

                <div className="min-w-0 flex-1">
                    <MapComponent
                        places={places}
                        setPlaces={setPlaces}
                        setLoading={setLoading}
                        setError={setError}
                    />
                </div>
            </div>
        </main>
    );
}