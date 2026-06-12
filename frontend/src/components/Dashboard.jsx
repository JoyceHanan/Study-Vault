import { useEffect, useState } from "react";
import axios from "axios";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  card,
  titleLg,
  bodyText,
  mutedText,
} from "../styles/common";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/user-api/dashboard",
        {
          withCredentials: true,
        }
      );

      setDashboard(res.data.payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">
            Unable to load dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>
          <h1 className={displayLg}>
            Dashboard
          </h1>

          <p className={`${bodyText} mt-4`}>
            Welcome back, {dashboard.name}
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className={card}>
              <h3 className={titleLg}>
                {dashboard.points}
              </h3>

              <p className={mutedText}>
                Points Earned
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                {dashboard.uploads}
              </h3>

              <p className={mutedText}>
                Resources Uploaded
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                {dashboard.savedResources}
              </h3>

              <p className={mutedText}>
                Saved Resources
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                {dashboard.downloads}
              </h3>

              <p className={mutedText}>
                Downloads
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className={`${card} mt-10`}>
            <h2 className={titleLg}>
              Badges
            </h2>

            {dashboard.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-6">
                {dashboard.badges.map(
                  (badge, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#f5f5f5] rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className={`${mutedText} mt-4`}>
                No badges earned yet.
              </p>
            )}
          </div>

          {/* Activity Summary */}
          <div className={`${card} mt-10`}>
            <h2 className={titleLg}>
              Activity Summary
            </h2>

            <div className="mt-6 space-y-3">
              <p className={bodyText}>
                📤 Uploaded Resources:{" "}
                {dashboard.uploads}
              </p>

              <p className={bodyText}>
                📥 Downloads:{" "}
                {dashboard.downloads}
              </p>

              <p className={bodyText}>
                ⭐ Saved Resources:{" "}
                {dashboard.savedResources}
              </p>

              <p className={bodyText}>
                🏆 Total Points:{" "}
                {dashboard.points}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;