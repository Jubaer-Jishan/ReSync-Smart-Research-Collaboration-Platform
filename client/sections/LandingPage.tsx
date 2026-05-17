"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "../components/About";
import Stats from "../components/Stats";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import Preloader from "../components/Preloader";

export default function LandingPage() {

  const [isAuthOpen, setIsAuthOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  return (

    <>

      {loading && (
        <Preloader
          onFinish={() =>
            setLoading(false)
          }
        />
      )}

      <main className="min-h-screen bg-white">

        {/* Navbar */}
        <Navbar
          onAuthOpen={() =>
            setIsAuthOpen(true)
          }
        />

        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden"
        >

          {/* Background Blur */}
          <div className="absolute left-[-150px] top-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-200 blur-3xl"></div>

          <div className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-blue-200 blur-3xl"></div>

          {/* Hero Content */}
          <div className="mx-auto max-w-7xl px-8 py-24">
            <Hero />
          </div>

        </section>

        {/* Features */}
        <section id="features">
          <Features />
        </section>

        {/* About */}
        <section id="about">
          <About />
        </section>

        {/* Stats */}
        <section id="research">
          <Stats />
        </section>

        {/* CTA */}
        <section id="contact">
          <CTA />
        </section>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() =>
            setIsAuthOpen(false)
          }
        />

        {/* Footer */}
        <Footer />

      </main>

    </>
  );
}