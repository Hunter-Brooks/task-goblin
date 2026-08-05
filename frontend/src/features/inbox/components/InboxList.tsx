import { useState } from 'react'
import { useInboxItems, useDeleteInboxItem } from '../hooks/useInbox'
import { TaskForm } from '../../tasks/components/TaskForm'
import type { InboxItem } from '../types/inbox'

export function InboxList() {
  const { data: items, isLoading, isError } = useInboxItems()
  const deleteItem = useDeleteInboxItem()
  const [convertingItem, setConvertingItem] = useState<InboxItem | null>(null)

  if (isLoading) {
    return <div className="panel">Loading inbox…</div>
  }

  if (isError) {
    return <div className="panel error">Unable to load inbox items.</div>
  }

  if (!items?.length) {
    return <div className="panel">Your inbox is empty. Capture your first thought above!</div>
  }

  const handleDelete = async (item: InboxItem) => {
    if (window.confirm(`Delete "${item.content}"?`)) {
      await deleteItem.mutateAsync(item.id)
    }
  }

  const handleConvertToTask = (item: InboxItem) => {
    setConvertingItem(item)
  }

  const handleTaskCreated = async () => {
    if (convertingItem) {
      await deleteItem.mutateAsync(convertingItem.id)
      setConvertingItem(null)
    }
  }

  if (convertingItem) {
    return (
      <div className="panel">
        <h3>Convert to Task</h3>
        <p className="muted inbox-converting-content">"{convertingItem.content}"</p>
        <TaskForm
          onCancel={() => setConvertingItem(null)}
          onSuccess={handleTaskCreated}
        />
      </div>
    )
  }

  return (
    <div className="panel">
      <h2>Inbox ({items.length})</h2>
      <ul className="inbox-list">
        {items.map((item) => (
          <li key={item.id}>
            <div className="inbox-item">
              <div className="inbox-content">
                <p>{item.content}</p>
                <span className="inbox-timestamp">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="inbox-actions">
                <button onClick={() => handleConvertToTask(item)} className="btn-convert" title="Convert to task">
                  → Task
                </button>
                <button onClick={() => handleDelete(item)} className="btn-icon" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
