export default function About() {
  return (
    <section
  id="about"
  className="bg-slate-50 px-8 py-24"
>
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        
        <div>
          <span className="rounded-full bg-cyan-50 px-5 py-2 text-sm font-semibold text-cyan-700">
            About ReSync
          </span>

          <h2 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900">
            Built For Modern
            <span className="block text-cyan-500">
              Research Collaboration
            </span>
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600">
            ReSync connects students, researchers, authors, and
            supervisors into one intelligent research ecosystem.
          </p>
        </div>

        <div className="grid gap-6">
          
          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-bold text-slate-800">
              Students
            </h3>

            <p className="mt-4 text-slate-600">
              Find research opportunities and collaborate with experts.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-bold text-slate-800">
              Researchers
            </h3>

            <p className="mt-4 text-slate-600">
              Manage tasks, meetings, resources, and discussions.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-bold text-slate-800">
              Supervisors
            </h3>

            <p className="mt-4 text-slate-600">
              Build research groups and guide collaborative projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}