export interface InboxItem {
  id: number
  content: string
  createdAt: string
  processed: boolean
}

export interface InboxItemInput {
  content: string
}
