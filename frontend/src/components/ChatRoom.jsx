import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { textInput, primaryBtn } from "../styles/common";

const SOCKET_URL = "https://study-vault-qw0b.onrender.com";

function Chatroom() {
  const { roomId }    = useParams();
  const navigate      = useNavigate();
  const currentUser   = useAuthStore((s) => s.currentUser);
  const currentUserId = (currentUser?._id || currentUser?.id || "").toString();

  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState("");
  const [connected, setConnected]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [roomName, setRoomName]     = useState(roomId);

  // Context menu state
  const [ctxMenu, setCtxMenu]       = useState(null); // { x, y, msg }
  // Edit state
  const [editingId, setEditingId]   = useState(null);
  const [editText, setEditText]     = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const ctxRef    = useRef(null);

  // ── Load room name ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get("/whiteboard-api/rooms", {
          withCredentials: true,
        });
        const room = (res.data.payload || []).find((r) => r._id === roomId);
        if (room) setRoomName(room.roomName);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRoom();
  }, [roomId]);

  // ── Load history ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/chat-api/${roomId}`, {
          withCredentials: true,
        });
        setMessages(res.data.payload || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [roomId]);

  // ── Socket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-room", roomId);
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("receive-message", (data) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === data._id);
        return exists ? prev : [...prev, data];
      });
    });

    socket.on("message-deleted", (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    socket.on("message-edited", (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data.messageId ? { ...m, message: data.message } : m
        )
      );
    });

    return () => socket.disconnect();
  }, [roomId]);

  // ── Auto scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Close context menu on outside click ───────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (ctxRef.current && !ctxRef.current.contains(e.target)) {
        setCtxMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Send ───────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        "/chat-api/send",
        { roomId, message: text.trim() },
        { withCredentials: true }
      );
      const newMsg = res.data.payload;
      socketRef.current?.emit("send-message", {
        roomId,
        sender:    newMsg.sender,
        message:   newMsg.message,
        _id:       newMsg._id,
        createdAt: newMsg.createdAt,
      });
      setText("");
      inputRef.current?.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Right-click / long-press context menu ─────────────────────────────
  const handleContextMenu = (e, msg) => {
    const senderId = (msg.sender?._id || msg.sender)?.toString();
    if (senderId !== currentUserId) return; // only own messages
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, msg });
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (msg) => {
    setCtxMenu(null);
    try {
      await axios.delete(`/chat-api/${msg._id}`, { withCredentials: true });
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
      socketRef.current?.emit("delete-message", {
        roomId,
        messageId: msg._id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ── Edit — open inline editor ──────────────────────────────────────────
  const handleStartEdit = (msg) => {
    setCtxMenu(null);
    setEditingId(msg._id);
    setEditText(msg.message);
  };

  const handleSaveEdit = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await axios.put(
        `/chat-api/${msgId}`,
        { message: editText.trim() },
        { withCredentials: true }
      );
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msgId ? { ...m, message: editText.trim() } : m
        )
      );
      socketRef.current?.emit("edit-message", {
        roomId,
        messageId: msgId,
        message: editText.trim(),
      });
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col h-screen bg-white font-sans select-none">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-[#e6e6e6] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/whiteboards")}
            className="text-[#6b6b6b] hover:text-[#262626] transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <p className="text-[16px] font-bold text-[#262626] leading-none">
              # {roomName}
            </p>
            <p className="text-[12px] text-[#9a9a9a] mt-0.5">Room chat</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-[#22c55e]" : "bg-[#9a9a9a]"}`} />
            <span className="text-[12px] text-[#9a9a9a]">
              {connected ? "Live" : "Connecting…"}
            </span>
          </div>
          <button
            onClick={() => navigate(`/whiteboard/${roomId}`)}
            className="flex items-center gap-1.5 px-3 h-8 border border-[#e6e6e6] text-[12px] font-bold tracking-[0.5px] text-[#6b6b6b] hover:border-[#1c69d4] hover:text-[#1c69d4] transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" /><path d="M9 21V9" />
            </svg>
            Whiteboard
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {loading ? (
          <p className="text-[14px] text-[#9a9a9a] text-center pt-10">
            Loading messages…
          </p>
        ) : messages.length === 0 ? (
          <div className="text-center pt-16">
            <p className="text-[40px] mb-3">💬</p>
            <p className="text-[14px] font-bold text-[#262626]">No messages yet</p>
            <p className="text-[13px] text-[#9a9a9a] mt-1">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = (msg.sender?._id || msg.sender)?.toString();
            const isOwn    = senderId === currentUserId;
            const isEditing = editingId === msg._id;

            return (
              <div
                key={msg._id || index}
                className={`flex items-end gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <img
                  src={
                    msg.sender?.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      msg.sender?.name || "U"
                    )}&size=40&background=1c69d4&color=fff`
                  }
                  alt={msg.sender?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />

                {/* Bubble */}
                <div
                  className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                >
                  {!isOwn && (
                    <p className="text-[11px] font-bold text-[#6b6b6b] mb-1 ml-1">
                      {msg.sender?.name || "Unknown"}
                    </p>
                  )}

                  {isEditing ? (
                    /* ── Inline edit ── */
                    <div className="flex flex-col gap-2 w-64">
                      <input
                        className={`${textInput} text-[13px]`}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(msg._id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(msg._id)}
                          className="flex-1 h-7 text-[11px] font-bold uppercase tracking-[0.5px] bg-[#1c69d4] text-white hover:bg-[#0653b6] transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 h-7 text-[11px] font-bold uppercase tracking-[0.5px] border border-[#e6e6e6] text-[#6b6b6b] hover:border-[#262626] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal bubble — right-click for menu ── */
                    <div
                      onContextMenu={(e) => handleContextMenu(e, msg)}
                      className={`px-4 py-2.5 text-[14px] font-light leading-[1.55] cursor-default select-text ${
                        isOwn
                          ? "bg-[#1c69d4] text-white"
                          : "bg-[#f7f7f7] text-[#262626]"
                      }`}
                    >
                      {/* Render shared resource links as clickable cards */}
                      {msg.message.startsWith("📎 ") ? (
                        (() => {
                          const parts = msg.message.split(" — ");
                          const title = parts[0].replace("📎 ", "").trim();
                          const url   = parts[1]?.trim();
                          const path  = url?.replace(window.location.origin, "");
                          return (
                            <div className={`flex flex-col gap-2 p-3 border ${
                              isOwn
                                ? "border-white/30 bg-white/10"
                                : "border-[#e6e6e6] bg-white"
                            }`}>
                              <p className={`text-[10px] font-bold tracking-[1.5px] uppercase ${
                                isOwn ? "text-white/60" : "text-[#9a9a9a]"
                              }`}>
                                Shared Resource
                              </p>
                              <p className={`text-[14px] font-bold leading-[1.3] ${
                                isOwn ? "text-white" : "text-[#262626]"
                              }`}>
                                {title}
                              </p>
                              {path && (
                                <a
                                  href={path}
                                  className={`inline-flex items-center gap-1 text-[12px] font-bold tracking-[0.5px] uppercase mt-1 w-fit ${
                                    isOwn
                                      ? "text-white underline"
                                      : "text-[#1c69d4] hover:text-[#0653b6]"
                                  } transition-colors duration-150`}
                                >
                                  Open Resource
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        msg.message
                      )}
                      {msg.edited && (
                        <span className="text-[10px] opacity-60 ml-2">(edited)</span>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-[#9a9a9a] mt-1">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Context menu ── */}
      {ctxMenu && (
        <div
          ref={ctxRef}
          style={{ top: ctxMenu.y, left: ctxMenu.x }}
          className="fixed z-50 bg-white border border-[#e6e6e6] shadow-lg py-1 min-w-[140px]"
        >
          <button
            onClick={() => handleStartEdit(ctxMenu.msg)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#262626] hover:bg-[#f7f7f7] transition-colors duration-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDelete(ctxMenu.msg)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors duration-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-[#e6e6e6] px-6 py-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message… (Enter to send)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${textInput} flex-1`}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`${primaryBtn} shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default Chatroom;