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

  const currentUser = useAuthStore(
    (state) => state.currentUser
  );

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
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
              materials, and learn together through discussions and
              shared knowledge.
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
                className="px-8 h-14 border border-[#d9d9d9] font-semibold hover:border-[#262626] transition-colors duration-150"
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
                Share notes, assignments, question papers,
                presentations and study material with fellow
                students.
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                🔍 Find Resources
              </h3>

              <p className={`${bodyText} mt-4`}>
                Discover useful study materials uploaded by the
                community and access them instantly.
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                💬 Discussions
              </h3>

              <p className={`${bodyText} mt-4`}>
                Ask questions directly under resources and learn
                collaboratively with other students.
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                🤝 Collaborative Learning
              </h3>

              <p className={`${bodyText} mt-4`}>
                Share knowledge, help classmates, and build a
                stronger learning community together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;