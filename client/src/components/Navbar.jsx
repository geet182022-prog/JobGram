import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white dark:bg-gray-900 shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        JobGram
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/jobs" className="hover:text-blue-600">
          Jobs
        </Link>

        {/* 🔹 Candidate Dashboard */}
        {user?.role === "candidate" && (
          <Link to="/candidate" className="hover:text-blue-600">
            Dashboard
          </Link>
        )}

        {/* 🔹 Recruiter Dashboard */}
        {user?.role === "recruiter" && (
          <Link to="/recruiter" className="hover:text-blue-600">
            Recruiter Panel
          </Link>
        )}

        {/* 🔹 Admin Dashboard */}
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-blue-600">
            Admin Panel
          </Link>
        )}

        {user?.role === "candidate" && (
          <Link to="/my-applications">My Applications</Link>
        )}

        {!user && (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-600">
              Register
            </Link>
          </>
        )}

        {user && (
          <button onClick={logout} className="text-red-500 hover:text-red-700">
            Logout
          </button>
        )}

        <button
          onClick={() => setDark(!dark)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
