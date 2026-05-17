interface CTAProps {
  onRegisterClick?: () => void;
}

export default function CTA({ onRegisterClick }: CTAProps) {
  return (
    <section className="bg-slate-50 px-8 py-24">
      <div className="mx-auto max-w-5xl rounded-[40px] bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-20 text-center text-white shadow-lg shadow-blue-500/20">
        
        <h2 className="text-5xl font-extrabold">
          Start Your Research Journey Today
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-50">
          Connect with researchers, collaborate smarter, and build innovative research communities.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          
          <button
            onClick={onRegisterClick}
            className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition hover:scale-105"
          >
            Register
          </button>

          <button className="rounded-2xl border border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-blue-600">
            Explore Research
          </button>
        </div>
      </div>
    </section>
  );
}