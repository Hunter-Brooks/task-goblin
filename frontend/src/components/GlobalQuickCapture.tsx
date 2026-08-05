import { useState, useEffect } from 'react'
import { useCreateInboxItem } from '../features/inbox/hooks/useInbox'

interface GlobalQuickCaptureProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalQuickCapture({ isOpen, onClose }: GlobalQuickCaptureProps) {
  const createItem = useCreateInboxItem()
  const [content, setContent] = useState('')

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!content.trim()) {
      return
    }

    await createItem.mutateAsync({
      content: content.trim(),
    })

    setContent('')
    onClose()
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="quick-capture-overlay" onClick={handleOverlayClick}>
      <div className="quick-capture-modal">
        <form onSubmit={handleSubmit}>
          <h2>Quick Capture</h2>
          <p className="muted">What's on your mind?</p>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Type your thought..."
            rows={4}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={createItem.isPending}>
              {createItem.isPending ? 'Capturing…' : 'Capture'}
            </button>
          </div>
          {createItem.isError && <p className="error">Unable to capture right now.</p>}
        </form>
      </div>
    </div>
  )
}
