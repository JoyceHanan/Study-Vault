import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  displayMd,
  card,
  titleSm,
  bodyText,
  mutedText,
  textLinkBtn,
} from "../styles/common";

function StatCard({ value, label, icon }) {
  return (
    <div className={`${card} flex items-center gap-4`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-[32px] font-bold leading-none text-[#262626]">
          {value ?? 0}
        </p>
        <p className={`${mutedText} mt-1`}>{label}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { currentUser, getDashboard } = useAuthStore((s) => s);
  const currentUserId = (currentUser?._id || currentUser?.id || "").toString();

  const [stats, setStats]             = useState(null);
  const [bookmarks, setBookmarks]     = useState([]);
  const [myDoubts, setMyDoubts]       = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [dashRes, bookmarkRes, doubtsRes, resourcesRes, notifRes] =
        await Promise.all([
          axios.get("/user-api/dashboard",   { withCredentials: true }),
          axios.get("/bookmark-api/",        { withCredentials: true }),
          axios.get("/doubt-api/",           { withCredentials: true }),
          axios.get("/resource-api/"),
          axios.get("/notification-api/",    { withCredentials: true }),
        ]);

      setStats(dashRes.data.payload);
      setBookmarks(bookmarkRes.data.payload || []);
      setNotifications(notifRes.data.payload || []);

      const allDoubts    = doubtsRes.data.payload    || [];
      const allResources = resourcesRes.data.payload || [];

      // toString() on both sides — fixes ObjectId vs string mismatch
      setMyDoubts(
        allDoubts.filter(
          (d) => d.askedBy?._id?.toString() === currentUserId
        )
      );
      setMyResources(
        allResources.filter(
          (r) => r.uploadedBy?._id?.toString() === currentUserId
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchAll();
  }, [currentUserId]);

  const handleMarkRead = async (notifId) => {
    try {
      await axios.put(
        `/notification-api/mark-read/${notifId}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => handleMarkRead(n._id)));
  };

  const handleRemoveBookmark = async (resourceId) => {
    try {
      await axios.delete(`/bookmark-api/remove/${resourceId}`, {
        withCredentials: true,
      });
      setBookmarks((prev) =>
        prev.filter((b) => b.resourceId?._id?.toString() !== resourceId.toString())
      );
      // Refresh stat count
      const dashRes = await axios.get("/user-api/dashboard", { withCredentials: true });
      setStats(dashRes.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>

          {/* Header */}
          <h1 className={displayLg}>Dashboard</h1>
          <p className={`${bodyText} mt-3`}>
            Welcome back,{" "}
            <span className="font-bold text-[#262626]">
              {stats?.name || currentUser?.name}
            </span>
          </p>

          {/* ── Stats ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <StatCard value={stats?.points}    label="Points Earned"      icon="🏆" />
            <StatCard value={stats?.uploads}   label="Resources Uploaded" icon="📤" />
            <StatCard value={stats?.bookmarks} label="Bookmarks"          icon="🔖" />
            <StatCard value={stats?.downloads} label="Downloads"          icon="📥" />
          </div>

          {/* ── Badges ── */}
          <div className={`${card} mt-8`}>
            <h2 className={displayMd}>Badges</h2>
            {stats?.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-5">
                {stats.badges.map((badge, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 border border-[#e6e6e6] text-[13px] font-bold tracking-[0.5px] text-[#262626]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : (
              <p className={`${mutedText} mt-4`}>No badges earned yet.</p>
            )}
          </div>

          {/* ── Notifications ── */}
          <div className={`${card} mt-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className={displayMd}>Notifications</h2>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1c69d4] text-white text-[11px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[13px] font-bold tracking-[1px] uppercase text-[#6b6b6b] hover:text-[#262626] transition-colors duration-150"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className={`${mutedText} mt-4`}>No notifications yet.</p>
            ) : (
              <div className="mt-5 divide-y divide-[#e6e6e6]">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`py-4 flex items-start justify-between gap-4 ${
                      !n.isRead ? "bg-[#f7f9ff] -mx-6 px-6" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-2 shrink-0 w-2 h-2 rounded-full ${
                          !n.isRead ? "bg-[#1c69d4]" : "bg-transparent"
                        }`}
                      />
                      <div>
                        <p className="text-[14px] font-light text-[#3c3c3c] leading-[1.55]">
                          {n.message}
                        </p>
                        <p className="text-[12px] text-[#9a9a9a] mt-1">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n._id)}
                        className="shrink-0 text-[12px] font-bold tracking-[1px] uppercase text-[#6b6b6b] hover:text-[#1c69d4] transition-colors duration-150"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── My Uploads ── */}
          <div className={`${card} mt-8`}>
            <div className="flex items-center justify-between">
              <h2 className={displayMd}>My Uploads</h2>
              <Link to="/upload-resource" className={textLinkBtn}>
                + Upload New
              </Link>
            </div>

            {myResources.length === 0 ? (
              <p className={`${mutedText} mt-4`}>
                You haven't uploaded any resources yet.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-[#e6e6e6]">
                {myResources.map((r) => (
                  <div key={r._id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className={titleSm}>{r.title}</p>
                      <p className={`${mutedText} mt-0.5`}>
                        {r.subject} · Semester {r.semester}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">                   
                      <Link
                        to={`/resources/${r._id}`}
                        className="text-[13px] font-bold tracking-[1px] uppercase text-[#1c69d4] hover:text-[#0653b6] transition-colors duration-150"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Bookmarks ── */}
          <div className={`${card} mt-8`}>
            <div className="flex items-center justify-between">
              <h2 className={displayMd}>Bookmarks</h2>
              <Link to="/resources" className={textLinkBtn}>
                Browse All
              </Link>
            </div>

            {bookmarks.length === 0 ? (
              <p className={`${mutedText} mt-4`}>No bookmarks yet.</p>
            ) : (
              <div className="mt-5 divide-y divide-[#e6e6e6]">
                {bookmarks.map((b) => {
                  const r = b.resourceId;
                  if (!r) return null;
                  return (
                    <div key={b._id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className={titleSm}>{r.title}</p>
                        <p className={`${mutedText} mt-0.5`}>
                          {r.subject} · Semester {r.semester}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <Link
                          to={`/resources/${r._id}`}
                          className="text-[13px] font-bold tracking-[1px] uppercase text-[#1c69d4] hover:text-[#0653b6] transition-colors duration-150"
                        >
                          Open
                        </Link>
                        <button
                          onClick={() => handleRemoveBookmark(r._id)}
                          title="Remove bookmark"
                          className="text-[#9a9a9a] hover:text-[#dc2626] transition-colors duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── My Questions ── */}
          <div className={`${card} mt-8`}>
            <h2 className={displayMd}>My Questions</h2>

            {myDoubts.length === 0 ? (
              <p className={`${mutedText} mt-4`}>
                You haven't asked any questions yet.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-[#e6e6e6]">
                {myDoubts.map((d) => (
                  <div key={d._id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className={titleSm}>{d.title}</p>
                        {d.solved ? (
                          <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#22c55e] border border-[#22c55e] px-2 py-0.5">
                            Solved
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#f59e0b] border border-[#f59e0b] px-2 py-0.5">
                            Open
                          </span>
                        )}
                      </div>
                      <p className={`${mutedText} mt-0.5`}>
                        {d.answers?.length || 0} repl{d.answers?.length === 1 ? "y" : "ies"}
                      </p>
                    </div>
                    <Link
                      to={`/resources/${d.resourceId}`}
                      className="shrink-0 text-[13px] font-bold tracking-[1px] uppercase text-[#1c69d4] hover:text-[#0653b6] transition-colors duration-150"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}

export default Dashboard;
