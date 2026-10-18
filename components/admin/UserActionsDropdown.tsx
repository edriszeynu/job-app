"use client";

import { useState } from "react";
import { MoreVertical, UserCheck, Briefcase, Shield, ShieldOff, Trash2 } from "lucide-react";
import { changeUserRole, makeUserAdmin, deleteUser } from "@/actions/admin";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  userName: string;
  role: string;
  isAdmin: boolean;
}

export default function UserActionsDropdown({ userId, userName, role, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAction = async (fn: () => Promise<void>) => {
    setOpen(false);
    await fn();
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 hover:bg-muted transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-border/50 bg-card shadow-xl py-1">
            {role !== "JOB_SEEKER" && (
              <button
                type="button"
                onClick={() => handleAction(() => changeUserRole(userId, "JOB_SEEKER"))}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <UserCheck className="h-4 w-4 text-blue-400" />
                Set as Job Seeker
              </button>
            )}
            {role !== "EMPLOYER" && (
              <button
                type="button"
                onClick={() => handleAction(() => changeUserRole(userId, "EMPLOYER"))}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Briefcase className="h-4 w-4 text-emerald-400" />
                Set as Employer
              </button>
            )}
            <div className="my-1 border-t border-border/40" />
            {!isAdmin ? (
              <button
                type="button"
                onClick={() => handleAction(() => makeUserAdmin(userId, true))}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 text-red-400" />
                Make Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAction(() => makeUserAdmin(userId, false))}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <ShieldOff className="h-4 w-4 text-muted-foreground" />
                Remove Admin
              </button>
            )}
            <div className="my-1 border-t border-border/40" />
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete ${userName}? This cannot be undone.`)) {
                  handleAction(() => deleteUser(userId));
                }
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}
