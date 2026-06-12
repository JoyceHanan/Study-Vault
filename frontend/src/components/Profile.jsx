import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
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
    photo: "",
    college: "",
    branch: "",
    semester: "",
    email: "",
  });

  const getProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/user-api/profile",
        {
          withCredentials: true,
        }
      );

      setProfile(res.data.payload);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
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
            Manage your account information.
          </p>

          <form
            onSubmit={handleUpdate}
            className={`${card} max-w-3xl mt-10 space-y-6`}
          >
            {/* Profile Photo */}

            <div className="flex flex-col items-center">
              <img
                src={
                  profile.photo ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <input
                type="text"
                name="photo"
                value={profile.photo || ""}
                onChange={handleChange}
                placeholder="Profile Photo URL"
                className={`${textInput} mt-4`}
              />
            </div>

            {/* Name */}

            <div>
              <label className="block mb-2 font-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className={textInput}
              />
            </div>

            {/* Email */}

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

              <p className={`${mutedText} mt-1`}>
                Email cannot be changed.
              </p>
            </div>

            {/* College */}

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

            {/* Branch */}

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

            {/* Semester */}

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

            <button
              type="submit"
              disabled={saving}
              className={primaryBtn}
            >
              {saving
                ? "Saving..."
                : "Update Profile"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Profile;