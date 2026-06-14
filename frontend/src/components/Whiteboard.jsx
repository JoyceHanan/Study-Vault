import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const SOCKET_URL  = "https://study-vault-qw0b.onrender.com";
const COLORS      = ["#262626","#1c69d4","#e22718","#22c55e","#f59e0b","#ffffff"];
const BRUSH_SIZES = [2, 4, 8, 16];

function Whiteboard() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);

  const canvasRef   = useRef(null);
  const socketRef   = useRef(null);
  const drawing     = useRef(false);
  const lastPos     = useRef({ x: 0, y: 0 });
  const ctxRef      = useRef(null);

  const [color, setColor]         = useState("#262626");
  const [brushSize, setBrushSize] = useState(4);
  const [eraser, setEraser]       = useState(false);
  const [connected, setConnected] = useState(false);
  const [roomName, setRoomName]   = useState("");
  const [participants, setParticipants] = useState(0);

  // ── Load room info ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get("/whiteboard-api/rooms", {
          withCredentials: true,
        });
        const room = (res.data.payload || []).find((r) => r._id === id);
        if (room) {
          setRoomName(room.roomName);
          setParticipants(room.participants?.length || 0);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRoom();
  }, [id]);

  // ── Canvas setup ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Socket setup ────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-room", id);
    });

    socket.on("disconnect", () => setConnected(false));

    // Receive drawing from others
    socket.on("receive-drawing", (data) => {
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size, false);
    });

    // Board cleared by someone else
    socket.on("board-cleared", () => {
      const canvas = canvasRef.current;
      const ctx    = ctxRef.current;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    return () => socket.disconnect();
  }, [id]);

  // ── Draw function ───────────────────────────────────────────────────────
  const drawLine = useCallback(
    (x0, y0, x1, y1, strokeColor, size, emit) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth   = size;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.closePath();

      if (emit) {
        socketRef.current?.emit("drawing", {
          roomId: id,
          x0, y0, x1, y1,
          color: strokeColor,
          size,
        });
      }
    },
    [id]
  );

  // ── Mouse/Touch helpers ─────────────────────────────────────────────────
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onStart = (e) => {
    drawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
  };

  const onMove = (e) => {
    if (!drawing.current) return;
    const pos         = getPos(e);
    const strokeColor = eraser ? "#ffffff" : color;
    const size        = eraser ? brushSize * 3 : brushSize;

    drawLine(lastPos.current.x, lastPos.current.y, pos.x, pos.y, strokeColor, size, true);
    lastPos.current = pos;
  };

  const onEnd = () => { drawing.current = false; };

  // ── Clear board ─────────────────────────────────────────────────────────
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx    = ctxRef.current;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    socketRef.current?.emit("clear-board", id);
  };

  // ── Save as image ───────────────────────────────────────────────────────
  const handleSave = () => {
    const canvas = canvasRef.current;
    const link   = document.createElement("a");
    link.download = `${roomName || "whiteboard"}.png`;
    link.href     = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#e6e6e6] shrink-0 gap-4 flex-wrap">

        {/* Left — back + room name */}
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
            <p className="text-[14px] font-bold text-[#262626] leading-none">
              {roomName || "Whiteboard"}
            </p>
            <p className="text-[11px] text-[#9a9a9a] mt-0.5">
              {participants} participant{participants !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Center — drawing tools */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setEraser(false); }}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
                  color === c && !eraser
                    ? "border-[#1c69d4] scale-110"
                    : "border-[#e6e6e6]"
                }`}
              />
            ))}
          </div>

          {/* Brush sizes */}
          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setBrushSize(s)}
                className={`flex items-center justify-center w-7 h-7 transition-colors duration-150 ${
                  brushSize === s
                    ? "bg-[#262626] text-white"
                    : "bg-[#f7f7f7] text-[#6b6b6b] hover:bg-[#ebebeb]"
                }`}
              >
                <span
                  style={{
                    width: Math.min(s * 1.5, 14),
                    height: Math.min(s * 1.5, 14),
                    borderRadius: "50%",
                    backgroundColor: "currentColor",
                    display: "block",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Eraser */}
          <button
            onClick={() => setEraser((v) => !v)}
            className={`px-3 h-8 text-[12px] font-bold tracking-[0.5px] border transition-colors duration-150 ${
              eraser
                ? "bg-[#262626] text-white border-[#262626]"
                : "bg-white text-[#6b6b6b] border-[#e6e6e6] hover:border-[#262626]"
            }`}
          >
            Eraser
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="px-3 h-8 text-[12px] font-bold tracking-[0.5px] border border-[#e6e6e6] text-[#e22718] hover:border-[#e22718] transition-colors duration-150"
          >
            Clear
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="px-3 h-8 text-[12px] font-bold tracking-[0.5px] bg-[#1c69d4] text-white hover:bg-[#0653b6] transition-colors duration-150"
          >
            Save PNG
          </button>
        </div>

        {/* Right — live indicator + chat button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-[#22c55e]" : "bg-[#9a9a9a]"}`} />
            <span className="text-[12px] text-[#9a9a9a]">
              {connected ? "Live" : "Connecting…"}
            </span>
          </div>

          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="flex items-center gap-1.5 px-3 h-8 border border-[#e6e6e6] text-[12px] font-bold tracking-[0.5px] text-[#6b6b6b] hover:border-[#1c69d4] hover:text-[#1c69d4] transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat
          </button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <canvas
        ref={canvasRef}
        className="flex-1 w-full cursor-crosshair touch-none"
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      />

    </div>
  );
}

export default Whiteboard;
