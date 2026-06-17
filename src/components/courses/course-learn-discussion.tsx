"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import {
  getCourseComments,
  postCourseComment,
  replyToCourseComment,
} from "@/lib/api/course-comment.service";
import type { CourseCommentRecord } from "@/lib/api/course-comment.types";
import { hasPurchasedCourse } from "@/lib/api/purchase.service";
import { readSession } from "@/lib/auth/session";
import { initialsFromName } from "@/lib/auth/session";
import { uploadUrl } from "@/lib/api/cms";
import { toast } from "@/lib/utils/toast";

function formatRelativeTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (!Number.isFinite(diff)) return "";

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function authorBadge(type: CourseCommentRecord["authorType"]) {
  if (type === "instructor") return "Instructor";
  if (type === "admin") return "Admin";
  return null;
}

type Props = {
  courseId: string;
  lessonId?: string;
};

export function CourseLearnDiscussion({ courseId, lessonId }: Props) {
  const [comments, setComments] = useState<CourseCommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [draft, setDraft] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [canReply, setCanReply] = useState(false);

  const session = typeof window !== "undefined" ? readSession() : null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getCourseComments(courseId, lessonId);
      setComments(rows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let active = true;
    async function checkAccess() {
      const current = readSession();
      if (!current?.accessToken) {
        if (active) {
          setCanComment(false);
          setCanReply(false);
        }
        return;
      }

      if (current.role === "instructor") {
        if (active) {
          setCanComment(false);
          setCanReply(true);
        }
        return;
      }

      if (current.role === "student") {
        const owned = await hasPurchasedCourse(courseId);
        if (active) {
          setCanComment(owned);
          setCanReply(false);
        }
      }
    }

    void checkAccess();
    return () => {
      active = false;
    };
  }, [courseId]);

  async function handlePost() {
    const text = draft.trim();
    if (!text) return;

    if (!session?.accessToken || session.role !== "student") {
      toast.info("Please log in as a student to post a comment.");
      return;
    }

    setPosting(true);
    try {
      await postCourseComment(courseId, text, lessonId);
      setDraft("");
      await load();
      toast.success("Comment posted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setPosting(false);
    }
  }

  async function handleReply(parentId: string) {
    const text = replyDraft.trim();
    if (!text) return;

    if (!session?.accessToken || session.role !== "instructor") {
      toast.info("Only the course instructor can reply here.");
      return;
    }

    setPosting(true);
    try {
      await replyToCourseComment(parentId, text);
      setReplyDraft("");
      setReplyingId(null);
      await load();
      toast.success("Reply posted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h3 className="mb-4 flex items-center gap-2 text-[18px] font-bold text-navy">
        <MessageSquare size={19} /> Discussion ({comments.length})
      </h3>

      {canComment ? (
        <div className="mb-6 rounded-2xl border border-line bg-surface p-4">
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question or share your thoughts…"
            className="field-input resize-none bg-white"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="btn btn-navy btn-sm"
              onClick={() => void handlePost()}
              disabled={posting || !draft.trim()}
            >
              {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Post comment
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-6 rounded-2xl border border-line bg-surface px-4 py-3 text-[14px] text-ink-3">
          {session?.role === "instructor"
            ? "Instructors can reply to student questions below."
            : "Log in and enroll in this course to join the discussion."}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-[14px] text-ink-3">
          <Loader2 size={16} className="animate-spin" /> Loading comments…
        </div>
      ) : comments.length === 0 ? (
        <p className="text-[14px] text-ink-3">No comments yet. Be the first to ask a question.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => {
            const badge = authorBadge(comment.authorType);
            const avatarSrc = uploadUrl(comment.authorAvatar);
            const initials = initialsFromName(comment.authorName || "?");
            const isReplying = replyingId === comment.id;

            return (
              <div key={comment.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="mb-2 flex items-center gap-3">
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarSrc}
                      alt={comment.authorName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[13px] font-bold text-gold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-[14px] font-bold text-navy">
                      {comment.authorName}
                      {badge ? (
                        <span className="rounded-full bg-royal/10 px-2 py-0.5 text-[11px] font-semibold text-royal">
                          {badge}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[12px] text-ink-3">{formatRelativeTime(comment.created_at)}</div>
                  </div>
                </div>

                <p className="text-[14.5px] text-ink-2">{comment.text}</p>

                {canReply ? (
                  <div className="mt-3">
                    {isReplying ? (
                      <div className="rounded-xl border border-line bg-surface p-3">
                        <textarea
                          rows={2}
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                          placeholder="Write your reply…"
                          className="field-input resize-none bg-white text-[14px]"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              setReplyingId(null);
                              setReplyDraft("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-navy btn-sm"
                            onClick={() => void handleReply(comment.id)}
                            disabled={posting || !replyDraft.trim()}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="text-[13px] font-semibold text-royal hover:underline"
                        onClick={() => {
                          setReplyingId(comment.id);
                          setReplyDraft("");
                        }}
                      >
                        Reply as instructor
                      </button>
                    )}
                  </div>
                ) : null}

                {(comment.replies ?? []).length > 0 ? (
                  <div className="mt-4 flex flex-col gap-3 border-l-2 border-surface-2 pl-4">
                    {(comment.replies ?? []).map((reply) => {
                      const replyBadge = authorBadge(reply.authorType);
                      const replyAvatar = uploadUrl(reply.authorAvatar);
                      const replyInitials = initialsFromName(reply.authorName || "?");

                      return (
                        <div key={reply.id} className="rounded-xl border border-line bg-surface px-3 py-3">
                          <div className="mb-2 flex items-center gap-2.5">
                            {replyAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={replyAvatar}
                                alt={reply.authorName}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="grid h-8 w-8 place-items-center rounded-full bg-navy text-[12px] font-bold text-gold">
                                {replyInitials}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 text-[13px] font-bold text-navy">
                                {reply.authorName}
                                {replyBadge ? (
                                  <span className="rounded-full bg-royal/10 px-2 py-0.5 text-[10px] font-semibold text-royal">
                                    {replyBadge}
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[11px] text-ink-3">
                                {formatRelativeTime(reply.created_at)}
                              </div>
                            </div>
                          </div>
                          <p className="text-[14px] text-ink-2">{reply.text}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
