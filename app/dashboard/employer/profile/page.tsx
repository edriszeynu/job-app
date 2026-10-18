"use client";

import { useState, useEffect, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Building2, Globe, MapPin, Calendar, Users, Upload, X, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

const LinkedInIcon = () => (
  <svg className="h-4 w-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg className="h-4 w-4 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const profileSchema = z.object({
  name: z.string().min(2),
  industry: z.string().optional(),
  size: z.string().optional(),
  headquarters: z.string().optional(),
  foundedYear: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
});
type ProfileValues = z.infer<typeof profileSchema>;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
    {children}
  </div>
);

export default function CompanyProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", industry: "", size: "", headquarters: "", foundedYear: "", website: "", description: "", linkedin: "", twitter: "", facebook: "" },
  });

  useEffect(() => {
    fetch("/api/employer/company").then(async (r) => {
      if (!r.ok) return;
      const d = await r.json();
      if (!d || !("name" in d)) return;
      setCompany(d);
      form.reset({
        name: d.name || "", industry: d.industry || "", size: d.size || "",
        headquarters: d.headquarters || "", foundedYear: d.foundedYear?.toString() || "",
        website: d.website || "", description: d.description || "",
        linkedin: d.socialLinks?.linkedin || "", twitter: d.socialLinks?.twitter || "",
        facebook: d.socialLinks?.facebook || "",
      });
      if (d.logo) setLogoPreview(d.logo);
      if (d.coverImage) setCoverPreview(d.coverImage);
    });
  }, [form]);

  const onSubmit = async (data: ProfileValues) => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (logoFile) fd.append("logo", logoFile);
      if (coverFile) fd.append("coverImage", coverFile);
      const res = await fetch("/api/employer/company", { method: "PUT", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast.success("Company profile saved!");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your public profile visible to all job seekers</p>
        </div>
        {company && (
          <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${
            company.isApproved
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
          }`}>
            {company.isApproved
              ? <><ShieldCheck className="h-3.5 w-3.5" /> Verified</>
              : <><Clock className="h-3.5 w-3.5" /> Pending Verification</>
            }
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Branding Card ── */}
          <Card className="overflow-hidden border-white/5 bg-card shadow-lg">
            {/* Cover image strip */}
            <div
              className="relative h-36 cursor-pointer bg-linear-to-r from-primary/20 via-primary/10 to-primary/5 transition-opacity hover:opacity-90"
              onClick={() => coverRef.current?.click()}
            >
              {coverPreview
                ? <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground/60">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs">Click to upload cover · 1200×300px</span>
                  </div>
                )
              }
              {coverPreview && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCoverFile(null); setCoverPreview(null); if (coverRef.current) coverRef.current.value = ""; }}
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <input ref={coverRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} className="hidden" />
            </div>

            {/* Logo + company name row */}
            <div className="relative flex items-end gap-4 px-6 pb-5">
              {/* Logo */}
              <div className="relative -mt-10 shrink-0">
                <div
                  className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-background bg-card shadow-xl ring-2 ring-primary/20 transition-opacity hover:opacity-80"
                  onClick={() => logoRef.current?.click()}
                >
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    : <Building2 className="h-8 w-8 text-muted-foreground" />
                  }
                </div>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); setLogoPreview(null); if (logoRef.current) logoRef.current.value = ""; }}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <input ref={logoRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); } }} className="hidden" />
              </div>
              <div className="pb-1">
                <p className="font-semibold">{form.watch("name") || "Your Company"}</p>
                <p className="text-xs text-muted-foreground">{form.watch("industry") || "Industry not set"}</p>
              </div>
            </div>
          </Card>

          {/* ── Details Card ── */}
          <Card className="border-white/5 bg-card shadow-lg">
            <CardContent className="space-y-8 p-6">

              <Section title="Basic Information">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Company Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Acme Inc." className="h-10 border-white/10 bg-white/5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Industry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger className="h-10 border-white/10 bg-white/5">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Technology","Healthcare","Finance","Education","Retail","Manufacturing","Media","Consulting","Other"].map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField control={form.control} name="size" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Company Size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger className="h-10 border-white/10 bg-white/5">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["1-10","11-50","51-200","201-500","500+"].map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="headquarters" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Headquarters</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input {...field} placeholder="San Francisco, CA" className="h-10 border-white/10 bg-white/5 pl-8" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="foundedYear" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Founded Year</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input {...field} placeholder="2020" className="h-10 border-white/10 bg-white/5 pl-8" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Website</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input {...field} placeholder="https://yourcompany.com" className="h-10 border-white/10 bg-white/5 pl-8" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">About the Company</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="What does your company do? What's your mission?" className="min-h-28 resize-none border-white/10 bg-white/5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </Section>

              <div className="border-t border-white/5" />

              <Section title="Social Links">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { name: "linkedin" as const, icon: <LinkedInIcon />, placeholder: "linkedin.com/company/…" },
                    { name: "twitter" as const, icon: <TwitterIcon />, placeholder: "twitter.com/…" },
                    { name: "facebook" as const, icon: <FacebookIcon />, placeholder: "facebook.com/…" },
                  ].map(({ name, icon, placeholder }) => (
                    <FormField key={name} control={form.control} name={name} render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
                            <Input {...field} placeholder={placeholder} className="h-10 border-white/10 bg-white/5 pl-9 text-sm" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                </div>
              </Section>

            </CardContent>
          </Card>

          {/* Save button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                : <><CheckCircle2 className="h-4 w-4" /> Save Changes</>
              }
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
