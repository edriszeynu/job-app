// lib/admin-auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "Unauthorized", status: 401, session: null };
  }

  const u = session.user as any;
  if (u.role !== "ADMIN" && !u.isAdmin && !u.isSuperAdmin && u.email !== "admin@jobhub.com") {
    return { error: "Forbidden - Admin access required", status: 403, session: null };
  }

  return { error: null, status: 200, session };
}

export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "Unauthorized", status: 401, session: null };
  }

  // Check if user has super admin privileges
  // You can add a isSuperAdmin field to the User model
  // For now, only the first admin is super admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperAdmin: true },
  });

  if (!user?.isSuperAdmin) {
    return { error: "Forbidden - Super Admin access required", status: 403, session: null };
  }

  return { error: null, status: 200, session };
}