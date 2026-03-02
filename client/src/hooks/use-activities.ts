import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useActivities() {
  return useQuery({
    queryKey: [api.activities.list.path],
    queryFn: async () => {
      const res = await fetch(api.activities.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      return api.activities.list.responses[200].parse(data);
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activity: z.infer<typeof api.activities.create.input>) => {
      const validated = api.activities.create.input.parse(activity);
      const res = await fetch(api.activities.create.path, {
        method: api.activities.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create activity");
      return api.activities.create.responses[201].parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] }); // Refresh user points
    },
  });
}
