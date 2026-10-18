"use client";

import Link from "next/link";
import { MapPin, Clock, Briefcase } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description?: string;
    experienceLevel?: string;
    jobType: string;
    location?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    isNegotiable?: boolean;
    currency?: string;
    createdAt: Date | string;
    company: { name: string; logo?: string | null };
  };
}

const JOB_TYPE_STYLE: Record<string, string> = {
  FULL_TIME:  "bg-green-100 text-green-700",
  PART_TIME:  "bg-blue-100 text-blue-700",
  CONTRACT:   "bg-orange-100 text-orange-700",
  INTERNSHIP: "bg-purple-100 text-purple-700",
  FREELANCE:  "bg-teal-100 text-teal-700",
  TEMPORARY:  "bg-gray-100 text-gray-600",
};

const CIRCLE_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

let _counter = 0;

const getTimeAgo = (date: Date | string) => {
  const d = new Date(date);
  const diffDays = Math.ceil(Math.abs(Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const m = Math.floor(diffDays / 30);
  return `${m} month${m > 1 ? "s" : ""} ago`;
};

const formatType = (t: string) =>
  t.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

export default function JobCard({ job }: JobCardProps) {
  const typeStyle = JOB_TYPE_STYLE[job.jobType] || "bg-gray-100 text-gray-600";
  const initial = job.company?.name?.charAt(0)?.toUpperCase() || "?";
  // stable color per card based on company initial char code
  const circleStyle = CIRCLE_COLORS[initial.charCodeAt(0) % CIRCLE_COLORS.length];

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Row 1: job type badge + company initial */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 ${typeStyle}`}>
          <Briefcase className="h-3 w-3" />
          {formatType(job.jobType)}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${circleStyle}`}>
          {initial}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-0.5">
        {job.title}
      </h3>

      {/* Company */}
      <p className="text-xs text-muted-foreground mb-3">{job.company?.name}</p>

      {/* Location + type badge */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {job.location && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        )}
        <span className={`text-[11px] font-medium rounded-full px-2.5 py-0.5 ${typeStyle}`}>
          {formatType(job.jobType)}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">
          {job.salaryMin && job.salaryMax && job.salaryMin > 0
            ? job.salaryMin >= 1000
              ? `${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k`
              : `${job.salaryMin} – ${job.salaryMax}`
            : job.isNegotiable
            ? "Negotiable"
            : "Not specified"}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{getTimeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
