"use client";

import {
  motion,
} from "framer-motion";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface CTAProps {
  onRegisterClick?: () => void;
}

export default function CTA({
  onRegisterClick,
}: CTAProps) {

  return (

    <section className="relative overflow-hidden py-24">

      {/* Background Glow */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">

        {/* Left Side */}
        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl"
        >

          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-700">
            CONTACT US
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900">
            Let’s Build The Future Of
            <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Research Together
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Have questions, ideas, or collaboration requests?
            Reach out to the ReSync team and we’ll get back to you quickly.
          </p>

          {/* Contact Info */}
          <div className="mt-10 space-y-6">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
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

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FaPhoneAlt />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <h3 className="font-bold text-slate-800">
                  +880 1922821489
                </h3>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                <FaMapMarkerAlt />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Location
                </p>

                <h3 className="font-bold text-slate-800">
                  Dhaka,Dokshinkhan, Bangladesh
                </h3>
              </div>

            </div>

          </div>

        </motion.div>

        {/* Right Side Form */}
        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl"
        >

          <h2 className="text-3xl font-black text-slate-900">
            Send Message
          </h2>

          <p className="mt-3 text-slate-600">
            Fill out the form and our team will contact you soon.
          </p>

          <form className="mt-8 space-y-6">

            {/* Full Name */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />

            </div>

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />

            </div>

            {/* Subject */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Subject
              </label>

              <input
                type="text"
                placeholder="Write subject"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />

            </div>

            {/* Message */}
            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700">
                Message
              </label>

              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Send Message
            </button>

          </form>

        </motion.div>

      </div>

    </section>
  );
}