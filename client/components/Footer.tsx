"use client";

import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {

  return (

    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">

      {/* Background Glow */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-14 lg:grid-cols-4">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl font-black text-white shadow-lg shadow-cyan-500/20">

                R

              </div>

              <div>

                <h1 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-3xl font-black text-transparent">
                  ReSync
                </h1>

                <p className="text-sm tracking-wide text-slate-500">
                  Research Collaboration Platform
                </p>

              </div>

            </div>

            <p className="mt-6 text-base leading-8 text-slate-600">

              ReSync empowers students, researchers,
              and supervisors with smart collaboration,
              networking, task management, and modern
              research tools.

            </p>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-4">

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 hover:bg-cyan-500 hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 hover:bg-cyan-500 hover:text-white"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-all duration-300 hover:bg-cyan-500 hover:text-white"
              >
                <FaLinkedinIn />
              </a>

            </div>

          </div>

          {/* Platform */}
          <div>

            <h2 className="text-2xl font-black text-slate-900">
              Platform
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-slate-600">

              <a
                href="#home"
                className="transition hover:text-cyan-500"
              >
                Home
              </a>

              <a
                href="#about"
                className="transition hover:text-cyan-500"
              >
                About
              </a>

              <a
                href="#features"
                className="transition hover:text-cyan-500"
              >
                Features
              </a>

              <a
                href="#research"
                className="transition hover:text-cyan-500"
              >
                Research
              </a>

              <a
                href="#contact"
                className="transition hover:text-cyan-500"
              >
                Contact
              </a>

            </div>

          </div>

          {/* Resources */}
          <div>

            <h2 className="text-2xl font-black text-slate-900">
              Resources
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-slate-600">

              <a
                href="#"
                className="transition hover:text-cyan-500"
              >
                Research Papers
              </a>

              <a
                href="#"
                className="transition hover:text-cyan-500"
              >
                Collaboration Groups
              </a>

              <a
                href="#"
                className="transition hover:text-cyan-500"
              >
                Smart Networking
              </a>

              <a
                href="#"
                className="transition hover:text-cyan-500"
              >
                Help Center
              </a>

              <a
                href="#"
                className="transition hover:text-cyan-500"
              >
                Privacy Policy
              </a>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h2 className="text-2xl font-black text-slate-900">
              Contact
            </h2>

            <div className="mt-6 space-y-6">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">

                  <FaEnvelope />

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <h3 className="font-bold text-slate-800">
                    support@resync.com
                  </h3>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

                  <FaPhoneAlt />

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <h3 className="font-bold text-slate-800">
                    +880 1234-567890
                  </h3>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">

                  <FaMapMarkerAlt />

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Address
                  </p>

                  <h3 className="font-bold text-slate-800">
                    Dhaka, Bangladesh
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 text-center md:flex-row">

          <p className="text-sm text-slate-500">
            © 2026 ReSync. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-500">

            <a
              href="#"
              className="transition hover:text-cyan-500"
            >
              Terms
            </a>

            <a
              href="#"
              className="transition hover:text-cyan-500"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition hover:text-cyan-500"
            >
              Cookies
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}