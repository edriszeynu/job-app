"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Briefcase, Building2, X, Plus, Save, Eye } from "lucide-react";

// SVG Icons
const DollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  jobType: z.string().min(1, "Please select a job type"),
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
  experienceLevel: z.string().min(1, "Please select an experience level"),
  isActive: z.boolean(),
});

type JobValues = z.infer<typeof jobSchema>;

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Unwrap params using React.use()
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      jobType: "",
      category: "",
      location: "",
      isRemote: false,
      isHybrid: false,
      salaryMin: "",
      salaryMax: "",
      currency: "USD",
      isNegotiable: false,
      description: "",
      responsibilities: "",
      requirements: "",
      experienceLevel: "",
      isActive: true,
    },
  });

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/employer/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
          form.reset({
            title: data.title || "",
            jobType: data.jobType || "",
            category: data.category || "",
            location: data.location || "",
            isRemote: data.isRemote || false,
            isHybrid: data.isHybrid || false,
            salaryMin: data.salaryMin?.toString() || "",
            salaryMax: data.salaryMax?.toString() || "",
            currency: data.currency || "USD",
            isNegotiable: data.isNegotiable || false,
            description: data.description || "",
            responsibilities: data.responsibilities || "",
            requirements: data.requirements || "",
            experienceLevel: data.experienceLevel || "",
            isActive: data.isActive !== undefined ? data.isActive : true,
          });
          setSkills(data.skills || []);
        } else {
          toast.error("Failed to load job");
          router.push("/dashboard/employer/jobs");
        }
      } catch (error) {
        toast.error("Failed to load job");
        router.push("/dashboard/employer/jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, form, router]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = async (data: JobValues) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : null,
        skills,
      };

      const res = await fetch(`/api/employer/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Job updated successfully!");
        router.push("/dashboard/employer/jobs");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update job");
      }
    } catch (error) {
      toast.error("Failed to update job");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Job</h2>
          <p className="text-muted-foreground">Update your job posting</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5">
            <Briefcase className="h-3 w-3" />
            {job?.title}
          </Badge>
          <Link href={`/jobs/${id}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about the role</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Job Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Title <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Senior Frontend Developer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Type */}
                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Type <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FULL_TIME">Full Time</SelectItem>
                              <SelectItem value="PART_TIME">Part Time</SelectItem>
                              <SelectItem value="CONTRACT">Contract</SelectItem>
                              <SelectItem value="INTERNSHIP">Internship</SelectItem>
                              <SelectItem value="FREELANCE">Freelance</SelectItem>
                              <SelectItem value="TEMPORARY">Temporary</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Engineering, Design, Marketing" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="San Francisco, CA" className="pl-9" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remote / Hybrid Toggles */}
                  <div className="flex flex-wrap gap-4">
                    <FormField
                      control={form.control}
                      name="isRemote"
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Remote</FormLabel>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isHybrid"
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Hybrid</FormLabel>
                        </div>
                      )}
                    />
                  </div>

                  {/* Experience Level */}
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Experience Level <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ENTRY">Entry</SelectItem>
                            <SelectItem value="JUNIOR">Junior</SelectItem>
                            <SelectItem value="MID">Mid</SelectItem>
                            <SelectItem value="SENIOR">Senior</SelectItem>
                            <SelectItem value="LEAD">Lead</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Salary */}
                  <div>
                    <FormLabel>Salary Range</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1.5">
                      <FormField
                        control={form.control}
                        name="salaryMin"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <DollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input {...field} type="number" placeholder="Min" className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="salaryMax"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <DollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input {...field} type="number" placeholder="Max" className="pl-9" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="isNegotiable"
                      render={({ field }) => (
                        <div className="flex items-center gap-2 mt-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-medium">
                            Salary is negotiable
                          </FormLabel>
                        </div>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Description <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                            className="min-h-[150px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Responsibilities */}
                  <FormField
                    control={form.control}
                    name="responsibilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Responsibilities</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="List the key responsibilities for this role..."
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Requirements */}
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="List the qualifications and requirements..."
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skills */}
                  <div>
                    <FormLabel>Skills</FormLabel>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill (e.g., React)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Posting Status */}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          {field.value ? "Job is active" : "Job is paused"}
                        </FormLabel>
                      </div>
                    )}
                  />

                  <Separator />

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/employer/jobs")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-background sticky top-20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Job Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="text-sm font-medium">{job?.title}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{job?.company?.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <UsersIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                  <p className="text-sm font-medium">{job?._count?.applications || 0}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ClockIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Posted</p>
                  <p className="text-sm font-medium">
                    {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Badge
                variant={job?.isActive ? "default" : "outline"}
                className="w-full justify-center"
              >
                {job?.isActive ? "Active" : "Paused"}
              </Badge>
              <Link href={`/dashboard/employer/applicants?job=${id}`} className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  <UsersIcon className="h-4 w-4" />
                  View Applicants
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}