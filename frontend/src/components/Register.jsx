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
} from "../styles/common";

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onUserRegister = async (userObj) => {
    try {
      setLoading(true);
      setApiError(null);

      const res = await axios.post(
        "http://localhost:5000/user-api/register",
        userObj,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Registration Successful");
        navigate("/login");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Registration Failed"
      );

      toast.error("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${pageWrapper} ${centeredFlex} px-4 py-20`}
    >
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <h1 className={heroTitle}>
            Create Account
          </h1>

          <p className={`${bodyText} mt-4`}>
            Join Study Vault and start sharing
            notes, resources and discussions.
          </p>
        </div>

        <div className={card}>
          <form
            onSubmit={handleSubmit(onUserRegister)}
            className="space-y-5"
          >
            {/* Name */}

            <div>
              <label className="block mb-2 font-medium text-[#262626]">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className={textInput}
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className={errorText}>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}

            <div>
              <label className="block mb-2 font-medium text-[#262626]">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className={textInput}
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <p className={errorText}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* College */}

            <div>
              <label className="block mb-2 font-medium text-[#262626]">
                College
              </label>

              <input
                type="text"
                placeholder="Enter college name"
                className={textInput}
                {...register("college")}
              />
            </div>

            {/* Branch */}

            <div>
              <label className="block mb-2 font-medium text-[#262626]">
                Branch
              </label>

              <input
                type="text"
                placeholder="CSE"
                className={textInput}
                {...register("branch")}
              />
            </div>

            {/* Semester */}

            <div>
              <label className="block mb-2 font-medium text-[#262626]">
                Semester
              </label>

              <select
                className={textInput}
                {...register("semester")}
              >
                <option value="">
                  Select Semester
                </option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            {/* Password */}

            <div>
              <label className="block mb-2 font-medium text-[#262626]">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                className={textInput}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message:
                      "Password must be at least 6 characters",
                  },
                })}
              />

              {errors.password && (
                <p className={errorText}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {apiError && (
              <p className={errorText}>
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`${primaryBtn} w-full`}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={mutedText}>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-medium text-[#1c69d4]"
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