// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// Default settings
const defaultSettings = {
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
};

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    // Get all settings from database
    const settingsRecords = await prisma.setting.findMany();

    // Convert to object
    const settings: Record<string, any> = {};
    settingsRecords.forEach((record) => {
      settings[record.key] = record.value;
    });

    // Merge with defaults
    const mergedSettings = { ...defaultSettings, ...settings };

    return NextResponse.json(mergedSettings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();

    // Update each setting
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      });
    });

    await prisma.$transaction(updates);

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.session.user.id,
        action: "UPDATE_SETTINGS",
        details: { keys: Object.keys(body) },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}