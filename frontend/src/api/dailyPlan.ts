const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface DailyPlan {
  id: number;
  date: string;
  started: boolean;
  createdAt: string;
}

export interface PreviousDayReview {
  date: string;
  completedTasks: Array<{
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    createdAt: string;
    completedAt: string;
  }>;
  unfinishedHighPriority: Array<{
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    createdAt: string;
  }>;
  overdueTasks: Array<{
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: string;
    createdAt: string;
  }>;
  hadPlan: boolean;
  planWasStarted: boolean;
  bigThree: Array<{
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    createdAt: string;
    completedAt?: string;
  }>;
}

export async function startDay(): Promise<DailyPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-plan/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to start day:", response.status);
      throw new Error("Failed to start day");
    }

    return response.json();
  } catch (error) {
    console.error("Error starting day:", error);
    throw error;
  }
}

export async function getTodaysPlan(): Promise<DailyPlan | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-plan/today`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error("Failed to fetch today's plan:", response.status);
      throw new Error("Failed to fetch today's plan");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching today's plan:", error);
    throw error;
  }
}

export async function getPreviousDayReview(): Promise<PreviousDayReview> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/daily-plan/review/previous`,
    );

    if (!response.ok) {
      console.error("Failed to fetch previous day review:", response.status);
      const text = await response.text();
      console.error("Response:", text);
      throw new Error("Failed to fetch previous day review");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching previous day review:", error);
    throw error;
  }
}

export interface BigThreeTask {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export async function updateBigThree(taskIds: number[]): Promise<BigThreeTask[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-plan/big-three`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskIds),
    });

    if (!response.ok) {
      console.error("Failed to update Big Three:", response.status);
      throw new Error("Failed to update Big Three");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating Big Three:", error);
    throw error;
  }
}

export async function getBigThree(): Promise<BigThreeTask[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/daily-plan/big-three`);

    if (!response.ok) {
      console.error("Failed to fetch Big Three:", response.status);
      throw new Error("Failed to fetch Big Three");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching Big Three:", error);
    throw error;
  }
}
