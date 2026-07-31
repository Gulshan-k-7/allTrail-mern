import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in React/Vite
const markerIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function MapClickHandler({ setPlaces, setLoading, setError }) {
    const [clickedPosition, setClickedPosition] = useState(null);

    useMapEvents({
        async click(event) {
            const { lat, lng } = event.latlng;

            setClickedPosition({ lat, lng });
            setLoading(true);
            setError("");
            setPlaces([]);

            try {
                const response = await fetch(
                    "http://localhost:5000/api/places/nearby",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            lat,
                            lng,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load tourist places");
                }

                setPlaces(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Places fetch error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        },
    });

    return clickedPosition ? (
        <Marker position={clickedPosition} icon={markerIcon}>
            <Popup>
                Selected location
                <br />
                Latitude: {clickedPosition.lat.toFixed(5)}
                <br />
                Longitude: {clickedPosition.lng.toFixed(5)}
            </Popup>
        </Marker>
    ) : null;
}

function getPlacePosition(place) {
    if (place.lat && place.lon) {
        return [place.lat, place.lon];
    }

    if (place.center?.lat && place.center?.lon) {
        return [place.center.lat, place.center.lon];
    }

    return null;
}

export default function MapComponent({
    places,
    setPlaces,
    setLoading,
    setError,
}) {
    return (
        <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom
            style={{
                height: "100vh",
                width: "100%",
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler
                setPlaces={setPlaces}
                setLoading={setLoading}
                setError={setError}
            />

            {places.map((place) => {
                const position = getPlacePosition(place);

                if (!position) {
                    return null;
                }

                return (
                    <Marker
                        key={`${place.type}-${place.id}`}
                        position={position}
                        icon={markerIcon}
                    >
                        <Popup>
                            <div>
                                <h3 style={{ fontWeight: "bold" }}>
                                    {place.tags?.name || "Unnamed tourist place"}
                                </h3>

                                <p>
                                    Type: {place.tags?.tourism || "Tourist attraction"}
                                </p>

                                {place.tags?.website && (
                                    <a
                                        href={place.tags.website}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Visit website
                                    </a>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}