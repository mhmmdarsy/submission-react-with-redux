"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/states/hooks";
import { createThreadThunk } from "@/src/states/thunks/threadThunks";

export default function NewThreadPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const createdThread = await dispatch(
        createThreadThunk({
          title,
          body,
          category: category || undefined,
        }),
      ).unwrap();

      router.push(`/threads/${createdThread.id}`);
    } catch (submitError) {
      setError(
        typeof submitError === "string"
          ? submitError
          : "Failed to create thread",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="panel auth-panel">
        <h1>Create New Thread</h1>
        <p className="muted" style={{ marginTop: "0.5rem" }}>
          You need to log in before creating a thread.
        </p>
        <div style={{ marginTop: "0.9rem", display: "flex", gap: "0.6rem" }}>
          <Link href="/login" className="solid-btn">
            Login
          </Link>
          <Link href="/" className="ghost-btn">
            Back to Threads
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="panel auth-panel">
      <h1>Create New Thread</h1>
      <p className="muted" style={{ marginTop: "0.5rem" }}>
        Publish your idea and start a discussion.
      </p>

      <form className="stack-form" onSubmit={onSubmit}>
        <label htmlFor="thread-title">Title</label>
        <input
          id="thread-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={100}
        />

        <label htmlFor="thread-category">Category</label>
        <input
          id="thread-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="General"
          maxLength={30}
        />

        <label htmlFor="thread-body">Body</label>
        <textarea
          id="thread-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={6}
          required
        />

        {error ? <p className="error-text">{error}</p> : null}

        <button
          type="submit"
          className="solid-btn wide-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Thread"}
        </button>
      </form>
    </section>
  );
}
