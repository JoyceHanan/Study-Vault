import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

function Header() {
  const navigate    = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout      = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const activeLink = "font-bold text-[#1c69d4]";
  const normalLink =
    "font-medium text-[#262626] hover:text-[#1c69d4] transition-colors duration-150";

  return (
    <header className="border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold tracking-tight text-[#262626]">
          Study Vault
        </Link>

        <nav className="flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => isActive ? activeLink : normalLink}>
            Home
          </NavLink>

          {!currentUser ? (
            <>
              <NavLink to="/register" className={({ isActive }) => isActive ? activeLink : normalLink}>
                Register
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? activeLink : normalLink}>
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeLink : normalLink}>
                Dashboard
              </NavLink>
              <NavLink to="/whiteboards" className={({ isActive }) => isActive ? activeLink : normalLink}>
                Groups
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? activeLink : normalLink}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="font-medium text-[#dc2626] hover:text-[#b91c1c] transition-colors duration-150"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;