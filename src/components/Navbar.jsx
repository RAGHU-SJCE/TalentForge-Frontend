import { Link, useLocation } from "react-router-dom";
import { Rocket, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        background: "var(--color-surface)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >

      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 style={{ margin: 0, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Rocket size={28} color="var(--color-primary)" />
          TalentForge
        </h2>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(d => !d)}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          style={{ background: darkMode ? "#334155" : "#f8fafc", border: "1px solid var(--color-border)", padding: "7px", borderRadius: "8px", cursor: "pointer", color: darkMode ? "#fbbf24" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {!isHome && (
          <Link
            to="/"
            style={{ fontWeight: "500", color: "var(--color-text-main)" }}
          >
            Home
          </Link>
        )}

        <Link
          to="/login"
          style={{ fontWeight: "500", color: "var(--color-text-main)" }}
        >
          Sign In
        </Link>

        <Link 
          to="/register"
          className="btn btn-primary"
        >
          Get Started Free
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;