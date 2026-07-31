import React from "react";
import {
  ArrowRight,
  Compass,
  Heart,
  Leaf,
  MapPin,
  Mountain,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Compass size={26} />,
    title: "Discover Adventures",
    description:
      "Explore hiking trails, hidden destinations, campsites, and unforgettable outdoor experiences.",
  },
  {
    icon: <MapPin size={26} />,
    title: "Plan with Confidence",
    description:
      "Use helpful trail details, locations, maps, and community suggestions to plan every journey.",
  },
  {
    icon: <Users size={26} />,
    title: "Travel Together",
    description:
      "Share your experiences, upload travel moments, and connect with people who love adventure.",
  },
];

const values = [
  {
    icon: <Leaf size={24} />,
    title: "Respect Nature",
    text: "We encourage responsible travel that protects natural places.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Explore Safely",
    text: "Useful information helps travellers prepare before every trip.",
  },
  {
    icon: <Heart size={24} />,
    title: "Build Community",
    text: "Real stories and shared experiences make every journey better.",
  },
];

function About() {
  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#18352b]">
      {/* Hero section */}
      <section
        className="relative flex min-h-[620px] items-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#102c23]/95 via-[#153d30]/75 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-[#f7d29b] backdrop-blur-md">
              <Mountain size={17} />
              About AllTrail
            </div>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Adventure begins beyond the{" "}
              <span className="text-[#e6a85c]">ordinary.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              AllTrail helps travellers discover inspiring places, plan outdoor
              adventures, and share meaningful experiences with a growing
              community of explorers.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 rounded-full bg-[#e6a85c] px-7 py-3.5 font-semibold text-[#17372d] transition hover:-translate-y-1 hover:bg-[#f0bb76]"
              >
                Explore Places
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/community"
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-[#17372d]"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85"
            alt="Hikers exploring a mountain trail"
            className="h-[520px] w-full rounded-[2rem] object-cover shadow-2xl"
          />

          <div className="absolute -bottom-7 right-5 max-w-[240px] rounded-3xl border border-white/40 bg-white/90 p-5 shadow-xl backdrop-blur-md md:right-[-25px]">
            <div className="mb-2 flex text-[#e69a3a]">
              {[1, 2, 3, 4, 5].map((item) => (
                <Star key={item} size={17} fill="currentColor" />
              ))}
            </div>

            <p className="font-semibold text-[#18352b]">
              “Every trail has a story worth discovering.”
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-[#cb7b32]">
            Our story
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Making outdoor exploration simpler and more meaningful
          </h2>

          <p className="mt-6 leading-8 text-[#5d6d64]">
            We created AllTrail for people who want to escape busy routines and
            experience the outdoors. Finding the right place should feel
            exciting—not complicated.
          </p>

          <p className="mt-4 leading-8 text-[#5d6d64]">
            From peaceful nature walks and thrilling mountain treks to camping
            destinations and community recommendations, AllTrail brings useful
            travel information together in one beautiful experience.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#18352b]/15 pt-7">
            <div>
              <p className="text-3xl font-bold text-[#cb7b32]">100+</p>
              <p className="mt-1 text-sm text-[#657269]">Places</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-[#cb7b32]">50+</p>
              <p className="mt-1 text-sm text-[#657269]">Trails</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-[#cb7b32]">24/7</p>
              <p className="mt-1 text-sm text-[#657269]">Inspiration</p>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="bg-[#153a2e] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-[#e6a85c]">
              What we offer
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              Everything you need for your next adventure
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.07] p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:bg-white/[0.12]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6a85c] text-[#153a2e] transition group-hover:rotate-6">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-semibold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-white/65">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our values */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-semibold uppercase tracking-[0.2em] text-[#cb7b32]">
              Our values
            </p>

            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              Explore responsibly. Connect genuinely.
            </h2>

            <p className="mt-5 leading-8 text-[#647168]">
              Our platform is designed around nature, safety, and a supportive
              travel community.
            </p>
          </div>

          <div className="space-y-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="flex gap-5 rounded-3xl border border-[#193a2e]/10 bg-white p-6 shadow-[0_14px_45px_rgba(24,53,43,0.08)] transition hover:border-[#d98b42]/40"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8efe8] text-[#245541]">
                  {value.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="mt-1 leading-7 text-[#68746d]">{value.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 pb-24 lg:px-10">
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-cover bg-center px-7 py-20 text-center shadow-2xl"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-[#102e24]/80" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Your next story starts on the trail
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/75">
              Discover remarkable destinations and become part of a community
              that lives for the outdoors.
            </p>

            <Link
              to="/explore"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e6a85c] px-8 py-4 font-bold text-[#17372d] transition hover:scale-105 hover:bg-[#f1bd78]"
            >
              Start Exploring
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;