"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2, X, Plus, Briefcase, MapPin, DollarSign,
  FileText, Tag, ChevronRight, ChevronLeft, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  jobType: z.string().min(1, "Please select a job type"),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  category: z.string().optional(),
  location: z.string().optional(),
  isRemote: z.boolean(),
  isHybrid: z.boolean(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  currency: z.string(),
  isNegotiable: z.boolean(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
});

type JobValues = z.infer<typeof jobSchema>;

const steps = [
  { id: 1, label: "Basic Info", icon: Briefcase },
  { id: 2, label: "Location & Pay", icon: MapPin },
  { id: 3, label: "Details", icon: FileText },
  { id: 4, label: "Skills", icon: Tag },
];

export default function PostJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "", jobType: "", experienceLevel: "", category: "",
      location: "", isRemote: false, isHybrid: false,
      salaryMin: "", salaryMax: "", currency: "USD", isNegotiable: false,
      description: "", responsibilities: "", requirements: "",
    },
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(""); }
  };

  const publishJob = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix validation errors before publishing.");
      return;
    }
    const data = form.getValues();
    setIsLoading(true);
    try {
      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          salaryMin: Number(data.salaryMin) > 0 ? Number(data.salaryMin) : null,
          salaryMax: Number(data.salaryMax) > 0 ? Number(data.salaryMax) : null,
          skills,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast.success("Job posted! It will be visible after approval.");
      router.push("/dashboard/employer/jobs");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fields: Record<number, (keyof JobValues)[]> = {
      1: ["title", "jobType", "experienceLevel"],
      2: [],
      3: ["description"],
    };
    const valid = await form.trigger(fields[currentStep] || []);
    if (valid) setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground text-sm mt-1">Attract top talent with a detailed job listing</p>
      </div>

      {/* Step indicator */}
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border mx-8 z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => done && setCurrentStep(step.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    done ? "border-primary bg-primary text-primary-foreground" :
                    active ? "border-primary bg-background text-primary shadow-lg shadow-primary/20" :
                    "border-border bg-background text-muted-foreground"
                  )}
                >
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block",
                  active ? "text-primary" : done ? "text-primary/70" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border/50 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <div>

              {/* Step 1 — Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                    <div className="rounded-xl bg-primary/10 p-2.5">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Basic Information</h2>
                      <p className="text-sm text-muted-foreground">Tell us about the role</p>
                    </div>
                  </div>

                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Senior Frontend Developer" className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="jobType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Type <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP","FREELANCE","TEMPORARY"].map(v => (
                              <SelectItem key={v} value={v}>{v.replace("_", " ")}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["ENTRY","JUNIOR","MID","SENIOR","LEAD"].map(v => (
                              <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Engineering, Design, Marketing" className="h-11" />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              )}

              {/* Step 2 — Location & Salary */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                    <div className="rounded-xl bg-emerald-500/10 p-2.5">
                      <MapPin className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Location & Compensation</h2>
                      <p className="text-sm text-muted-foreground">Where and what's the pay?</p>
                    </div>
                  </div>

                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input {...field} placeholder="e.g., New York, NY" className="pl-9 h-11" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />

                  <div className="flex gap-6">
                    <FormField control={form.control} name="isRemote" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 flex-1">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel className="cursor-pointer font-medium">Remote</FormLabel>
                          <p className="text-xs text-muted-foreground">Work from anywhere</p>
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="isHybrid" render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 flex-1">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel className="cursor-pointer font-medium">Hybrid</FormLabel>
                          <p className="text-xs text-muted-foreground">Mix of remote & office</p>
                        </div>
                      </FormItem>
                    )} />
                  </div>

                  <div className="rounded-xl border border-border/50 bg-muted/10 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Salary Range
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField control={form.control} name="salaryMin" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Min</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="e.g. 40000" className="h-10" />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="salaryMax" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Max</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="80,000" className="h-10" />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="currency" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Currency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["USD","EUR","GBP","CAD","AUD"].map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="isNegotiable" render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-sm">Salary is negotiable</FormLabel>
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}

              {/* Step 3 — Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                    <div className="rounded-xl bg-violet-500/10 p-2.5">
                      <FileText className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Job Details</h2>
                      <p className="text-sm text-muted-foreground">Help candidates understand the role</p>
                    </div>
                  </div>

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the role, what you're building, and why it's exciting..." className="min-h-36 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="responsibilities" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="• Lead frontend development&#10;• Collaborate with design team&#10;• Mentor junior developers" className="min-h-28 resize-none" />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="requirements" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements & Qualifications</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="• 3+ years of React experience&#10;• Strong TypeScript skills&#10;• Experience with REST APIs" className="min-h-28 resize-none" />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              )}

              {/* Step 4 — Skills + Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                    <div className="rounded-xl bg-orange-500/10 p-2.5">
                      <Tag className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Skills & Review</h2>
                      <p className="text-sm text-muted-foreground">Add required skills and review your listing</p>
                    </div>
                  </div>

                  {/* Skills input */}
                  <div className="space-y-3">
                    <FormLabel>Required Skills</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="e.g., React, TypeScript, Node.js"
                        className="h-11"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      />
                      <Button type="button" variant="outline" onClick={addSkill} className="h-11 px-4">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/20 border border-border/40">
                        {skills.map((s) => (
                          <Badge key={s} variant="secondary" className="gap-1.5 pl-3 pr-1.5 py-1">
                            {s}
                            <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))} className="rounded-full hover:bg-muted p-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review summary — only show after at least one skill is added */}
                  {skills.length > 0 && (
                  <div className="rounded-xl border border-border/50 bg-muted/10 p-5 space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Review Summary</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { label: "Title", value: form.watch("title") },
                        { label: "Type", value: form.watch("jobType") },
                        { label: "Level", value: form.watch("experienceLevel") },
                        { label: "Location", value: form.watch("location") || (form.watch("isRemote") ? "Remote" : "—") },
                        { label: "Salary", value: form.watch("salaryMin") ? `${form.watch("currency")} ${form.watch("salaryMin")} – ${form.watch("salaryMax")}` : "Not specified" },
                        { label: "Skills", value: skills.length > 0 ? `${skills.length} added` : "None" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">{label}</span>
                          <span className="font-medium truncate">{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-600 dark:text-yellow-400">
                    ⏳ Your job will be reviewed and published within 24 hours.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => currentStep > 1 ? setCurrentStep(s => s - 1) : router.push("/dashboard/employer/jobs")}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep} className="gap-2 bg-primary hover:bg-primary/90">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={publishJob}
                    disabled={isLoading}
                    className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 min-w-32"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Publishing...</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4" />Publish Job</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
