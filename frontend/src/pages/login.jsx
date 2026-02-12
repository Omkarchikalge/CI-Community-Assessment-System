import { useState } from "react";
import { apiFetch } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);

      if (res.role === "teacher") {
        window.location.href = "/teacher";
      } else {
        window.location.href = "/student";
      }

    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
