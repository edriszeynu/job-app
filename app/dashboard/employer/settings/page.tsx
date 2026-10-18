"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Lock, Bell, Trash2, ShieldAlert, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

const notifItems = [
  { key: "email", label: "Email Notifications", desc: "Receive emails about your account activity" },
  { key: "newApplicants", label: "New Applicant Alerts", desc: "Get notified instantly when someone applies" },
  { key: "statusUpdates", label: "Application Status Updates", desc: "Track status changes on applications" },
  { key: "jobApproval", label: "Job Approval Notifications", desc: "Know when your job posts go live" },
] as const;

type NotifKey = typeof notifItems[number]["key"];

export default function EmployerSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [notifications, setNotifications] = useState<Record<NotifKey, boolean>>({
    email: true,
    newApplicants: true,
    statusUpdates: true,
    jobApproval: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPass = form.watch("newPassword");
  const strength = !newPass ? 0 : newPass.length < 8 ? 1 : newPass.length < 12 ? 2 : /[A-Z]/.test(newPass) && /[0-9]/.test(newPass) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"];

  const onSubmitPassword = async (data: PasswordValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast.success("Password updated successfully");
      form.reset();
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return toast.error('Type "DELETE" to confirm');
    toast.error("Account deletion is not yet implemented");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account security and preferences</p>
      </div>

      {/* ── Change Password ── */}
      <Card className="border-white/5 bg-card shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/20">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription className="text-xs mt-0.5">Use a strong password to keep your account safe</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-4">
              <FormField control={form.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showCurrent ? "text" : "password"} placeholder="••••••••" className="h-11 border-white/10 bg-white/5 pr-10 focus:border-primary/50" />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="newPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showNew ? "text" : "password"} placeholder="Min. 8 characters" className="h-11 border-white/10 bg-white/5 pr-10 focus:border-primary/50" />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    {newPass && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= strength ? strengthColor[strength] : "bg-white/10")} />
                          ))}
                        </div>
                        <p className={cn("text-xs", strength >= 3 ? "text-emerald-400" : strength === 2 ? "text-yellow-400" : "text-red-400")}>
                          {strengthLabel[strength]}
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Repeat password" className="h-11 border-white/10 bg-white/5 focus:border-primary/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button type="submit" disabled={isLoading} className="gap-2 shadow-lg shadow-primary/20">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : passwordSaved ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {isLoading ? "Updating…" : passwordSaved ? "Updated!" : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ── Notifications ── */}
      <Card className="border-white/5 bg-card shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5 ring-1 ring-blue-500/20">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription className="text-xs mt-0.5">Choose which alerts you want to receive</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {notifItems.map((item, i) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors hover:bg-white/[0.03]",
                i < notifItems.length - 1 && "border-b border-white/5"
              )}
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
              />
            </div>
          ))}
          <div className="pt-3">
            <Button
              onClick={() => toast.success("Preferences saved!")}
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="border-red-500/20 bg-card shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-2.5 ring-1 ring-red-500/20">
              <ShieldAlert className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-xs mt-0.5">This action is permanent and cannot be undone</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
            <p className="text-sm font-medium">Delete Company Account</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Permanently deletes your company profile, all job postings, and application data.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Type <span className="font-mono font-semibold text-foreground">DELETE</span> to confirm</p>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="h-10 max-w-xs border-white/10 bg-white/5 font-mono"
            />
          </div>
          <Button
            variant="destructive"
            disabled={deleteConfirm !== "DELETE"}
            onClick={handleDeleteAccount}
            className="gap-2 disabled:opacity-30"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
