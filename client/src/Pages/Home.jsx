import Navbar from "../Components/Navbar";
import Hero from "../components/Hero";
// import TrailCard from "../components/TrailCard";
// import Footer from "../components/Footer";
import NearbyPlaces from "../Components/nearByPlace";
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