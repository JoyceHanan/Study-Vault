import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  titleLg,
  bodyText,
  card,
  primaryBtn,
} from "../styles/common";

function Home() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className={pageWrapper}>
      {/* HERO SECTION */}

      <section className={sectionPadding}>
        <div className={container}>
          <div className="max-w-4xl">
            <h1 className={displayLg}>
              Study Smarter.
              <br />
              Learn Together.
            </h1>

            <p className={`${bodyText} mt-6 max-w-3xl`}>
              Study Vault is a collaborative platform where students
              can upload notes, share resources, access study
              materials, save useful content, and learn together.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button
                onClick={handleGetStarted}
                className={primaryBtn}
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/resources")}
                className="px-8 h-14 border border-[#d9d9d9] font-semibold"
              >
                Browse Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}

      <section className={sectionPadding}>
        <div className={container}>
          <h2 className={displayLg}>
            Everything You Need To Study Better
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className={card}>
              <h3 className={titleLg}>
                📚 Upload Notes
              </h3>

              <p className={`${bodyText} mt-4`}>
                Share notes, assignments, question papers and
                presentations with other students.
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                🔍 Find Resources
              </h3>

              <p className={`${bodyText} mt-4`}>
                Search and access useful study material uploaded by
                the community.
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                💾 Save Resources
              </h3>

              <p className={`${bodyText} mt-4`}>
                Bookmark important resources and revisit them
                whenever needed.
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                🤝 Learn Together
              </h3>

              <p className={`${bodyText} mt-4`}>
                Collaborate with classmates through discussions,
                doubts and shared learning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;