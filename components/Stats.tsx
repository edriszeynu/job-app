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
    { label: "Jobs Available", value: totalJobs, icon: Briefcase },
    { label: "Companies", value: totalCompanies, icon: Building2 },
    { label: "Active Users", value: totalUsers, icon: Users },
  ];

  return (
    <section className="py-12 border-b border-border/40 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-center gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
              <stat.icon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}