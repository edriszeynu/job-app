// actions/register.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

export async function register(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { name, email, password, role } = result.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      emailVerified: false, // default false
    },
  });

  // Generate verification token
  const token = randomUUID();
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // Send verification email
  const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${email}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ name, verificationLink }),
    });
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
    // Still return success but log the error – user can request a new verification link later
    // You may want to store a flag that email sending failed.
  }

  return { success: true };
}