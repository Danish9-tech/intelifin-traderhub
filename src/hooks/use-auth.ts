import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, setToken } from "@/lib/api-client";
import type { User } from "@/lib/api-types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const result = await apiFetch<{ user: User | null }>("/auth/me");
      return result.user;
    },
    retry: false,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => apiFetch<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => apiFetch<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),
    onSettled: () => {
      setToken(null);
      queryClient.clear();
    },
  });
}
