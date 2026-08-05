import { InboxList } from '../features/inbox/components/InboxList'

export function InboxPage() {
  return (
    <section className="page-grid">
      <div>
        <h2>Inbox</h2>
        <p className="muted">Use the quick capture button (✚) or press Q to capture thoughts from anywhere.</p>
      </div>
      <InboxList />
    </section>
  )
}
