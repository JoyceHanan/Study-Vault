import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  titleLg,
  card,
  textInput,
  primaryBtn,
  bodyText,
  mutedText,
} from "../styles/common";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
    college: "",
    branch: "",
    semester: "",
  });

  const [dashboard, setDashboard] = useState({
    points: 0,
    uploads: 0,
    downloads: 0,
    savedResources: 0,
    badges: [],
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    newpassword: "",
  });

  const getData = async () => {
    try {
      const [profileRes, dashboardRes] = await Promise.all([
        axios.get(
          "http://localhost:5000/user-api/profile",
          { withCredentials: true }
        ),
        axios.get(
          "http://localhost:5000/user-api/dashboard",
          { withCredentials: true }
        ),
      ]);

      setProfile(profileRes.data.payload);
      setDashboard(dashboardRes.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(
        "http://localhost:5000/user-api/update-profile",
        {
          name: profile.name,
          photo: profile.photo,
          college: profile.college,
          branch: profile.branch,
          semester: profile.semester,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Profile updated");
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/user-api/password",
        {
          email: profile.email,
          password: passwordData.password,
          newpassword: passwordData.newpassword,
        }
      );

      toast.success("Password updated");

      setPasswordData({
        password: "",
        newpassword: "",
      });
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Password update failed"
      );
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfile({
      ...profile,
      photo: imageUrl,
    });

    toast.success(
      "Image selected. Click Update Profile to save."
    );
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">
            Loading profile...
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
            Profile
          </h1>

          <p className={`${bodyText} mt-4`}>
            Manage your account and activity.
          </p>

          {/* PROFILE */}

          <form
            onSubmit={handleUpdateProfile}
            className={`${card} mt-10 max-w-4xl`}
          >
            <div className="flex flex-col items-center mb-8">
              <label
                htmlFor="profile-image"
                className="cursor-pointer"
              >
                <img
                  src={
                    profile.photo ||
                    `https://ui-avatars.com/api/?name=${profile.name}`
                  }
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              <p className={`${mutedText} mt-3`}>
                Click image to change photo
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name || ""}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className={`${textInput} bg-gray-100`}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  College
                </label>

                <input
                  type="text"
                  name="college"
                  value={profile.college || ""}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  value={profile.branch || ""}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Semester
                </label>

                <select
                  name="semester"
                  value={profile.semester || ""}
                  onChange={handleChange}
                  className={textInput}
                >
                  <option value="">
                    Select Semester
                  </option>

                  {[1,2,3,4,5,6,7,8].map((sem) => (
                    <option
                      key={sem}
                      value={sem}
                    >
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`${primaryBtn} mt-8`}
            >
              {saving
                ? "Saving..."
                : "Update Profile"}
            </button>
          </form>

          {/* STATS */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className={card}>
              <h3 className={titleLg}>
                {dashboard.points}
              </h3>
              <p className={mutedText}>
                Points
              </p>
            </div>

            <div className={card}>
              <h3 className={titleLg}>
                {dashboard.uploads}
              </h3>
              <p className={mutedText}>
                Uploads
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

          {/* BADGES */}

          <div className={`${card} mt-10`}>
            <h2 className={titleLg}>
              Badges
            </h2>

            {dashboard.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-5">
                {dashboard.badges.map(
                  (badge, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-gray-100"
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

          {/* ACTIVITY */}

          <div className={`${card} mt-10`}>
            <h2 className={titleLg}>
              Activity Summary
            </h2>

            <div className="space-y-3 mt-5">
              <p>📤 Uploaded Resources: {dashboard.uploads}</p>
              <p>📥 Downloads: {dashboard.downloads}</p>
              <p>⭐ Saved Resources: {dashboard.savedResources}</p>
              <p>🏆 Total Points: {dashboard.points}</p>
            </div>
          </div>

          {/* CHANGE PASSWORD */}

          <form
            onSubmit={handlePasswordUpdate}
            className={`${card} mt-10`}
          >
            <h2 className={titleLg}>
              Change Password
            </h2>

            <div className="space-y-4 mt-6">
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className={textInput}
              />

              <input
                type="password"
                name="newpassword"
                value={passwordData.newpassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className={textInput}
              />

              <button
                type="submit"
                className={primaryBtn}
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Profile;