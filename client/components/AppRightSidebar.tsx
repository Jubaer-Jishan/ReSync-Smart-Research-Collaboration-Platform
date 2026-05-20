"use client";

import { HiOutlineSparkles } from "react-icons/hi";

const meetings = [
  { title: "Paper Review Sync", time: "Today • 4:00 PM" },
  { title: "Group Standup", time: "Tomorrow • 10:00 AM" },
];

const researchers = [
  { name: "Tahsin Kabir", role: "NLP Enthusiast" },
  { name: "Farhana Aziz", role: "Data Scientist" },
  { name: "Imran Hasan", role: "Cyber Security" },
];

const topics = [
  "Federated Learning",
  "Graph Neural Networks",
  "Climate Tech",
  "Human-Centered AI",
];

const groups = [
  "Smart Healthcare Lab",
  "Vision & Robotics",
  "Edge AI Collective",
];

interface AppRightSidebarProps {
  topSlot?: React.ReactNode;
}

export default function AppRightSidebar({ topSlot }: AppRightSidebarProps) {
  return (
    <aside className="hidden h-[calc(100vh-6rem)] w-full max-w-[280px] flex-col gap-5 overflow-y-auto lg:fixed lg:right-4 lg:top-24 lg:flex">
      {topSlot}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Upcoming Meetings</p>
          <span className="text-xs text-blue-600">View all</span>
        </div>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.title}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
            >
              <p className="text-sm font-semibold text-slate-700">
                {meeting.title}
              </p>
              <p className="text-xs text-slate-500">{meeting.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-slate-800">
          Suggested Researchers
        </p>
        <div className="space-y-3">
          {researchers.map((researcher) => (
            <div
              key={researcher.name}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {researcher.name}
                </p>
                <p className="text-xs text-slate-500">{researcher.role}</p>
              </div>
              <button className="rounded-xl border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Trending Topics</p>
          <HiOutlineSparkles className="text-lg text-cyan-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-800">Active Groups</p>
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <p className="text-xs font-medium text-slate-600">{group}</p>
              <span className="text-xs text-blue-600">Active</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
