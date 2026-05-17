interface HeroProps {
  onRegisterClick?: () => void;
}

export default function Hero({
  onRegisterClick,
}: HeroProps) {

  return (

    <div className="relative z-10 mx-auto max-w-4xl text-center">

      {/* Badge */}
      <span className="inline-flex rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700 shadow-sm">
        Advanced Research Technology
      </span>

      {/* Heading */}
      <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">

        Smart Research

        <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Collaboration Platform
        </span>

      </h1>

      {/* Description */}
      <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">

        ReSync helps students, researchers,
        authors, and supervisors collaborate
        on research activities through smart
        groups, resources, meetings, task
        management, and intelligent research
        networking.

      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-5">

        <button
          onClick={onRegisterClick}
          className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
        >
          Get Started
        </button>

        <button className="rounded-2xl border border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-cyan-500 hover:text-cyan-500 hover:shadow-lg">
          Explore Research
        </button>

      </div>

    </div>
  );
}