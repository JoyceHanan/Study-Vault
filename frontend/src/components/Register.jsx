import {
  pageWrapper,
  centeredFlex,
  card,
  heroTitle,
  bodyText,
  mutedText,
  textInput,
  primaryBtn,
  errorText,
  labelUppercase,
} from "../styles/common";

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate  = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuthStore(
    (state) => state
  );

  const [serverError, setServerError] = useState(null);

  const onUserRegister = async (userObj) => {
    clearError();
    setServerError(null);
    const result = await registerUser(userObj);

    if (result) {
      toast.success("Registration successful! Please sign in.");
      navigate("/login");
    } else {
      const msg = useAuthStore.getState().error || "Registration failed";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className={`${pageWrapper} ${centeredFlex} px-4 py-20`}>
      <div className="w-full max-w-lg">

        <div className="mb-10">
          <h1 className={heroTitle}>Create Account</h1>
          <p className={`${bodyText} mt-4`}>
            Join Study Vault and start sharing notes, resources and discussions.
          </p>
        </div>

        <div className={card}>
          <form onSubmit={handleSubmit(onUserRegister)} className="space-y-5">

            {/* Server error banner */}
            {serverError && (
              <div className="bg-[#fef2f2] border border-[#dc2626] px-4 py-3">
                <p className="text-[13px] font-medium text-[#dc2626]">{serverError}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>Full Name</label>
              <input
                type="text"
                placeholder="Joyce Hanan Marri"
                className={textInput}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className={errorText}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={textInput}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className={errorText}>{errors.email.message}</p>}
            </div>

            {/* College */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>College</label>
              <input
                type="text"
                placeholder="Enter college name"
                className={textInput}
                {...register("college")}
              />
            </div>

            {/* Branch */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>Branch</label>
              <input
                type="text"
                placeholder="CSE"
                className={textInput}
                {...register("branch")}
              />
            </div>

            {/* Semester */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>Semester</label>
              <select className={textInput} {...register("semester")}>
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                className={textInput}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className={errorText}>{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${primaryBtn} w-full`}
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={mutedText}>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-bold text-[#262626] tracking-[0.5px] hover:text-[#1c69d4] transition-colors duration-150"
              >
                Sign In
              </NavLink>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;