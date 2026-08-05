import type { InboxItem, InboxItemInput } from "../features/inbox/types/inbox";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function fetchInboxItems(): Promise<InboxItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/inbox`);
  if (!response.ok) {
    throw new Error("Failed to load inbox items");
  }
  return response.json();
}

export async function createInboxItem(
  item: InboxItemInput,
): Promise<InboxItem> {
  const response = await fetch(`${API_BASE_URL}/api/inbox`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to create inbox item");
  }

  return response.json();
}

export async function processInboxItem(id: number): Promise<InboxItem> {
  const response = await fetch(`${API_BASE_URL}/api/inbox/${id}/process`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Failed to process inbox item");
  }

  return response.json();
}

export async function deleteInboxItem(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/inbox/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete inbox item");
  }
}
