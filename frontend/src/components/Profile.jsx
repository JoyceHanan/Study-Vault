import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  displayMd,
  card,
  textInput,
  primaryBtn,
  secondaryBtn,
  bodyText,
  mutedText,
  labelUppercase,
} from "../styles/common";

function Profile() {
  const { currentUser, updateProfile, getProfile } = useAuthStore((s) => s);

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

  const [passwordData, setPasswordData] = useState({
    password: "",
    newpassword: "",
  });

  useEffect(() => {
    const load = async () => {
      await getProfile();
      setLoading(false);
    };
    load();
  }, []);

  // Sync form when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setProfile({
        name:     currentUser.name     || "",
        email:    currentUser.email    || "",
        photo:    currentUser.photo    || "",
        college:  currentUser.college  || "",
        branch:   currentUser.branch   || "",
        semester: currentUser.semester || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Only send text fields — photo is handled separately via Cloudinary
      // to avoid sending large base64 strings in JSON body
      const success = await updateProfile({
        name:     profile.name,
        photo:    profile.photo.startsWith("data:") ? undefined : profile.photo,
        college:  profile.college,
        branch:   profile.branch,
        semester: profile.semester,
      });
      if (success) toast.success("Profile updated successfully!");
      else toast.error(useAuthStore.getState().error || "Update failed");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/user-api/password", {
        email:       profile.email,
        password:    passwordData.password,
        newpassword: passwordData.newpassword,
      });
      toast.success("Password updated");
      setPasswordData({ password: "", newpassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      toast.loading("Uploading photo…", { id: "photo" });
      // Upload photo to cloudinary first, save URL to profile
      const formData = new FormData();
      formData.append("file", file);
      const cloudRes = await axios.post(
        "/resource-api/upload-photo",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      const photoUrl = cloudRes.data.url;
      setProfile((prev) => ({ ...prev, photo: photoUrl }));
      // Auto-save the photo immediately
      await updateProfile({ photo: photoUrl });
      toast.success("Profile photo updated!", { id: "photo" });
    } catch (err) {
      console.log(err);
      toast.error("Photo upload failed. Try again.", { id: "photo" });
    }
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>
          <h1 className={displayLg}>Profile</h1>
          <p className={`${bodyText} mt-3`}>
            Manage your account details and password.
          </p>

          {/* ── Profile form ── */}
          <form
            onSubmit={handleUpdateProfile}
            className={`${card} mt-10 max-w-3xl mx-auto`}
          >
            <h2 className={displayMd}>Account Details</h2>

            {/* Avatar */}
            <div className="flex flex-col items-center mt-6 mb-8">
              <label htmlFor="profile-image" className="cursor-pointer group">
                <div className="relative">
                  <img
                    src={
                      profile.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profile.name || "U"
                      )}&size=128&background=1c69d4&color=fff`
                    }
                    alt="profile"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#e6e6e6] group-hover:border-[#1c69d4] transition-colors duration-150"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-150 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold tracking-wider uppercase transition-opacity duration-150">
                      Change
                    </span>
                  </div>
                </div>
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <p className={`${mutedText} mt-3 text-sm`}>
                Click photo to change
              </p>
            </div>

            {/* Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${labelUppercase}`}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              <div>
                <label className={`block mb-2 ${labelUppercase}`}>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${textInput} opacity-50 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={`block mb-2 ${labelUppercase}`}>College</label>
                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              <div>
                <label className={`block mb-2 ${labelUppercase}`}>Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              <div>
                <label className={`block mb-2 ${labelUppercase}`}>Semester</label>
                <select
                  name="semester"
                  value={profile.semester}
                  onChange={handleChange}
                  className={textInput}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
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
              {saving ? "Saving…" : "Update Profile"}
            </button>
          </form>

          {/* ── Change password ── */}
          <form
            onSubmit={handlePasswordUpdate}
            className={`${card} mt-8 max-w-3xl mx-auto`}
          >
            <h2 className={displayMd}>Change Password</h2>

            <div className="space-y-4 mt-6">
              <div>
                <label className={`block mb-2 ${labelUppercase}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={textInput}
                />
              </div>

              <div>
                <label className={`block mb-2 ${labelUppercase}`}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newpassword"
                  value={passwordData.newpassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={textInput}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className={primaryBtn}>
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPasswordData({ password: "", newpassword: "" })
                  }
                  className={secondaryBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

        </div>
      </section>
    </div>
  );
}

export default Profile;