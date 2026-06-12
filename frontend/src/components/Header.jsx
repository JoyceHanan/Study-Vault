import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

function Header() {
  const navigate = useNavigate();

  const currentUser = useAuthStore(
    (state) => state.currentUser
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const activeLink =
    "font-bold text-[#1c69d4]";

  const normalLink =
    "font-medium text-[#262626] hover:text-[#1c69d4] transition";

  return (
    <header className="border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight"
        >
          Study Vault
        </Link>

        <nav className="flex items-center gap-8">
          
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? activeLink
                : normalLink
            }
          >
            Home
          </NavLink>

          {!currentUser ? (
            <>
               <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? activeLink
                    : normalLink
                }
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? activeLink
                    : normalLink
                }
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? activeLink
                    : normalLink
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? activeLink
                    : normalLink
                }
              >
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="font-medium text-red-600 hover:text-red-700"
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