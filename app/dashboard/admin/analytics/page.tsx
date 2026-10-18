"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, Building2, FileText, TrendingUp, RefreshCw } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Jobs", "Applications"];
const PIE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-card px-3 py-2 shadow-xl text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-semibold" style={{ color: p.color }}>{p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) setData(await res.json());
    } catch { console.error("Failed to fetch analytics"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center min-h-96 text-muted-foreground">
      Failed to load analytics data.
    </div>
  );

  const { stats, userGrowth, appGrowth, jobTypes } = data;

  const statCards = [
    { label: "Total Users",    value: stats.totalUsers,        icon: Users,     color: "text-blue-400",   bg: "bg-blue-400/10",   ring: "ring-blue-400/20",   glow: "shadow-blue-500/10" },
    { label: "Total Jobs",     value: stats.totalJobs,         icon: Briefcase, color: "text-amber-400",  bg: "bg-amber-400/10",  ring: "ring-amber-400/20",  glow: "shadow-amber-500/10" },
    { label: "Companies",      value: stats.totalCompanies,    icon: Building2, color: "text-violet-400", bg: "bg-violet-400/10", ring: "ring-violet-400/20", glow: "shadow-violet-500/10" },
    { label: "Applications",   value: stats.totalApplications, icon: FileText,  color: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20", glow: "shadow-emerald-500/10" },
  ];

  const pieData = (jobTypes || []).map((j: any) => ({
    name: j.jobType.replace(/_/g, " "),
    value: j._count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Platform metrics and growth insights</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 h-9 px-4 rounded-xl border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className={`relative overflow-hidden rounded-2xl border border-white/5 bg-card p-5 shadow-lg ${s.glow} hover:-translate-y-0.5 hover:shadow-xl transition-all`}>
            <div className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full ${s.bg} blur-xl`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{s.value.toLocaleString()}</p>
              </div>
              <div className={`rounded-xl ${s.bg} p-2.5 ring-1 ${s.ring}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-xl border border-white/5 bg-muted/20 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === "Overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* User Growth */}
          <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-lg">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="rounded-lg bg-blue-400/10 p-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">User Growth</p>
                <p className="text-xs text-muted-foreground">New users — last 7 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userGrowth} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Job Type Distribution */}
          <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-lg">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="rounded-lg bg-amber-400/10 p-2">
                <Briefcase className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Job Types</p>
                <p className="text-xs text-muted-foreground">Distribution by type</p>
              </div>
            </div>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">No data</div>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {pieData.map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {pieData.map((entry: any, i: number) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-muted-foreground">{entry.name}</span>
                      </div>
                      <span className="font-semibold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "Jobs" && (
        <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="rounded-lg bg-amber-400/10 p-2">
              <Briefcase className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Job Activity</p>
              <p className="text-xs text-muted-foreground">Job postings — last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appGrowth} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "Applications" && (
        <div className="rounded-2xl border border-white/5 bg-card p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="rounded-lg bg-emerald-400/10 p-2">
              <FileText className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Application Trend</p>
              <p className="text-xs text-muted-foreground">Daily applications — last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={appGrowth} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fill="url(#appGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
