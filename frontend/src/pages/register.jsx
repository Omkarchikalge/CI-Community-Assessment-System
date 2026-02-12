import { useState } from "react";
import { apiFetch } from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        role, // "teacher" or "student"
      }),
    });

    setLoading(false);

    if (res.message) {
      alert("Registration successful! Please login.");
      window.location.href = "/";
    } else {
      alert(res.error || "Registration failed");
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <a href="/">Login</a>
      </p>
    </div>
  );
}
