import { create } from "zustand";
import axios from "axios";
axios.defaults.baseURL =
  "http://localhost:6000";

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({

  currentUser: null,
  dashboard: null,

  isAuthenticated: false,
  loading: false,
  error: null,

  // ================= LOGIN =================

  login: async (userCred) => {

    try {

      set({
        loading: true,
        error: null,
      });

      const res = await axios.post(
        "/user-api/login",
        userCred,
        {
          withCredentials: true,
        }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;

    } catch (err) {

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.message ||
          "Login failed",
      });

      return false;

    }

  },

  // ================= REGISTER =================

  register: async (userData) => {

    try {

      set({
        loading: true,
        error: null,
      });

      const res = await axios.post(
        "/user-api/register",
        userData,
        {
          withCredentials: true,
        }
      );

      set({
        loading: false,
        error: null,
      });

      return res.data;

    } catch (err) {

      set({
        loading: false,
        error:
          err.response?.data?.message ||
          "Registration failed",
      });

      return null;

    }

  },

  // ================= LOGOUT =================

  logout: async () => {

    try {

      await axios.get(
        "/user-api/logout",
        {
          withCredentials: true,
        }
      );

      set({
        currentUser: null,
        dashboard: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

    } catch (err) {

      set({
        error:
          err.response?.data?.message ||
          "Logout failed",
      });

    }

  },

  // ================= REFRESH TOKEN =================

  refreshToken: async () => {

    try {

      await axios.post(
        "/user-api/refresh",
        {},
        {
          withCredentials: true,
        }
      );

      return true;

    } catch {

      return false;

    }

  },

  // ================= CHECK AUTH =================

  checkAuth: async () => {

    try {

      set({
        loading: true,
      });

      const res = await axios.get(
        "/user-api/check-auth",
        {
          withCredentials: true,
        }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: !!res.data.payload,
        loading: false,
        error: null,
      });

    } catch {

      try {

        await axios.post(
          "/user-api/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        const res = await axios.get(
          "/user-api/check-auth",
          {
            withCredentials: true,
          }
        );

        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

      } catch {

        set({
          currentUser: null,
          dashboard: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });

      }

    }

  },

  // ================= PROFILE =================

  getProfile: async () => {

    try {

      const res = await axios.get(
        "/user-api/profile",
        {
          withCredentials: true,
        }
      );

      set({
        currentUser: res.data.payload,
      });

    } catch (err) {

      console.log(err);

    }

  },

  updateProfile: async (userData) => {

    try {

      set({
        loading: true,
        error: null,
      });

      const res = await axios.put(
        "/user-api/update-profile",
        userData,
        {
          withCredentials: true,
        }
      );

      set({
        currentUser: res.data.payload,
        loading: false,
      });

      return true;

    } catch (err) {

      set({
        loading: false,
        error:
          err.response?.data?.message ||
          "Profile update failed",
      });

      return false;

    }

  },

  // ================= DASHBOARD =================

  getDashboard: async () => {

    try {

      const res = await axios.get(
        "/user-api/dashboard",
        {
          withCredentials: true,
        }
      );

      set({
        dashboard: res.data.payload,
      });

    } catch (err) {

      console.log(err);

    }

  },

  // ================= CLEAR ERROR =================

  clearError: () => {

    set({
      error: null,
    });

  },

}));