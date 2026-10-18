import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "companies" }, (err, res) =>
      err ? reject(err) : resolve(res)
    ).end(buffer);
  });
  return result.secure_url;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id } });
  return NextResponse.json(company ?? {});
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const size = formData.get("size") as string;
  const headquarters = formData.get("headquarters") as string;
  const foundedYear = formData.get("foundedYear") as string;
  const website = formData.get("website") as string;
  const description = formData.get("description") as string;
  const linkedin = formData.get("linkedin") as string;
  const twitter = formData.get("twitter") as string;
  const facebook = formData.get("facebook") as string;
  const logoFile = formData.get("logo") as File | null;
  const coverFile = formData.get("coverImage") as File | null;

  let logoUrl: string | undefined;
  let coverUrl: string | undefined;

  if (logoFile && logoFile.size > 0) logoUrl = await uploadImage(logoFile);
  if (coverFile && coverFile.size > 0) coverUrl = await uploadImage(coverFile);

  const data: any = {
    name,
    industry: industry || undefined,
    size: size || undefined,
    headquarters: headquarters || undefined,
    foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
    website: website || undefined,
    description: description || undefined,
    ...(logoUrl && { logo: logoUrl }),
    ...(coverUrl && { coverImage: coverUrl }),
  };

  // socialLinks is a Json field — update separately to avoid Prisma validation issues
  const socialLinksData = { linkedin: linkedin || null, twitter: twitter || null, facebook: facebook || null };

  const existing = await prisma.company.findFirst({ where: { ownerId: session.user.id } });

  const company = existing
    ? await prisma.company.update({ where: { id: existing.id }, data })
    : await prisma.company.create({ data: { ...data, ownerId: session.user.id } });

  return NextResponse.json(company);
}
