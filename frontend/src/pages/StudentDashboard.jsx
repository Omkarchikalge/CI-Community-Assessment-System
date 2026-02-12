import { useState } from "react";

export default function StudentDashboard() {
  const [code, setCode] = useState("");

  function joinRoom() {
    window.location.href = `/room/${code}`;
  }

  return (
    <div className="container">
      <h2>Join Room</h2>
      <input placeholder="Room Code" onChange={e => setCode(e.target.value)} />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
}
