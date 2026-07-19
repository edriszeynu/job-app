// hooks/useJobs.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface JobFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  page?: number;
  limit?: number;
}

export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.experienceLevel) params.append("experienceLevel", filters.experienceLevel);
      if (filters.isRemote !== undefined) params.append("isRemote", String(filters.isRemote));
      params.append("page", String(filters.page || 1));
      params.append("limit", String(filters.limit || 12));

      const { data } = await axios.get(`/api/jobs?${params}`);
      return data; // { data: jobs, meta: { total, page, totalPages } }
    },
    staleTime: 1000 * 60, // 1 minute
  });
}