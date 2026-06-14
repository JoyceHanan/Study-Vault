import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  displayMd,
  titleMd,
  bodyText,
  mutedText,
  card,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";

const FEATURES = [
  {
    icon: "📚",
    title: "Upload Resources",
    desc: "Share notes, assignments, question papers and presentations with your college community.",
  },
  {
    icon: "🔍",
    title: "Find & Browse",
    desc: "Search resources by subject, topic, unit or semester. Filter exactly what you need.",
  },
  {
    icon: "🔖",
    title: "Bookmark",
    desc: "Save important resources to your dashboard and access them anytime.",
  },
  {
    icon: "👍",
    title: "Upvote & Downvote",
    desc: "Rate resources so the best content rises to the top for everyone.",
  },
  {
    icon: "💬",
    title: "Ask Questions",
    desc: "Post doubts on any resource. Get replies from classmates. Mark questions as solved.",
  },
  {
    icon: "🏠",
    title: "Study Rooms",
    desc: "Create private groups. Invite classmates. Collaborate in real-time with chat and whiteboard.",
  },
  {
    icon: "🎨",
    title: "Live Whiteboard",
    desc: "Draw, annotate and explain concepts together on a shared whiteboard inside your study room.",
  },
  {
    icon: "📥",
    title: "Download Resources",
    desc: "Download PDFs, PPTX and DOCX files directly to your device with one click.",
  },
];

const STEPS = [
  { step: "01", title: "Create an account", desc: "Sign up with email or Google in seconds." },
  { step: "02", title: "Browse resources", desc: "Search notes shared by students in your college." },
  { step: "03", title: "Upload & share", desc: "Upload your own notes and help your community." },
  { step: "04", title: "Collaborate", desc: "Join study rooms, chat, draw on whiteboards together." },
];

function Home() {
  const navigate    = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleGetStarted = () =>
    navigate(currentUser ? "/dashboard" : "/register");

  return (
    <div className={pageWrapper}>

      {/* ── Hero ── */}
      <section className="py-24 border-b border-[#e6e6e6]">
        <div className={container}>
          <div className="max-w-3xl">
        
            <h1 className="text-[56px] font-bold leading-[1.05] text-[#262626]">
              Study Smarter.
              <br />
              Learn Together.
            </h1>

            <p className={`${bodyText} mt-6 max-w-2xl`}>
              Study Vault is a collaborative platform where students upload notes,
              share resources, ask doubts, collaborate on whiteboards, and learn
              together in real-time study rooms.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button onClick={handleGetStarted} className={primaryBtn}>
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/resources")}
                className={secondaryBtn}
              >
                Browse Resources
              </button>
            </div>

         
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={sectionPadding}>
        <div className={container}>
          <div className="max-w-2xl">
            <h2 className={displayMd}>Everything you need to study better</h2>
            <p className={`${bodyText} mt-4`}>
              One platform for notes, doubts, bookmarks, real-time chat and collaborative whiteboards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {FEATURES.map((f) => (
              <div key={f.title} className={`${card} flex flex-col gap-3`}>
                <span className="text-3xl">{f.icon}</span>
                <h3 className={titleMd}>{f.title}</h3>
                <p className={`${mutedText} text-[13px] font-light leading-[1.6]`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 border-t border-[#e6e6e6] bg-[#f7f7f7]">
        <div className={container}>
          <h2 className={displayMd}>How it works</h2>
          <p className={`${bodyText} mt-4`}>Get started in four simple steps.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <span className="text-[40px] font-bold text-[#e6e6e6]">{s.step}</span>
                <h3 className={titleMd}>{s.title}</h3>
                <p className={`${mutedText} text-[13px] font-light leading-[1.6]`}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;