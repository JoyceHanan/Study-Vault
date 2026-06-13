import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

import {
  pageWrapper,
  container,
  sectionPadding,
  card,
  displayLg,
  displayMd,
  titleMd,
  titleSm,
  bodyText,
  mutedText,
  textInput,
  primaryBtn,
  secondaryBtn,
  labelUppercase,
} from "../styles/common";
import { useAuthStore } from "../store/authStore";

const getViewerUrl = (fileUrl, fileType) => {
  if (!fileUrl) return null;
  const isPdf =
    fileType?.includes("pdf") || fileUrl.toLowerCase().includes(".pdf");
  const isOffice =
    fileType?.includes("presentation") ||
    fileType?.includes("wordprocessing") ||
    fileType?.includes("ms-powerpoint") ||
    fileType?.includes("msword") ||
    fileUrl.toLowerCase().match(/\.(pptx?|docx?|xlsx?)($|\?)/);
  if (isPdf) return fileUrl;
  if (isOffice)
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  return fileUrl;
};

// ── Reply section ───────────────────────────────────────────────────────────
function ReplySection({ doubtId, answers, onReplied }) {
  const [replyText, setReplyText] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      await axios.post(
        `/doubt-api/reply/${doubtId}`,
        { message: replyText },
        { withCredentials: true }
      );
      setReplyText("");
      setOpen(false);
      onReplied();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {answers?.length > 0 && (
        <div className="mt-2 space-y-3 pl-4 border-l-2 border-[#e6e6e6]">
          {answers.map((ans, i) => (
            <div key={i} className="py-2">
              <p className="text-[14px] font-light text-[#3c3c3c] leading-[1.55]">
                {ans.message}
              </p>
              <p className="text-[12px] text-[#9a9a9a] mt-1">
                —{" "}
                <span className="font-medium text-[#6b6b6b]">
                  {ans.user?.name || ans.user?.email || "Unknown"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 flex items-center gap-1.5 px-4 h-8 border border-[#e6e6e6] text-[12px] font-bold tracking-[1px] uppercase text-[#6b6b6b] hover:bg-[#1c69d4] hover:text-white hover:border-[#1c69d4] transition-colors duration-150"
        >
          Reply
        </button>
      ) : (
        <form onSubmit={handleReply} className="mt-3 space-y-3">
          <textarea
            rows="3"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className={`${textInput} h-auto py-3`}
            required
          />
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className={primaryBtn}>
              {submitting ? "Posting…" : "Post Reply"}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setReplyText(""); }}
              className={secondaryBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
function ResourceDetails() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [doubts, setDoubts]         = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionText, setQuestionText]   = useState("");

  const currentUserId = currentUser?._id || currentUser?.id;

  const getResource = async () => {
    try {
      const res = await axios.get(`/resource-api/${id}`);
      setResource(res.data.payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getDoubts = async () => {
    try {
      const res = await axios.get(`/doubt-api/resource/${id}`);
      setDoubts(res.data.payload || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Check if this resource is already bookmarked by current user
  const checkBookmark = async () => {
    try {
      const res = await axios.get("/bookmark-api/", { withCredentials: true });
      const bookmarks = res.data.payload || [];
      const found = bookmarks.some(
        (b) =>
          b.resourceId?._id === id || b.resourceId?._id?.toString() === id
      );
      setIsBookmarked(found);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getResource();
    getDoubts();
    if (currentUserId) checkBookmark();
  }, [id, currentUserId]);

  // ── Resource actions ──
  const handleUpvote = async () => {
    try {
      await axios.post(`/resource-api/${id}/upvote`, {}, { withCredentials: true });
      getResource();
    } catch (err) { console.log(err); }
  };

  const handleDownvote = async () => {
    try {
      await axios.post(`/resource-api/${id}/downvote`, {}, { withCredentials: true });
      getResource();
    } catch (err) { console.log(err); }
  };

  const handleOpenResource = () => {
    if (!resource?.fileUrl) return;
    window.open(getViewerUrl(resource.fileUrl, resource.fileType), "_blank");
  };

  const handleDownload = () => {
    if (!resource?.fileUrl) return;
    const a = document.createElement("a");
    a.href = resource.fileUrl;
    a.download = resource.title || "resource";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteResource = async () => {
    if (!window.confirm("Delete this resource? This cannot be undone.")) return;
    try {
      await axios.delete(`/resource-api/${id}`, { withCredentials: true });
      navigate("/resources");
    } catch (err) { console.log(err); }
  };

  // ── Bookmark toggle ──
  const handleBookmarkToggle = async () => {
    if (!currentUserId) return;
    try {
      setBookmarkLoading(true);
      if (isBookmarked) {
        await axios.delete(`/bookmark-api/remove/${id}`, { withCredentials: true });
        setIsBookmarked(false);
      } else {
        await axios.post(
          "/bookmark-api/add",
          { resourceId: id },
          { withCredentials: true }
        );
        setIsBookmarked(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // ── Doubt actions ──
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/doubt-api/create",
        {
          resourceId: id,
          title: questionTitle,
          question: questionText,
          subject: resource.subject,
          topic: resource.topic,
        },
        { withCredentials: true }
      );
      setQuestionTitle("");
      setQuestionText("");
      getDoubts();
    } catch (err) { console.log(err); }
  };

  const handleMarkSolved = async (doubtId) => {
    try {
      await axios.put(`/doubt-api/solve/${doubtId}`, {}, { withCredentials: true });
      getDoubts();
    } catch (err) { console.log(err); }
  };

  const handleDeleteDoubt = async (doubtId) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`/doubt-api/${doubtId}`, { withCredentials: true });
      getDoubts();
    } catch (err) { console.log(err); }
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Resource not found.</p>
        </div>
      </div>
    );
  }

  const isResourceOwner =
    currentUserId &&
    (currentUserId === resource.uploadedBy?._id?.toString() ||
      currentUserId === resource.uploadedBy?._id);

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>

          {/* ── Resource card ── */}
          <div className={`${card} max-w-5xl mx-auto`}>
            <div className="flex items-start justify-between gap-4">
              <h1 className={displayLg}>{resource.title}</h1>

              {/* Bookmark button */}
              {currentUserId && (
                <button
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading}
                  title={isBookmarked ? "Remove bookmark" : "Save resource"}
                  className="shrink-0 mt-2 text-[#6b6b6b] hover:text-[#1c69d4] transition-colors duration-150 disabled:opacity-40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24"
                    fill={isBookmarked ? "#1c69d4" : "none"}
                    stroke={isBookmarked ? "#1c69d4" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="mt-6">
              <p className={bodyText}>{resource.description}</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-5">
                <p className={mutedText}>Subject: {resource.subject}</p>
                <p className={mutedText}>Unit: {resource.unit || "N/A"}</p>
                <p className={mutedText}>Topic: {resource.topic || "N/A"}</p>
                <p className={mutedText}>Semester: {resource.semester || "N/A"}</p>
                <p className={mutedText}>Uploaded by: {resource.uploadedBy?.name}</p>
                <p className={mutedText}>
                  Uploaded on: {new Date(resource.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action row */}
            <div className="border-t border-[#e6e6e6] mt-8 pt-6 flex flex-wrap items-center gap-4">

              {/* Upvote */}
              <button
                onClick={handleUpvote}
                className="flex items-center gap-1.5 text-[#6b6b6b] hover:text-[#1c69d4] transition-colors duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="text-[14px] font-bold">{resource.upvotes?.length || 0}</span>
              </button>

              {/* Downvote */}
              <button
                onClick={handleDownvote}
                className="flex items-center gap-1.5 text-[#6b6b6b] hover:text-[#e22718] transition-colors duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z" />
                  <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                </svg>
                <span className="text-[14px] font-bold">{resource.downvotes?.length || 0}</span>
              </button>

              <div className="flex-1" />

              <button onClick={handleOpenResource} className={primaryBtn}>
                Open Resource
              </button>
              <button onClick={handleDownload} className={secondaryBtn}>
                Download
              </button>

              {isResourceOwner && (
                <button
                  onClick={handleDeleteResource}
                  title="Delete Resource"
                  className="flex items-center justify-center w-10 h-10 text-[#9a9a9a] hover:text-[#dc2626] transition-colors duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" /><path d="M14 11v6" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Discussions card ── */}
          <div className={`${card} max-w-5xl mx-auto mt-8`}>
            <h2 className={displayMd}>Questions & Discussions</h2>

            <div className="mt-6 divide-y divide-[#e6e6e6]">
              {doubts.length === 0 ? (
                <p className={`${mutedText} pb-4`}>
                  No questions yet. Be the first to ask!
                </p>
              ) : (
                doubts.map((doubt) => {
                  const isDoubtOwner =
                    currentUserId &&
                    (currentUserId === doubt.askedBy?._id?.toString() ||
                      currentUserId === doubt.askedBy?._id);

                  return (
                    <div key={doubt._id} className="py-6 first:pt-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className={titleMd}>{doubt.title}</h3>
                            {doubt.solved ? (
                              <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#22c55e] border border-[#22c55e] px-2 py-0.5">
                                Solved
                              </span>
                            ) : null}
                          </div>
                          <p className={`${bodyText} mt-1`}>{doubt.question}</p>
                          <p className="text-[12px] text-[#9a9a9a] mt-2">
                            Asked by{" "}
                            <span className="font-medium text-[#6b6b6b]">
                              {doubt.askedBy?.name || doubt.askedBy?.email || "Unknown"}
                            </span>
                          </p>
                        </div>

                        {isDoubtOwner && (
                          <div className="flex items-center gap-3 shrink-0">
                            {!doubt.solved && (
                              <button
                                onClick={() => handleMarkSolved(doubt._id)}
                                className="text-[12px] font-bold tracking-[1px] uppercase text-[#6b6b6b] hover:text-[#22c55e] transition-colors duration-150"
                              >
                                Mark Solved
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDoubt(doubt._id)}
                              className="text-[#9a9a9a] hover:text-[#dc2626] transition-colors duration-150"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" /><path d="M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      <ReplySection
                        doubtId={doubt._id}
                        answers={doubt.answers}
                        onReplied={getDoubts}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Ask a question */}
            <div className="border-t border-[#e6e6e6] mt-6 pt-8">
              <h3 className={displayMd}>Ask a Question</h3>
              <form onSubmit={handleAskQuestion} className="mt-6 space-y-4">
                <div>
                  <label className={`block mb-2 ${labelUppercase}`}>Title</label>
                  <input
                    type="text"
                    placeholder="e.g. What is session hijacking?"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    className={textInput}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${labelUppercase}`}>Question</label>
                  <textarea
                    rows="4"
                    placeholder="Describe your question in detail..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className={`${textInput} h-auto py-3`}
                    required
                  />
                </div>
                <button type="submit" className={primaryBtn}>
                  Post Question
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default ResourceDetails;
