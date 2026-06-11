import {
  pageWrapper,
  centeredFlex,
  card,
  heroTitle,
  bodyText,
  mutedText,
  textInput,
  primaryBtn,
  tertiaryBtn,
  googleButtonContainer,
} from "../styles/common";

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const {
    login,
    loading,
    isAuthenticated,
  } = useAuthStore((state) => state);

  const onUserLogin = (userCredObj) => {
    login(userCredObj);
  };

  useEffect(() => {

    if (isAuthenticated) {

      toast.success(
        "Login successful"
      );

      navigate("/");

    }

  }, [isAuthenticated]);

  if (loading) {

    return (
      <p className="text-center py-10">
        Loading...
      </p>
    );

  }

  return (
    <div
      className={`${pageWrapper} ${centeredFlex} px-4 py-20`}
    >

      <div
        className={`${card} w-full max-w-md shadow-sm`}
      >

        {/* Heading */}

        <div className="text-center mb-8">

          <h1 className={heroTitle}>
            Welcome Back
          </h1>

          <p className={`${bodyText} mt-3`}>
            Sign in to access your notes,
            resources, discussions and study rooms.
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit(onUserLogin)}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-sm font-medium mb-2 text-black">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className={textInput}
              {...register("email", {
                required: true,
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Email is required
              </p>
            )}

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm font-medium mb-2 text-black">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className={textInput}
              {...register("password", {
                required: true,
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                Password is required
              </p>
            )}

          </div>

          {/* Forgot Password */}

          <div className="flex justify-end">

            <button
              type="button"
              className={tertiaryBtn}
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            className={`${primaryBtn} w-full`}
          >
            Sign In
          </button>

          {/* Google Login */}

          <div className={googleButtonContainer}>

            <GoogleLogin
              onSuccess={async (
                credentialResponse
              ) => {

                try {

                  await axios.post(
                    "/user-api/google-login",
                    {
                      token:
                        credentialResponse.credential,
                    },
                    {
                      withCredentials: true,
                    }
                  );

                  window.location.href = "/";

                }
                catch (err) {

                  console.log(err);

                  toast.error(
                    "Google login failed"
                  );

                }

              }}

              onError={() => {

                toast.error(
                  "Google Login Failed"
                );

              }}
            />

          </div>

        </form>

        {/* Footer */}

        <p
          className={`${mutedText} text-center mt-6`}
        >

          Don't have an account?{" "}

          <NavLink
            to="/register"
            className="font-medium text-black hover:underline"
          >
            Create one
          </NavLink>

        </p>

      </div>

    </div>
  );
}

export default Login;