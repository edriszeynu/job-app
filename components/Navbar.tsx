"use client";

import Link from "next/link";
import { Menu, LogOut, User, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = () => signOut({ callbackUrl: "/" });

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          JobHub
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">Find Jobs</Link>
          <Link href="/companies" className="text-sm font-medium hover:text-primary transition-colors">Companies</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>

          <ThemeToggle />

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="avatar" className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="max-w-[100px] truncate">{session.user?.name?.split(" ")[0]}</span>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border/50 bg-background shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg px-3 h-8 text-sm font-medium hover:bg-muted transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="inline-flex items-center justify-center rounded-lg px-3 h-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 p-4 space-y-3 bg-background">
          <Link href="/jobs" className="block text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Find Jobs</Link>
          <Link href="/companies" className="block text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Companies</Link>
          <Link href="/about" className="block text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>About</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
            {session ? (
              <>
                <Link href="/dashboard" className="block text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-destructive">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-lg border border-border h-9 text-sm font-medium hover:bg-muted transition-colors w-full" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="inline-flex items-center justify-center rounded-lg h-9 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80 transition-colors w-full" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
