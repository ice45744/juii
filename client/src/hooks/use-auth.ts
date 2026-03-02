import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user session");
      const data = await res.json();
      return api.auth.me.responses[200].parse(data);
    },
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: z.infer<typeof api.auth.login.input>) => {
      const validated = api.auth.login.input.parse(credentials);
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) throw new Error("รหัสนักเรียนหรือรหัสผ่านไม่ถูกต้อง");
        throw new Error(data.message || "Login failed");
      }
      return api.auth.login.responses[200].parse(data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof api.auth.register.input>) => {
      const validated = api.auth.register.input.parse(userData);
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400) throw new Error(data.message || "ข้อมูลไม่ถูกต้อง");
        throw new Error("Registration failed");
      }
      return api.auth.register.responses[201].parse(data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
  };
}
