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
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

function Login() {
  const {register,handleSubmit,formState:{errors},}=useForm();
  const navigate = useNavigate();
  const {login,loading,isAuthenticated}=useAuthStore((state)=>state);
  const onUserLogin = async (userCredObj) => {
    const success = await login(userCredObj);
    if (!success) {
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`${pageWrapper} ${centeredFlex} px-4`}>
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-10">
          <h1 className={heroTitle}>Sign in</h1>
          <p className={`${bodyText} mt-4`}>
            Access your notes, resources, discussions and study groups.
          </p>
        </div>

        {/* Card */}
        <div className={card}>
          <form onSubmit={handleSubmit(onUserLogin)} className="space-y-5">

            {/* Email */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>
                Email
              </label>
              <input
                type="email"
                className={textInput}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className={errorText}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block mb-2 ${labelUppercase}`}>
                Password
              </label>
              <input
                type="password"
                className={textInput}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className={errorText}>{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`${primaryBtn} w-full mt-2`}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className={mutedText}>
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="font-bold text-[#262626] tracking-[0.5px] hover:text-[#1c69d4] transition-colors duration-150"
              >
                Create one
              </NavLink>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
