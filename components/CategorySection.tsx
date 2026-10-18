"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp, Hammer, MessageCircle, BarChart2,
  Heart, Users, Cog, Megaphone,
} from "lucide-react";

const categories = [
  { name: "Business Development", count: 3, icon: TrendingUp, keyword: "Business" },
  { name: "Construction",          count: 0, icon: Hammer,        keyword: "Construction" },
  { name: "Customer Service",      count: 2, icon: MessageCircle, keyword: "Customer Service" },
  { name: "Finance",               count: 1, icon: BarChart2,     keyword: "Finance" },
  { name: "Healthcare",            count: 0, icon: Heart,         keyword: "Healthcare" },
  { name: "Human Resources",       count: 1, icon: Users,         keyword: "Human Resources" },
  { name: "Engineering",           count: 4, icon: Cog,           keyword: "Engineering" },
  { name: "Marketing",             count: 2, icon: Megaphone,     keyword: "Marketing" },
];

export default function CategorySection() {
  const router = useRouter();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Search by Category</h2>
            <p className="text-muted-foreground mt-1 text-sm">Search your career opportunity with our categories</p>
          </div>
          <Link href="/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => router.push(`/jobs?keyword=${encodeURIComponent(cat.keyword)}`)}
                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-blue-50 dark:bg-slate-800/60 hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 group-hover:bg-blue-500 flex items-center justify-center mb-3 shadow-sm transition-colors text-blue-600 group-hover:text-white dark:text-blue-400">
                  <Icon className="w-7 h-7" />
                </div>
                <p className="text-xs font-semibold text-foreground group-hover:text-white leading-tight">{cat.name}</p>
                <p className="text-xs text-muted-foreground group-hover:text-blue-100 mt-0.5">
                  {cat.count} open position{cat.count !== 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
