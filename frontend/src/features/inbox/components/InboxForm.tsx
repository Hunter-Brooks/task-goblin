import { useState } from "react";
import { useCreateInboxItem } from "../hooks/useInbox";

export function InboxForm() {
  const createItem = useCreateInboxItem();
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    await createItem.mutateAsync({
      content: content.trim(),
    });

    setContent("");
  };

  return (
    <form className="panel inbox-form" onSubmit={handleSubmit}>
      <h2>Quick Capture</h2>
      <p className="muted">
        Record thoughts without deciding where they belong.
      </p>
      <label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          autoFocus
        />
      </label>
      <button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? "Capturing…" : "Capture"}
      </button>
      {createItem.isError && (
        <p className="error">Unable to capture right now.</p>
      )}
    </form>
  );
}
