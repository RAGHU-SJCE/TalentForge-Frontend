import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Sparkles, LayoutDashboard, Target, TrendingUp, Rocket } from "lucide-react";

function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Hero Section */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", background: "linear-gradient(135deg, var(--color-background) 0%, var(--color-info-bg) 100%)" }}>
        
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "var(--color-info-bg)", color: "var(--color-primary)", borderRadius: "20px", fontWeight: "600", fontSize: "0.875rem", marginBottom: "24px", border: "1px solid rgba(79, 70, 229, 0.2)" }}>
          <Sparkles size={16} /> The Smart Career Platform
        </div>

        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em", color: "var(--color-secondary)", marginBottom: "20px", maxWidth: "800px" }}>
          Accelerate Your Career with <br />
          <span style={{ background: "linear-gradient(to right, #4f46e5, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            TalentForge
          </span>
        </h1>

        <p style={{ fontSize: "1.25rem", color: "var(--color-text-muted)", maxWidth: "600px", margin: "0 auto 40px auto", lineHeight: "1.6" }}>
          Connect with top recruiters, track your applications, and showcase your best projects all in one intelligent platform.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1.125rem", borderRadius: "8px", boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.39)" }}>
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: "14px 28px", fontSize: "1.125rem", borderRadius: "8px", background: "var(--color-surface)" }}>
            Sign In
          </Link>

        </div>

        {/* Mockup / Graphic Representation */}
        <div style={{ marginTop: "60px", width: "100%", maxWidth: "900px", background: "var(--color-surface)", padding: "10px", borderRadius: "12px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)" }}>
          <div style={{ height: "400px", background: "var(--color-background)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--color-border)", overflow: "hidden" }}>

            <img src="/dashboard-preview.png" alt="Intelligent Dashboard Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

      </main>

      {/* Features Section */}
      <section style={{ padding: "80px 20px", background: "var(--color-surface)", textAlign: "center" }}>

        <h2 style={{ fontSize: "2.5rem", marginBottom: "50px" }}>Why choose TalentForge?</h2>
        
        <div style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap", maxWidth: "1200px", margin: "0 auto" }}>
          
          <FeatureCard 
            icon={<Target size={40} color="var(--color-primary)" />}
            title="Algorithmic Matching"
            desc="Our smart engine matches your skills with the perfect job opportunities instantly."
          />
          <FeatureCard 
            icon={<TrendingUp size={40} color="var(--color-success)" />}
            title="Advanced Analytics"
            desc="Recruiters get powerful insights and candidate tracking with visual dashboards."
          />
          <FeatureCard 
            icon={<Rocket size={40} color="var(--color-warning)" />}
            title="Project Portfolios"
            desc="Showcase your live deployments directly on your profile for recruiters to see."
          />

        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 20px", background: "var(--color-secondary)", color: "white", textAlign: "center" }}>
        <p style={{ margin: 0, opacity: 0.7 }}>&copy; {new Date().getFullYear()} TalentForge. All rights reserved.</p>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card" style={{ flex: "1", minWidth: "250px", maxWidth: "350px", textAlign: "left", padding: "30px", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
    <div style={{ marginBottom: "20px" }}>{icon}</div>
    <h3 style={{ marginBottom: "15px", color: "var(--color-secondary)" }}>{title}</h3>
    <p style={{ margin: 0, color: "var(--color-text-muted)", lineHeight: "1.5" }}>{desc}</p>
  </div>
);

export default Home;