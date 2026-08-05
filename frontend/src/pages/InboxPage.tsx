import { InboxForm } from '../features/inbox/components/InboxForm'
import { InboxList } from '../features/inbox/components/InboxList'

export function InboxPage() {
  return (
    <section className="page-grid">
      <div>
        <h2>Inbox</h2>
        <p className="muted">Capture thoughts without deciding where they belong.</p>
      </div>
      <InboxForm />
      <InboxList />
    </section>
  )
}
