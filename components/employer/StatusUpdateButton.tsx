"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

const STATUSES = ["PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEW", "OFFERED", "HIRED", "REJECTED"];

const statusConfig: Record<string, { color: string; bg: string; border: string; dot: string; label: string }> = {
  PENDING: { 
    color: "text-yellow-600 dark:text-yellow-400", 
    bg: "bg-yellow-500/10", 
    border: "border-yellow-500/30", 
    dot: "bg-yellow-500",
    label: "Pending"
  },
  REVIEWING: { 
    color: "text-blue-600 dark:text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/30", 
    dot: "bg-blue-500",
    label: "Reviewing"
  },
  SHORTLISTED: { 
    color: "text-purple-600 dark:text-purple-400", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/30", 
    dot: "bg-purple-500",
    label: "Shortlisted"
  },
  INTERVIEW: { 
    color: "text-orange-600 dark:text-orange-400", 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/30", 
    dot: "bg-orange-500",
    label: "Interview"
  },
  OFFERED: { 
    color: "text-green-600 dark:text-green-400", 
    bg: "bg-green-500/10", 
    border: "border-green-500/30", 
    dot: "bg-green-500",
    label: "Offered"
  },
  HIRED: { 
    color: "text-emerald-600 dark:text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/30", 
    dot: "bg-emerald-500",
    label: "Hired"
  },
  REJECTED: { 
    color: "text-red-600 dark:text-red-400", 
    bg: "bg-red-500/10", 
    border: "border-red-500/30", 
    dot: "bg-red-500",
    label: "Rejected"
  },
};

export default function StatusUpdateButton({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/employer/applications/${applicationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        toast.success(`Status updated to ${statusConfig[newStatus]?.label || newStatus}`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
    setLoading(false);
    setIsExpanded(false);
  };

  const toggleDropdown = () => {
    if (!isExpanded && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setIsExpanded(!isExpanded);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isExpanded &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        // Check if click is on the dropdown itself (portal)
        const dropdown = document.getElementById("status-dropdown");
        if (dropdown && dropdown.contains(e.target as Node)) return;
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const config = statusConfig[status] || statusConfig.PENDING;
  const displayLabel = config?.label || status;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        disabled={loading}
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          border transition-all duration-300
          ${config.bg} ${config.color} ${config.border}
          hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
          ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {loading ? (
          <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dot}`} />
            <span>{displayLabel}</span>
            {isExpanded ? (
              <ChevronUp className="h-2.5 w-2.5 opacity-60" />
            ) : (
              <ChevronDown className="h-2.5 w-2.5 opacity-60" />
            )}
          </>
        )}
      </button>

      {isExpanded &&
        createPortal(
          <div
            id="status-dropdown"
            className="fixed z-[9999] min-w-[200px] rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground border-b border-border/30">
              Change status
            </p>
            <div className="grid grid-cols-2 gap-1 mt-1.5">
              {STATUSES.map((s) => {
                const isActive = s === status;
                const cfg = statusConfig[s];
                return (
                  <button
                    key={s}
                    onClick={() => handleUpdate(s)}
                    className={`
                      inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full text-[10px] font-medium
                      border transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-1 ring-primary/40 shadow-sm` 
                        : `bg-muted/30 hover:bg-muted/60 text-muted-foreground border-transparent hover:border-border/50`
                      }
                      hover:scale-[1.05] active:scale-[0.95]
                    `}
                  >
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <span>{s}</span>
                    {isActive && <Check className="h-2.5 w-2.5" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-border/30 flex justify-end">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}