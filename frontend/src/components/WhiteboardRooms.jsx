import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  card,
  titleMd,
  bodyText,
  mutedText,
  textInput,
  primaryBtn,
  secondaryBtn,
  labelUppercase,
} from "../styles/common";

function WhiteboardRooms() {
  const navigate      = useNavigate();
  const currentUser   = useAuthStore((s) => s.currentUser);
  const currentUserId = (currentUser?._id || currentUser?.id || "").toString();

  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [actionId, setActionId] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/whiteboard-api/rooms", { withCredentials: true });
      setRooms(res.data.payload || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    try {
      setCreating(true);
      const res = await axios.post(
        "/whiteboard-api/create-room",
        { roomName: roomName.trim() },
        { withCredentials: true }
      );
      setRooms((prev) => [res.data.payload, ...prev]);
      setRoomName("");
      setShowForm(false);
    } catch (err) {
      console.log(err);
    } finally {
      setCreating(false);
    }
  };

  const isParticipant = (room) =>
    room.participants?.some((p) => (p?._id || p)?.toString() === currentUserId);

  const isPending = (room) =>
    room.pendingRequests?.some((p) => (p?._id || p)?.toString() === currentUserId);

  const isCreator = (room) =>
    (room.createdBy?._id || room.createdBy)?.toString() === currentUserId;

  const handleRequestJoin = async (roomId) => {
    try {
      setActionId(roomId + "req");
      await axios.post(`/whiteboard-api/request-join/${roomId}`, {}, { withCredentials: true });
      fetchRooms();
    } catch (err) { console.log(err); }
    finally { setActionId(null); }
  };

  const handleAccept = async (roomId, userId) => {
    try {
      setActionId(roomId + userId + "acc");
      await axios.post(`/whiteboard-api/accept/${roomId}/${userId}`, {}, { withCredentials: true });
      fetchRooms();
    } catch (err) { console.log(err); }
    finally { setActionId(null); }
  };

  const handleDeny = async (roomId, userId) => {
    try {
      setActionId(roomId + userId + "den");
      await axios.post(`/whiteboard-api/deny/${roomId}/${userId}`, {}, { withCredentials: true });
      fetchRooms();
    } catch (err) { console.log(err); }
    finally { setActionId(null); }
  };

  const handleLeave = async (roomId) => {
    if (!window.confirm("Leave this room?")) return;
    try {
      setActionId(roomId + "leave");
      await axios.post(`/whiteboard-api/leave/${roomId}`, {}, { withCredentials: true });
      fetchRooms();
    } catch (err) { console.log(err); }
    finally { setActionId(null); }
  };

  const handleGo = (room, destination) => {
    if (!isParticipant(room)) return;
    navigate(destination === "whiteboard" ? `/whiteboard/${room._id}` : `/chat/${room._id}`);
  };

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={displayLg}>Study Rooms</h1>
              <p className={`${bodyText} mt-3`}>
                Create or join a room to collaborate on a shared whiteboard and chat in real-time.
              </p>
            </div>
            <button onClick={() => setShowForm((v) => !v)} className={`${primaryBtn} shrink-0 mt-2`}>
              {showForm ? "Cancel" : "+ Create Room"}
            </button>
          </div>

          {/* Create form */}
          {showForm && (
            <form onSubmit={handleCreate} className={`${card} mt-8 flex gap-4 items-end`}>
              <div className="flex-1">
                <label className={`block mb-2 ${labelUppercase}`}>Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. WT Unit-3 Group"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className={textInput}
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={creating || !roomName.trim()}
                className={`${primaryBtn} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {creating ? "Creating…" : "Create"}
              </button>
            </form>
          )}

          {/* Rooms */}
          {loading ? (
            <p className={`${mutedText} mt-10`}>Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <div className={`${card} mt-8 text-center py-16`}>
              <p className="text-[40px] mb-3">🏠</p>
              <p className={titleMd}>No rooms yet</p>
              <p className={`${mutedText} mt-2`}>Create the first study room to get started.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {rooms.map((room) => {
                const joined      = isParticipant(room);
                const pending     = isPending(room);
                const creator     = isCreator(room);
                const pendingList = room.pendingRequests || [];

                return (
                  <div key={room._id} className={`${card} flex flex-col gap-4`}>

                    {/* Room info */}
                    <div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className={titleMd}>{room.roomName}</h3>
                        <div className="flex items-center gap-2">
                          {creator && (
                            <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#1c69d4] border border-[#1c69d4] px-2 py-0.5">
                              Owner
                            </span>
                          )}
                          {joined && !creator && (
                            <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#22c55e] border border-[#22c55e] px-2 py-0.5">
                              Joined
                            </span>
                          )}
                          {pending && (
                            <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#f59e0b] border border-[#f59e0b] px-2 py-0.5">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`${mutedText} mt-2`}>
                        Created by{" "}
                        <span className="font-medium text-[#6b6b6b]">
                          {room.createdBy?.name || "Unknown"}
                        </span>
                      </p>
                      <p className={`${mutedText} mt-1`}>
                        {room.participants?.length || 0} participant
                        {room.participants?.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Pending requests — creator only */}
                    {creator && pendingList.length > 0 && (
                      <div className="border border-[#f59e0b] bg-[#fffbeb] p-3">
                        <p className="text-[12px] font-bold tracking-[1px] uppercase text-[#f59e0b] mb-2">
                          {pendingList.length} Join Request{pendingList.length > 1 ? "s" : ""}
                        </p>
                        <div className="space-y-2">
                          {pendingList.map((user) => {
                            const uid = (user?._id || user)?.toString();
                            return (
                              <div key={uid} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&size=28&background=1c69d4&color=fff`}
                                    alt={user?.name}
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                  <p className="text-[13px] font-medium text-[#262626]">
                                    {user?.name || "Unknown"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleAccept(room._id, uid)}
                                    disabled={actionId === room._id + uid + "acc"}
                                    className="px-2 py-1 text-[11px] font-bold tracking-[0.5px] uppercase bg-[#22c55e] text-white hover:bg-[#16a34a] transition-colors disabled:opacity-40"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleDeny(room._id, uid)}
                                    disabled={actionId === room._id + uid + "den"}
                                    className="px-2 py-1 text-[11px] font-bold tracking-[0.5px] uppercase bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors disabled:opacity-40"
                                  >
                                    Deny
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-[#e6e6e6]" />

                    {/* Actions */}
                    {joined ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleGo(room, "whiteboard")}
                            className={`${primaryBtn} flex-1 flex items-center justify-center gap-2`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 9h18" /><path d="M9 21V9" />
                            </svg>
                            Board
                          </button>
                          <button
                            onClick={() => handleGo(room, "chat")}
                            className={`${secondaryBtn} flex-1 flex items-center justify-center gap-2`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Chat
                          </button>
                        </div>

                        {/* Leave — only non-creators can leave */}
                        {!creator && (
                          <button
                            onClick={() => handleLeave(room._id)}
                            disabled={actionId === room._id + "leave"}
                            className="w-full h-8 text-[12px] font-bold tracking-[1px] uppercase text-[#dc2626] border border-[#dc2626] hover:bg-[#fef2f2] transition-colors duration-150 disabled:opacity-40"
                          >
                            Leave Room
                          </button>
                        )}
                      </div>
                    ) : pending ? (
                      <p className="text-[13px] font-light text-[#f59e0b] text-center py-2">
                        ⏳ Waiting for creator approval…
                      </p>
                    ) : (
                      <button
                        onClick={() => handleRequestJoin(room._id)}
                        disabled={actionId === room._id + "req"}
                        className={`${secondaryBtn} w-full flex items-center justify-center gap-2 disabled:opacity-40`}
                      >
                        Request to Join
                      </button>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default WhiteboardRooms;