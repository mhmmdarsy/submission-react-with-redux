"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import DataHydrator from "@/src/components/providers/DataHydrator";
import { formatDate } from "@/src/lib/date";
import { stripHtml, truncateText } from "@/src/lib/text";
import { useAppDispatch, useAppSelector } from "@/src/states/hooks";
import { setActiveCategory } from "@/src/states/slices/threadsSlice";
import {
  createThreadThunk,
  voteThreadThunk,
} from "@/src/states/thunks/threadThunks";
import type { ThreadWithOwner } from "@/src/types/forum";

export default function ThreadListPage({
  initialThreads,
}: {
  initialThreads: ThreadWithOwner[];
}) {
  const dispatch = useAppDispatch();
  const { items, activeCategory } = useAppSelector((state) => state.threads);
  const user = useAppSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const mapped = items
      .map((thread) => thread.category)
      .filter((item): item is string => Boolean(item));

    return ["all", ...new Set(mapped)];
  }, [items]);

  const filteredThreads = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }

    return items.filter((thread) => thread.category === activeCategory);
  }, [activeCategory, items]);

  const onCreateThread = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await dispatch(
      createThreadThunk({
        title,
        body,
        category: category || undefined,
      }),
    );

    if (createThreadThunk.rejected.match(result)) {
      setError((result.payload as string) || "Failed to create thread");
      return;
    }

    setTitle("");
    setBody("");
    setCategory("");
  };

  return (
    <>
      <DataHydrator threads={initialThreads} />

      {user ? (
        <section className="panel">
          <h2>Create New Thread</h2>
          <form className="stack-form" onSubmit={onCreateThread}>
            <label htmlFor="thread-title">Title</label>
            <input
              id="thread-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="thread-category">Category</label>
            <input
              id="thread-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="General"
            />

            <label htmlFor="thread-body">Body</label>
            <textarea
              id="thread-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="solid-btn wide-btn">
              Publish Thread
            </button>
          </form>
        </section>
      ) : (
        <section className="panel">
          <p>Log in to create threads, post comments, and vote.</p>
        </section>
      )}

      <section className="panel">
        <div className="list-head">
          <h2>Thread List</h2>
          <select
            className="category-select"
            title="category"
            value={activeCategory}
            onChange={(event) =>
              dispatch(setActiveCategory(event.target.value))
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
        </div>

        <div className="thread-list">
          {filteredThreads.map((thread) => {
            const upCount = thread.upVotesBy.length;
            const downCount = thread.downVotesBy.length;
            const userId = user?.id || "";
            const isUpVoted = userId
              ? thread.upVotesBy.includes(userId)
              : false;
            const isDownVoted = userId
              ? thread.downVotesBy.includes(userId)
              : false;

            return (
              <article key={thread.id} className="thread-card">
                <div className="thread-meta">
                  <span>{formatDate(thread.createdAt)}</span>
                  <span>{thread.totalComments} comments</span>
                  {thread.category && (
                    <span className="chip">{thread.category}</span>
                  )}
                </div>

                <h3>
                  <Link href={`/threads/${thread.id}`}>{thread.title}</Link>
                </h3>

                <p>{truncateText(stripHtml(thread.body), 180)}</p>

                <div className="thread-footer">
                  <div className="owner-block">
                    <Image
                      src={
                        thread.owner.avatar ||
                        "https://ui-avatars.com/api/?name=User"
                      }
                      alt={thread.owner.name}
                      width={32}
                      height={32}
                      unoptimized
                    />
                    <span>{thread.owner.name}</span>
                  </div>

                  <div className="vote-block">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          voteThreadThunk({ threadId: thread.id, voteType: 1 }),
                        )
                      }
                      className={isUpVoted ? "vote-btn active-up" : "vote-btn"}
                    >
                      Up {upCount}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          voteThreadThunk({
                            threadId: thread.id,
                            voteType: -1,
                          }),
                        )
                      }
                      className={
                        isDownVoted ? "vote-btn active-down" : "vote-btn"
                      }
                    >
                      Down {downCount}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
