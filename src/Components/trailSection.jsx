import React from "react";
import planning from "../assets/planning.webp";
import explore from "../assets/explore.webp";
import navigation from "../assets/navigation.webp";
import community from "../assets/community.webp";

const TrailSection = () => {
    return (
        <div className="flex flex-col gap-20 py-20">

            {/* Section 1 */}
            <div className="flex flex-col items-center gap-3">

                <h2 className="text-5xl font-semibold text-center">
                    Plan the perfect route
                </h2>

                <p className="text-[16px] max-w-4xl text-center">
                    Whether you're looking for smooth asphalt for your road bike,
                    singletracks for your mountain bike, or peaceful trails for your
                    hikes, komoot helps you generate sport-specific routes tailored to
                    your needs and preferences.
                </p>

                <img
                    src={planning}
                    alt="Planning"
                    className="w-[700px] rounded-xl"
                />

            </div>

            {/* Section 2 */}
            <div className="flex flex-col items-center gap-3">

                <h2 className="text-5xl font-semibold text-center">
                    Find the right inspiration
                </h2>

                <p className="text-[16px] max-w-4xl text-center">
                    From epic mountain escapes to trails close to home, discover routes
                    that fit your style. Filter by distance, difficulty, or public
                    transport links, and set off with confidence wherever inspiration
                    takes you.
                </p>

                <img
                    src={explore}
                    alt="Explore"
                    className="w-[700px] rounded-xl"
                />

            </div>

            {/* Section 3 */}
            <div className="flex flex-col items-center gap-3">

                <h2 className="text-5xl font-semibold text-center">
                    More effective navigation
                </h2>

                <p className="text-[16px] max-w-4xl text-center">
                    Even off the beaten track, stay on course with turn-by-turn voice
                    navigation and offline maps. Download your route and explore freely,
                    even without a mobile signal.
                </p>

                <img
                    src={navigation}
                    alt="Navigation"
                    className="w-[700px] rounded-xl"
                />

            </div>

            {/* Section 4 */}
            <div className="flex flex-col items-center gap-3">

                <h2 className="text-5xl font-semibold text-center">
                    Share your adventure
                </h2>

                <p className="text-[16px] max-w-4xl text-center">
                    Inspire millions of outdoor lovers with photos and suggestions from
                    your latest trip. Share your adventure's best moments with the largest
                    outdoor community in the world.
                </p>

                <img
                    src={community}
                    alt="Community"
                    className="w-[700px] rounded-xl"
                />

            </div>

        </div>
    );
};

export default TrailSection;