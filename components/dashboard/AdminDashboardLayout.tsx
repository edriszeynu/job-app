"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, Building2, Briefcase,
  BarChart3, Settings, FileText, Flag,
  LogOut, PanelLeft, X, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/employers", label: "Employers", icon: Building2 },
  { href: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin/reports", label: "Reports", icon: Flag },
  { href: "/dashboard/admin/cms", label: "CMS", icon: FileText },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-border/30">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Admin Panel</p>
            <p className="text-xs text-muted-foreground mt-0.5">JobHub</p>
          </div>
        </Link>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-b border-border/30">
        <div className="flex items-center gap-2.5 rounded-lg bg-primary/5 px-2.5 py-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{session?.user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard/admin" && pathname?.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-border/30">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Derive page title from pathname
  const currentNav = navItems.find(
    (n) => pathname === n.href || (n.href !== "/dashboard/admin" && pathname?.startsWith(n.href + "/"))
  );
  const pageTitle = currentNav?.label ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r border-border/30 bg-background transition-all duration-200 overflow-hidden",
          sidebarOpen ? "w-[160px]" : "w-0"
        )}
      >
        <SidebarNav />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <header className="h-11 shrink-0 flex items-center gap-3 px-4 border-b border-border/30 bg-background">
          {/* Sidebar toggle — desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </button>

          {/* Mobile sidebar toggle */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[180px] p-0">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <span className="text-sm font-medium text-muted-foreground">{pageTitle}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
