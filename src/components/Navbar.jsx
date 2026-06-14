import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 40px",
        background: "#111827",
      }}
    >
      <h2>TalentForge</h2>

      <div>
        <Link
          to="/"
          style={{ marginRight: "20px" }}
        >
          Home
        </Link>

        <Link
          to="/login"
          style={{ marginRight: "20px" }}
        >
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;