import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAnnouncements() {
  return useQuery({
    queryKey: [api.announcements.list.path],
    queryFn: async () => {
      const res = await fetch(api.announcements.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      return api.announcements.list.responses[200].parse(data);
    },
  });
}
