import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await fetch(api.reports.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      return api.reports.list.responses[200].parse(data);
    },
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (report: z.infer<typeof api.reports.create.input>) => {
      const validated = api.reports.create.input.parse(report);
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create report");
      return api.reports.create.responses[201].parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
    },
  });
}
