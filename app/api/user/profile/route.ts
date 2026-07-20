// app/api/user/profile/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for updating profile
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().optional().nullable(),
  // Add more fields as needed
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return combined user + profile data
    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.profile?.phone || null,
      bio: user.profile?.bio || null,
      location: user.profile?.location || null,
      // Add more fields as needed
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate input
    const validated = updateProfileSchema.parse(body);

    // Update user name if provided
    const updateData: any = {};
    if (validated.name) {
      updateData.name = validated.name;
    }

    // Update user profile
    // First, get or create profile
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await prisma.userProfile.create({
        data: {
          userId,
        },
      });
    }

    // Update profile fields
    const profileUpdateData: any = {};
    if (validated.phone !== undefined) {
      profileUpdateData.phone = validated.phone;
    }
    if (validated.bio !== undefined) {
      profileUpdateData.bio = validated.bio;
    }
    if (validated.location !== undefined) {
      profileUpdateData.location = validated.location;
    }

    // Perform updates in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: updateData,
      }),
      prisma.userProfile.update({
        where: { userId },
        data: profileUpdateData,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}