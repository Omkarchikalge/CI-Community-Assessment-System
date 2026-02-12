import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div style={styles.nav}>
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Community Assessment
      </h3>

      <div>
        {role === "teacher" && (
          <button onClick={() => navigate("/teacher")}>Dashboard</button>
        )}

        {role === "student" && (
          <button onClick={() => navigate("/student")}>Dashboard</button>
        )}

        {role && (
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#111",
    color: "white",
  },
};
