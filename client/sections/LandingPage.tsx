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

  const [authMode, setAuthMode] =
    useState<"login" | "register">("login");

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

      <main className="relative min-h-screen overflow-hidden bg-slate-50">

        {/* Global Atmosphere */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,rgba(6,182,212,0)_70%)] blur-3xl"></div>
          <div className="absolute -right-48 top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,rgba(37,99,235,0)_70%)] blur-3xl"></div>
          <div className="absolute left-1/2 top-[520px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,rgba(6,182,212,0)_70%)] blur-3xl"></div>

          {/* Subtle node hints */}
          <div className="absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-cyan-500 opacity-[0.04] blur-[6px]"></div>
          <div className="absolute right-[18%] top-[28%] h-2 w-2 rounded-full bg-blue-600 opacity-[0.04] blur-[6px]"></div>
          <div className="absolute left-[22%] top-[52%] h-2.5 w-2.5 rounded-full bg-cyan-500 opacity-[0.04] blur-[6px]"></div>
          <div className="absolute right-[26%] top-[58%] h-3 w-3 rounded-full bg-blue-600 opacity-[0.04] blur-[6px]"></div>
          <div className="absolute left-[48%] top-[68%] h-2 w-2 rounded-full bg-cyan-500 opacity-[0.04] blur-[6px]"></div>
        </div>

        {/* Navbar */}
        <Navbar
          onAuthOpen={(mode) => {
            setAuthMode(mode);
            setIsAuthOpen(true);
          }}
        />

        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden"
        >

          {/* Background Blur */}
          <div className="absolute left-[-150px] top-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-100 blur-3xl"></div>

          <div className="absolute bottom-[-220px] left-[18%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,rgba(6,182,212,0)_70%)] blur-3xl"></div>

          <div className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-blue-100 blur-3xl"></div>

          <div className="absolute -bottom-64 right-[20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,rgba(37,99,235,0)_70%)] blur-3xl"></div>

          {/* Hero Content */}
          <div className="mx-auto max-w-7xl px-8 py-24">
            <Hero
              onRegisterClick={() => {
                setAuthMode("register");
                setIsAuthOpen(true);
              }}
            />
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
          <CTA
            onRegisterClick={() => {
              setAuthMode("register");
              setIsAuthOpen(true);
            }}
          />
        </section>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() =>
            setIsAuthOpen(false)
          }
          initialMode={authMode}
        />

        {/* Footer */}
        <Footer />

      </main>

    </>
  );
}