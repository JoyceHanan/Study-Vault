import {
  pageWrapper,
  container,
  sectionPadding,
  heroTitle,
  displayLg,
  titleLg,
  bodyText,
  primaryBtn,
  secondaryBtn,
  featureCard,
  card,
  textLinkBtn,
  surfaceSoft,
} from "../styles/common";

function Home() {
  return (
    <div className={pageWrapper}>
      {/* Hero Section */}
      <section className={sectionPadding}>
        <div className={container}>
          <div className="max-w-4xl">
            <h1 className={heroTitle}>
              Study Smarter.
              <br />
              Learn Together.
            </h1>

            <p className={`${bodyText} mt-6 max-w-2xl`}>
              Study Vault is a collaborative platform where
              students can share notes, upload resources,
              solve doubts and study together.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">
              <button className={primaryBtn}>
                Get Started
              </button>

              <button className={secondaryBtn}>
                Browse Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`${sectionPadding} ${surfaceSoft}`}>
        <div className={container}>
          <h2 className={displayLg}>
            Everything You Need To Study Better
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className={featureCard}>
              <h3 className={titleLg}>
                📚 Notes Repository
              </h3>

              <p className={`${bodyText} mt-3`}>
                Upload and access study notes organized
                by subject and semester.
              </p>
            </div>

            <div className={featureCard}>
              <h3 className={titleLg}>
                📄 Past Papers
              </h3>

              <p className={`${bodyText} mt-3`}>
                Find previous year question papers and
                important exam resources.
              </p>
            </div>

            <div className={featureCard}>
              <h3 className={titleLg}>
                💬 Doubt Forum
              </h3>

              <p className={`${bodyText} mt-3`}>
                Ask academic questions and get answers
                from fellow students.
              </p>
            </div>

            <div className={featureCard}>
              <h3 className={titleLg}>
                🎨 Whiteboard
              </h3>

              <p className={`${bodyText} mt-3`}>
                Collaborate in real-time with shared
                study whiteboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Preview */}
      <section className={sectionPadding}>
        <div className={container}>
          <h2 className={displayLg}>
            Popular Resources
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className={card}>
                <h3 className={titleLg}>
                  Data Structures Notes
                </h3>

                <p className={`${bodyText} mt-3`}>
                  Semester 4 • Unit 3
                </p>

                <button
                  className={`${textLinkBtn} mt-5`}
                >
                  View Resource
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doubts Preview */}
      <section className={`${sectionPadding} ${surfaceSoft}`}>
        <div className={container}>
          <h2 className={displayLg}>
            Recent Doubts
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className={card}>
              <h3 className={titleLg}>
                How does BFS work?
              </h3>

              <p className={`${bodyText} mt-3`}>
                Open • 3 Replies
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                Difference between TCP and UDP?
              </h3>

              <p className={`${bodyText} mt-3`}>
                Solved • 5 Replies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={sectionPadding}>
        <div className={container}>
          <h2 className={displayLg}>
            Community Impact
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className={card}>
              <h3 className="text-4xl font-bold text-[#262626]">
                500+
              </h3>
              <p className={`${bodyText} mt-2`}>
                Resources
              </p>
            </div>

            <div className={card}>
              <h3 className="text-4xl font-bold text-[#262626]">
                250+
              </h3>
              <p className={`${bodyText} mt-2`}>
                Students
              </p>
            </div>

            <div className={card}>
              <h3 className="text-4xl font-bold text-[#262626]">
                120+
              </h3>
              <p className={`${bodyText} mt-2`}>
                Doubts Solved
              </p>
            </div>

            <div className={card}>
              <h3 className="text-4xl font-bold text-[#262626]">
                80+
              </h3>
              <p className={`${bodyText} mt-2`}>
                Study Sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${sectionPadding} ${surfaceSoft}`}>
        <div className={container}>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={displayLg}>
              Ready To Start Contributing?
            </h2>

            <p className={`${bodyText} mt-6`}>
              Upload your notes, help your classmates,
              and become a valuable contributor in the
              Study Vault community.
            </p>

            <button className={`${primaryBtn} mt-8`}>
              Start Sharing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;