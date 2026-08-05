const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface DailyPlan {
	id: number
	date: string
	started: boolean
	createdAt: string
}

export interface PreviousDayReview {
	date: string
	completedTasks: Array<{
		id: number
		title: string
		description?: string
		status: string
		priority: string
		dueDate?: string
		createdAt: string
		completedAt: string
	}>
	unfinishedHighPriority: Array<{
		id: number
		title: string
		description?: string
		status: string
		priority: string
		dueDate?: string
		createdAt: string
	}>
	overdueTasks: Array<{
		id: number
		title: string
		description?: string
		status: string
		priority: string
		dueDate: string
		createdAt: string
	}>
	hadPlan: boolean
	planWasStarted: boolean
}

export async function startDay(): Promise<DailyPlan> {
	const response = await fetch(`${API_BASE_URL}/api/daily-plan/start`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error('Failed to start day')
	}

	return response.json()
}

export async function getTodaysPlan(): Promise<DailyPlan | null> {
	const response = await fetch(`${API_BASE_URL}/api/daily-plan/today`)

	if (response.status === 404) {
		return null
	}

	if (!response.ok) {
		throw new Error('Failed to fetch today\'s plan')
	}

	return response.json()
}

export async function getPreviousDayReview(): Promise<PreviousDayReview> {
	const response = await fetch(`${API_BASE_URL}/api/daily-plan/review/previous`)

	if (!response.ok) {
		throw new Error('Failed to fetch previous day review')
	}

	return response.json()
}
