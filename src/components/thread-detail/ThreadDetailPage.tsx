"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import DataHydrator from "@/src/components/providers/DataHydrator";
import { formatDate } from "@/src/lib/date";
import { useAppDispatch, useAppSelector } from "@/src/states/hooks";
import {
  createCommentThunk,
  voteCommentThunk,
} from "@/src/states/thunks/detailThunks";
import { voteThreadThunk } from "@/src/states/thunks/threadThunks";
import type { DetailThread } from "@/src/types/forum";

export default function ThreadDetailPage({
  initialDetail,
  errorMessage,
}: {
  initialDetail: DetailThread | null;
  errorMessage?: string;
}) {
  const dispatch = useAppDispatch();
  const detailFromStore = useAppSelector((state) => state.threadDetail.item);
  const detail = detailFromStore ?? initialDetail;
  const user = useAppSelector((state) => state.auth.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const onSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!detail) {
      return;
    }

    const result = await dispatch(
      createCommentThunk({
        threadId: detail.id,
        content: comment,
      }),
    );

    if (createCommentThunk.rejected.match(result)) {
      setError((result.payload as string) || "Failed to post comment");
      return;
    }

    setComment("");
  };

  return (
    <>
      <DataHydrator detailThread={initialDetail} />
      {!detail ? (
        <section className="panel">
          {errorMessage && !/not found/i.test(errorMessage) ? (
            <p>Failed to load thread: {errorMessage}</p>
          ) : (
            <p>Thread not found.</p>
          )}
        </section>
      ) : (
        <section className="panel thread-detail">
          <div className="thread-meta">
            <span>{formatDate(detail.createdAt)}</span>
            {detail.category && <span className="chip">{detail.category}</span>}
          </div>

          <h1>{detail.title}</h1>

          <div
            className="thread-body"
            dangerouslySetInnerHTML={{ __html: detail.body }}
          />

          <div className="thread-footer">
            <div className="owner-block">
              <Image
                src={
                  detail.owner.avatar || "https://ui-avatars.com/api/?name=User"
                }
                alt={detail.owner.name}
                width={36}
                height={36}
                unoptimized
              />
              <span>{detail.owner.name}</span>
            </div>

            <div className="vote-block">
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    voteThreadThunk({ threadId: detail.id, voteType: 1 }),
                  )
                }
                className={
                  user && detail.upVotesBy.includes(user.id) ?
                    "vote-btn active-up" :
                    "vote-btn"
                }
              >
                Up {detail.upVotesBy.length}
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    voteThreadThunk({ threadId: detail.id, voteType: -1 }),
                  )
                }
                className={
                  user && detail.downVotesBy.includes(user.id) ?
                    "vote-btn active-down" :
                    "vote-btn"
                }
              >
                Down {detail.downVotesBy.length}
              </button>
            </div>
          </div>
        </section>
      )}

      {detail && (
        <section className="panel">
          <h2>Comments ({detail.comments.length})</h2>

          {user ? (
            <form onSubmit={onSubmitComment} className="stack-form">
              <label htmlFor="comment">Write a comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                required
              />

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="solid-btn wide-btn">
                Post Comment
              </button>
            </form>
          ) : (
            <p className="muted">Log in to post comments and vote.</p>
          )}

          <div className="comment-list">
            {detail.comments.map((item) => (
              <article key={item.id} className="comment-card">
                <div className="thread-meta">
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <div dangerouslySetInnerHTML={{ __html: item.content }} />

                <div className="thread-footer">
                  <div className="owner-block">
                    <Image
                      src={
                        item.owner.avatar ||
                        "https://ui-avatars.com/api/?name=User"
                      }
                      alt={item.owner.name}
                      width={30}
                      height={30}
                      unoptimized
                    />
                    <span>{item.owner.name}</span>
                  </div>

                  <div className="vote-block">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          voteCommentThunk({
                            threadId: detail.id,
                            commentId: item.id,
                            voteType: 1,
                          }),
                        )
                      }
                      className={
                        user && item.upVotesBy.includes(user.id) ?
                          "vote-btn active-up" :
                          "vote-btn"
                      }
                    >
                      Up {item.upVotesBy.length}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          voteCommentThunk({
                            threadId: detail.id,
                            commentId: item.id,
                            voteType: -1,
                          }),
                        )
                      }
                      className={
                        user && item.downVotesBy.includes(user.id) ?
                          "vote-btn active-down" :
                          "vote-btn"
                      }
                    >
                      Down {item.downVotesBy.length}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
