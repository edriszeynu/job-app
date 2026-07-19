// components/jobs/JobFilters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface JobFiltersProps {
  filters: {
    keyword: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    isRemote?: boolean;
    page: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function JobFilters({
  filters,
  onFilterChange,
  onReset,
  onSearch,
}: JobFiltersProps) {
  return (
    <>
      <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <Input
          placeholder="Keyword (title, company)"
          value={filters.keyword}
          onChange={(e) => onFilterChange("keyword", e.target.value)}
          className="col-span-1 md:col-span-2"
        />
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
        />
        <Select
          value={filters.jobType}
          onValueChange={(val) => onFilterChange("jobType", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
            <SelectItem value="PART_TIME">Part Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
            <SelectItem value="FREELANCE">Freelance</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.experienceLevel}
          onValueChange={(val) => onFilterChange("experienceLevel", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="ENTRY">Entry</SelectItem>
            <SelectItem value="JUNIOR">Junior</SelectItem>
            <SelectItem value="MID">Mid</SelectItem>
            <SelectItem value="SENIOR">Senior</SelectItem>
            <SelectItem value="LEAD">Lead</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 col-span-1 md:col-span-2 lg:col-span-1">
          <Button type="submit" className="flex-1">Search</Button>
          <Button type="button" variant="outline" onClick={onReset} className="px-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Remote/Onsite toggle */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          variant={filters.isRemote === true ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("isRemote", filters.isRemote === true ? undefined : true)}
        >
          Remote
        </Button>
        <Button
          variant={filters.isRemote === false ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("isRemote", filters.isRemote === false ? undefined : false)}
        >
          Onsite
        </Button>
        {filters.isRemote !== undefined && (
          <Button variant="ghost" size="sm" onClick={() => onFilterChange("isRemote", undefined)}>
            Clear
          </Button>
        )}
      </div>
    </>
  );
}