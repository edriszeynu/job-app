"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Phone, MapPin, ArrowRight } from "lucide-react";

interface InterviewCardProps {
  id: string;
  jobTitle: string;
  company: string;
  companyInitial: string;
  type: "Video" | "Phone" | "In Person";
  date: string;
  time: string;
  status: "UPCOMING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  action: string;
  actionLink: string;
}

const statusColors = {
  UPCOMING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const typeIcons = {
  Video: Video,
  Phone: Phone,
  "In Person": MapPin,
};

export default function InterviewCard({
  id,
  jobTitle,
  company,
  companyInitial,
  type,
  date,
  time,
  status,
  action,
  actionLink,
}: InterviewCardProps) {
  const TypeIcon = typeIcons[type];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-all hover:shadow-md">
      <div className="flex items-start md:items-center gap-4">
        <Avatar className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary/5">
          <AvatarFallback className="text-lg font-bold text-primary">
            {companyInitial}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{jobTitle}</h4>
            <Badge variant="outline">{company}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <TypeIcon className="h-3.5 w-3.5" />
              {type}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {time}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <Badge className={statusColors[status]}>
          {status}
        </Badge>
        <Link href={actionLink}>
          <Button size="sm" className="gap-1">
            {action}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}