import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInboxItem,
  fetchInboxItems,
  processInboxItem,
  deleteInboxItem,
} from "../../../api/inbox";
import type { InboxItemInput } from "../types/inbox";

export function useInboxItems() {
  return useQuery({
    queryKey: ["inbox"],
    queryFn: fetchInboxItems,
  });
}

export function useCreateInboxItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: InboxItemInput) => createInboxItem(item),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
  });
}

export function useProcessInboxItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => processInboxItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
  });
}

export function useDeleteInboxItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInboxItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
  });
}
