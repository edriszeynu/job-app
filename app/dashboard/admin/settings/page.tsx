"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "JobHub",
    contactEmail: "",
    supportEmail: "",
    currency: "USD",
    timezone: "UTC",
    autoApproveJobs: false,
    jobExpirationDays: 30,
    maxJobsPerEmployer: 10,
    featuredJobPrice: 49,
    allowRegistration: true,
    requireEmailVerification: true,
    defaultRole: "JOB_SEEKER",
    maintenanceMode: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground">Configure global platform settings</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic platform information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input
                  value={settings.platformName}
                  onChange={(e) =>
                    setSettings({ ...settings, platformName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  placeholder="contact@jobhub.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  placeholder="support@jobhub.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Job Settings</CardTitle>
            <CardDescription>Configure job posting rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto‑approve jobs</p>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new job postings
                </p>
              </div>
              <Switch
                checked={settings.autoApproveJobs}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoApproveJobs: checked })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Job Expiration (days)</Label>
                <Input
                  type="number"
                  value={settings.jobExpirationDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      jobExpirationDays: parseInt(e.target.value) || 30,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max Jobs per Employer</Label>
                <Input
                  type="number"
                  value={settings.maxJobsPerEmployer}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxJobsPerEmployer: parseInt(e.target.value) || 10,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Job Price ($)</Label>
                <Input
                  type="number"
                  value={settings.featuredJobPrice}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      featuredJobPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          className="w-full md:w-auto gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  );
}