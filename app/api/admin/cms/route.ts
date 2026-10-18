import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const type = request.nextUrl.searchParams.get("type") || "pages";

  if (type === "pages") {
    const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
    return NextResponse.json(pages);
  }
  if (type === "faq") {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(faqs);
  }
  if (type === "blog") {
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } });
    return NextResponse.json(blogs);
  }
  return NextResponse.json([]);
}
