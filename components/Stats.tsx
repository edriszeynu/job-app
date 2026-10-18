"use client";

import { Briefcase, Building2, Users } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface StatsProps {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
}

export default function Stats({ totalJobs, totalCompanies, totalUsers }: StatsProps) {
  const stats = [
    { label: "Jobs Available", value: totalJobs, icon: Briefcase, iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
    { label: "Companies", value: totalCompanies, icon: Building2, iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { label: "Active Users", value: totalUsers, icon: Users, iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-center gap-4 py-6 md:py-4 px-8">
              <div className={`rounded-xl ${stat.iconBg} p-3 shrink-0`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground leading-none">
                  <AnimatedCounter value={stat.value} />+
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
