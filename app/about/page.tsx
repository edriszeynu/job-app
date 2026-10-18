import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target, Users, Zap, Heart, Globe, Shield,
  ArrowRight, Briefcase, Star, TrendingUp,
} from "lucide-react";

const stats = [
  { value: "50K+", label: "Jobs Posted" },
  { value: "120K+", label: "Job Seekers" },
  { value: "8K+", label: "Companies" },
  { value: "98%", label: "Satisfaction Rate" },
];

const values = [
  { icon: Target, title: "Mission First", desc: "We connect talent with opportunity — that's not just our job, it's our purpose.", color: "text-blue-400 bg-blue-400/10" },
  { icon: Shield, title: "Trust & Safety", desc: "Every company is verified. Every job is screened. Your safety is non-negotiable.", color: "text-emerald-400 bg-emerald-400/10" },
  { icon: Zap, title: "Speed & Simplicity", desc: "Apply in minutes. Hire in days. We remove friction at every step.", color: "text-amber-400 bg-amber-400/10" },
  { icon: Heart, title: "People Over Profit", desc: "We measure success by the careers we launch, not just the revenue we generate.", color: "text-rose-400 bg-rose-400/10" },
  { icon: Globe, title: "Inclusive by Design", desc: "Opportunities for everyone, regardless of background, location, or experience.", color: "text-violet-400 bg-violet-400/10" },
  { icon: TrendingUp, title: "Continuous Growth", desc: "We're always improving — listening to users to build what matters most.", color: "text-cyan-400 bg-cyan-400/10" },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-founder", initials: "SC", color: "from-blue-500 to-cyan-500" },
  { name: "Marcus Reid", role: "CTO & Co-founder", initials: "MR", color: "from-violet-500 to-purple-500" },
  { name: "Amara Diallo", role: "Head of Design", initials: "AD", color: "from-rose-500 to-pink-500" },
  { name: "Luca Ferrari", role: "Head of Engineering", initials: "LF", color: "from-emerald-500 to-teal-500" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-border/40 py-24 md:py-32">
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="container relative mx-auto max-w-4xl px-4 text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 text-primary">
              Our Story
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Building the Future<br />
              <span className="bg-linear-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
                of Work, Together
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              JobHub was born from a simple belief: finding meaningful work should be easier, faster, and more human.
              We're building the platform we always wished existed.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/jobs">
                <Button className="gap-2 shadow-lg shadow-primary/25">
                  Browse Jobs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/companies">
                <Button variant="outline" className="gap-2 border-border/50">
                  Explore Companies
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="border-b border-border/40 bg-muted/20 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-bold tracking-tight text-primary md:text-5xl">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">Our Mission</Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Connecting talent with<br />the right opportunities.
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  At JobHub, we believe every professional deserves access to meaningful work — and every great company deserves to find the right people. We've built a platform that makes that connection simple, transparent, and efficient.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  From early-career seekers to seasoned executives, from startups to enterprises — our platform serves everyone with the same level of care and precision.
                </p>
              </div>
              {/* Visual */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-xl space-y-4">
                  {[
                    { icon: "🎯", title: "Smart Job Matching", desc: "AI-powered recommendations tailored to your skills and goals." },
                    { icon: "🏢", title: "Verified Companies", desc: "Every employer is reviewed so you apply with confidence." },
                    { icon: "⚡", title: "Fast Application Process", desc: "Apply in minutes with your JobHub profile — no repeated forms." },
                  ].map((f) => (
                    <div key={f.title} className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                      <span className="text-2xl">{f.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{f.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="border-y border-border/40 bg-muted/10 py-20 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">What Drives Us</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Values</h2>
              <p className="mt-3 text-muted-foreground">The principles behind every decision we make</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <div className={`mb-4 inline-flex rounded-xl p-2.5 ${v.color}`}>
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">The Team</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Meet the Builders</h2>
              <p className="mt-3 text-muted-foreground">A small team with a big mission</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <div key={m.name} className="group rounded-2xl border border-border/50 bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${m.color} text-lg font-bold text-white shadow-lg`}>
                    {m.initials}
                  </div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-border/40 bg-linear-to-br from-primary/10 via-primary/5 to-transparent py-20">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to find your next opportunity?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of professionals who found their dream jobs through JobHub.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="gap-2 border-border/50">
                  <Briefcase className="h-4 w-4" /> Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
