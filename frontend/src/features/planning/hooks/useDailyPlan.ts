import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTodaysPlan,
  startDay,
  getPreviousDayReview,
  getBigThree,
  updateBigThree,
  type DailyPlan,
  type PreviousDayReview,
  type BigThreeTask,
} from "../../../api/dailyPlan";

export function useTodaysPlan() {
  return useQuery<DailyPlan | null>({
    queryKey: ["dailyPlan", "today"],
    queryFn: getTodaysPlan,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useStartDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyPlan", "today"] });
    },
  });
}

export function usePreviousDayReview() {
  return useQuery<PreviousDayReview>({
    queryKey: ["dailyPlan", "review", "previous"],
    queryFn: getPreviousDayReview,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useBigThree() {
  return useQuery<BigThreeTask[]>({
    queryKey: ["dailyPlan", "bigThree"],
    queryFn: getBigThree,
  });
}

export function useUpdateBigThree() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskIds: number[]) => updateBigThree(taskIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyPlan", "bigThree"] });
    },
  });
}
