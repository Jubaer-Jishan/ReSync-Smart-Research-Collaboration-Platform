export default function Footer() {
  return (
   <footer
  id="contact"
  className="bg-slate-50 px-8 py-14 text-slate-600"
>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            ReSync
          </h2>

          <p className="mt-3 max-w-md text-slate-600">
            Smart Research Collaboration Platform for students,
            researchers, and supervisors.
          </p>
        </div>

        <div className="flex gap-8 text-sm font-medium">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Research</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
        © 2026 ReSync. All rights reserved.
      </div>
    </footer>
  );
}