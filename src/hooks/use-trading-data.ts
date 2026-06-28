import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { AlertRow, Holding, JournalEntry, MarketRow, PortfolioSummary } from "@/lib/api-types";

export function useMarkets(search = "") {
  return useQuery({
    queryKey: ["markets", search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const result = await apiFetch<{ data: MarketRow[] }>(`/markets${params}`);
      return result.data;
    },
    refetchInterval: 30_000,
  });
}

export function useHoldings() {
  return useQuery({
    queryKey: ["portfolio", "holdings"],
    queryFn: async () => (await apiFetch<{ data: Holding[] }>("/portfolio/holdings")).data,
  });
}

export function usePortfolioSummary() {
  return useQuery({
    queryKey: ["portfolio", "summary"],
    queryFn: async () => (await apiFetch<{ data: PortfolioSummary }>("/portfolio/summary")).data,
  });
}

export function useAddHolding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Holding, "id">) => apiFetch<{ id: number }>("/portfolio/holdings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}

export function useDeleteHolding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<{ message: string }>(`/portfolio/holdings/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}

export function useJournalEntries() {
  return useQuery({
    queryKey: ["journal"],
    queryFn: async () => (await apiFetch<{ data: JournalEntry[] }>("/journal")).data,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<JournalEntry, "id" | "date">) => apiFetch<{ id: number }>("/journal", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<{ message: string }>(`/journal/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => (await apiFetch<{ data: AlertRow[] }>("/alerts")).data,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { type: string; asset: string; condition: string }) => apiFetch<{ id: number }>("/alerts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<{ message: string }>(`/alerts/${id}/dismiss`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<{ message: string }>(`/alerts/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useAiChat() {
  return useMutation({
    mutationFn: async (message: string) => {
      const result = await apiFetch<{ reply: string; provider: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      return result.reply;
    },
  });
}
