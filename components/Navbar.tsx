"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          JobHub
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
            Find Jobs
          </Link>
          <Link href="/companies" className="text-sm font-medium hover:text-primary transition-colors">
            Companies
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <ThemeToggle />
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/70">Get Started</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/40 p-4 space-y-3 bg-background/95 backdrop-blur">
          <Link href="/jobs" className="block text-sm font-medium hover:text-primary">Find Jobs</Link>
          <Link href="/companies" className="block text-sm font-medium hover:text-primary">Companies</Link>
          <Link href="/about" className="block text-sm font-medium hover:text-primary">About</Link>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="w-full bg-gradient-to-r from-primary to-primary/70">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}