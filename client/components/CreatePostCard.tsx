"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlinePhotograph,
  HiOutlinePaperClip,
  HiOutlineAtSymbol,
} from "react-icons/hi";
import { createPost, type ResearchPost } from "../lib/api";

const researchDomains = [
  "AI_ML",
  "NLP",
  "COMPUTER_VISION",
  "IOT",
  "CYBER_SECURITY",
  "DATA_SCIENCE",
  "SOFTWARE_ENGINEERING",
  "HCI",
  "ROBOTICS",
  "BLOCKCHAIN",
  "BIOINFORMATICS",
  "NETWORKING",
  "CLOUD_COMPUTING",
  "EMBEDDED_SYSTEMS",
  "OTHER",
];

const collaborationTypes = [
  "CO_AUTHOR",
  "TEAMMATE",
  "SUPERVISOR_SEARCH",
  "RESEARCH_ASSISTANT",
  "THESIS_STUDENT_SEARCH",
  "DOMAIN_EXPERT",
  "DATA_COLLECTOR",
  "RESEARCH_WRITER",
  "STATISTICIAN",
  "OTHER",
];

const academicLevels = ["UNDERGRAD", "MASTERS", "PHD", "FACULTY"];

const researchStages = [
  "IDEA",
  "LITERATURE_REVIEW",
  "DATA_COLLECTION",
  "IMPLEMENTATION",
  "EXPERIMENTATION",
  "PAPER_WRITING",
  "SUBMISSION",
];

const experienceLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const departments = [
  "Computer Science and Engineering",
  "Software Engineering",
  "Electrical and Electronic Engineering",
  "Electronics and Communication Engineering",
  "Textile Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Industrial and Production Engineering",
  "Chemical Engineering",
  "Automobile Engineering",
  "Architecture",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Statistics",
  "Biotechnology",
  "Microbiology",
  "Biochemistry",
  "Environmental Science",
  "Pharmacy",
  "MBBS",
  "Dental",
  "Nursing",
  "Public Health",
  "Business Administration",
  "Accounting",
  "Finance",
  "Marketing",
  "Management",
  "Economics",
  "Management Information Systems",
  "Banking and Insurance",
  "English",
  "Bangla",
  "Arabic",
  "French",
  "Japanese",
  "Chinese",
  "Korean",
  "Spanish",
  "German",
  "Persian",
  "Linguistics",
  "English Language Teaching",
  "Literature",
  "History",
  "Islamic Studies",
  "Philosophy",
  "Sociology",
  "Political Science",
  "International Relations",
  "Public Administration",
  "Anthropology",
  "Development Studies",
  "Law",
  "Journalism and Media Studies",
  "Mass Communication",
  "Film Studies",
  "Agriculture",
  "Fisheries",
  "Forestry",
  "Veterinary Science",
  "Food Engineering",
  "Education",
  "Fine Arts",
  "Graphic Design",
  "Fashion Design",
  "Tourism and Hospitality Management",
  "Criminology",
  "Geography and GIS",
  "Disaster Management",
];

const MAX_IMAGES = 4;

function formatEnumLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

interface CreatePostCardProps {
  onPostCreated?: (post: ResearchPost) => void;
  userName?: string;
  avatarUrl?: string;
}

export default function CreatePostCard({
  onPostCreated,
  userName = "Ayesha Rahman",
  avatarUrl,
}: CreatePostCardProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [researchDomain, setResearchDomain] = useState(researchDomains[0]);
  const [collaborationType, setCollaborationType] =
    useState(collaborationTypes[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [academicLevel, setAcademicLevel] = useState(academicLevels[0]);
  const [researchStage, setResearchStage] = useState(researchStages[0]);
  const [experienceLevel, setExperienceLevel] = useState(experienceLevels[0]);
  const [requiredCollaborators, setRequiredCollaborators] = useState(2);
  const [deadline, setDeadline] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  });
  const [images, setImages] = useState<File[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const merged = [...images, ...selected].slice(0, MAX_IMAGES);
    setImages(merged);
    event.target.value = "";
  };

  const handleSubmit = async () => {
    setError(null);

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (description.trim().length < 30) {
      setError("Description must be at least 30 characters.");
      return;
    }

    if (!deadline) {
      setError("Please select a deadline.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createPost({
        title: title.trim(),
        description: description.trim(),
        researchDomain,
        collaborationType,
        requiredCollaborators,
        department,
        academicLevel,
        researchStage,
        experienceLevel,
        deadlineIso: new Date(deadline).toISOString(),
        images,
      });

      onPostCreated?.(created);
      setTitle("");
      setDescription("");
      setImages([]);
      setExpanded(false);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create post";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            userName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
          )}
        </div>
        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Share your research needs, ideas, or collaboration goals"
            className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-200">
              <HiOutlinePhotograph className="text-lg" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-200">
              <HiOutlinePaperClip className="text-lg" />
              Attach Resource
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-200">
              <HiOutlineAtSymbol className="text-lg" />
              Mention Group
            </button>
            <button
              className="ml-auto text-sm font-semibold text-blue-600"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Hide details" : "Add details"}
            </button>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview) => (
                <div
                  key={preview.url}
                  className="h-24 overflow-hidden rounded-2xl border border-slate-200"
                >
                  <img
                    src={preview.url}
                    alt={preview.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {expanded && (
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Research Domain
                <select
                  value={researchDomain}
                  onChange={(event) => setResearchDomain(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  {researchDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {formatEnumLabel(domain)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Collaboration Type
                <select
                  value={collaborationType}
                  onChange={(event) => setCollaborationType(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  {collaborationTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatEnumLabel(type)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
                <select
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Academic Level
                <select
                  value={academicLevel}
                  onChange={(event) => setAcademicLevel(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  {academicLevels.map((level) => (
                    <option key={level} value={level}>
                      {formatEnumLabel(level)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Research Stage
                <select
                  value={researchStage}
                  onChange={(event) => setResearchStage(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  {researchStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {formatEnumLabel(stage)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Experience Level
                <select
                  value={experienceLevel}
                  onChange={(event) => setExperienceLevel(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {formatEnumLabel(level)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Required Collaborators
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={requiredCollaborators}
                  onChange={(event) =>
                    setRequiredCollaborators(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                />
              </label>

              <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Deadline
                <input
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                />
              </label>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Max {MAX_IMAGES} images. Supported: jpg, png, webp.
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
