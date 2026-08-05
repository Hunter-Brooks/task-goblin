import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getTodaysPlan,
	startDay,
	getPreviousDayReview,
	type DailyPlan,
	type PreviousDayReview,
} from '../../../api/dailyPlan'

export function useTodaysPlan() {
	return useQuery<DailyPlan | null>({
		queryKey: ['dailyPlan', 'today'],
		queryFn: getTodaysPlan,
	})
}

export function useStartDay() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: startDay,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dailyPlan', 'today'] })
		},
	})
}

export function usePreviousDayReview() {
	return useQuery<PreviousDayReview>({
		queryKey: ['dailyPlan', 'review', 'previous'],
		queryFn: getPreviousDayReview,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}
