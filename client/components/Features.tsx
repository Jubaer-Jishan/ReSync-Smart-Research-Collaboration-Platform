import {
  FaUsers,
  FaTasks,
  FaBell,
  FaDatabase,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUsers />,
    title: "Research Groups",
  },

  {
    icon: <FaTasks />,
    title: "Task Management",
  },

  {
    icon: <FaDatabase />,
    title: "Resource Sharing",
  },

  {
    icon: <FaCalendarAlt />,
    title: "Meeting Scheduling",
  },

  {
    icon: <FaBell />,
    title: "Notifications",
  },

  {
    icon: <FaChartLine />,
    title: "Research Analytics",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-50 px-8 py-24"
    >
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-extrabold text-slate-900">
            Powerful Features
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Everything researchers need to collaborate efficiently.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-3xl text-white">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Smart and scalable tools designed for collaborative research environments.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}