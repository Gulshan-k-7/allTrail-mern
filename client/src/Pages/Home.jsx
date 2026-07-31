import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import NearbyPlaces from "../Components/NearByPlace";
import TrailSection from "../Components/trailSection";
import Footer from "../Components/bottom";

function Home() {
    return (
        <>
            <div>
                {/* <Navbar /> */}
                <Hero />
                {/* <NearbyPlaces /> */}
                <TrailSection />
                <Footer />

            </div>
        </>
    );
}

export default Home;
