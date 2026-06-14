import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h1>TalentForge</h1>

        <p>
          Smart Career Platform for Students,
          Recruiters and Professionals
        </p>
      </div>
    </>
  );
}

export default Home;