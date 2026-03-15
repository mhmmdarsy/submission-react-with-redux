"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useSyncExternalStore } from "react";
import DataHydrator from "@/src/components/providers/DataHydrator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { formatDate } from "@/src/lib/date";
import { stripHtml, truncateText } from "@/src/lib/text";
import { useAppDispatch, useAppSelector } from "@/src/states/hooks";
import { setActiveCategory } from "@/src/states/slices/threadsSlice";
import { voteThreadThunk } from "@/src/states/thunks/threadThunks";
import type { ThreadWithOwner } from "@/src/types/forum";

export default function ThreadListPage({
  initialThreads,
}: {
  initialThreads: ThreadWithOwner[];
}) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const dispatch = useAppDispatch();
  const { items, activeCategory } = useAppSelector((state) => state.threads);
  const user = useAppSelector((state) => state.auth.user);

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

  return (
    <>
      <DataHydrator threads={initialThreads} />

      {isClient && user ? (
        <section className="panel">
          <h2>Ready to Share Something?</h2>
          <p className="muted">
            Create a new discussion on the dedicated page.
          </p>
          <div style={{ marginTop: "0.75rem" }}>
            <Link href="/new" className="solid-btn">
              Create New Thread
            </Link>
          </div>
        </section>
      ) : (
        <section className="panel">
          <p>
            Log in to create threads, post comments, and vote. You can create a
            thread from the <Link href="/new">new thread page</Link>.
          </p>
        </section>
      )}

      <section className="panel">
        <div className="list-head">
          <h2>Thread List</h2>
          <Select
            value={activeCategory}
            onValueChange={(value) => dispatch(setActiveCategory(value))}
          >
            <SelectTrigger aria-label="Category" className="category-trigger">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "all" ? "All categories" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="thread-list">
          {filteredThreads.map((thread) => {
            const upCount = thread.upVotesBy.length;
            const downCount = thread.downVotesBy.length;
            const userId = user?.id || "";
            const isUpVoted = userId ?
              thread.upVotesBy.includes(userId) :
              false;
            const isDownVoted = userId ?
              thread.downVotesBy.includes(userId) :
              false;

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
