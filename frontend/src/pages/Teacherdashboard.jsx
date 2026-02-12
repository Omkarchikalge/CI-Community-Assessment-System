import { apiFetch } from "../services/api";
import { useState } from "react";

export default function TeacherDashboard() {
  const [roomCode, setRoomCode] = useState(null);
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [generatedTest, setGeneratedTest] = useState(null); // 👈 NEW

  async function createRoom() {
    const res = await apiFetch("/rooms/create", {
      method: "POST",
      body: JSON.stringify({
        subject: "DBMS",
        unit: "Unit 1",
      }),
    });

    setRoomCode(res.room_code);
  }

  async function generateTest() {
    if (!file || !roomCode) {
      alert("Create room and select PDF first");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `http://localhost:8000/tests/generate?room_code=${roomCode}&duration_minutes=${duration}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Test Generated Successfully!");
      setGeneratedTest(data.questions); // 👈 SAVE QUESTIONS
    } else {
      alert(data.detail || "Error generating test");
    }
  }

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Teacher Dashboard</h2>

      <button onClick={createRoom}>Create Room</button>

      {roomCode && (
        <>
          <p><strong>Room Code:</strong> {roomCode}</p>

          <hr />

          <h3>Generate Unit Test from PDF</h3>

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <br /><br />

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br /><br />

          <button onClick={generateTest}>
            {loading ? "Generating..." : "Generate Test"}
          </button>
        </>
      )}

      {/* 👇 PREVIEW SECTION */}
      {generatedTest && (
        <div style={{ marginTop: "40px" }}>
          <h3>Generated MCQs Preview</h3>

          {generatedTest.mcqs?.map((q, index) => (
            <div key={index} style={styles.card}>
              <p><strong>{index + 1}. {q.question}</strong></p>

              {q.options.map((opt, i) => (
                <p key={i}>
                  {String.fromCharCode(65 + i)}. {opt}
                </p>
              ))}

              <p style={{ color: "green" }}>
                Correct Answer: {String.fromCharCode(65 + q.answer)}
              </p>
            </div>
          ))}

          <hr />

          <h3>Flashcards Preview</h3>

          {generatedTest.flashcards?.map((card, index) => (
            <div key={index} style={styles.card}>
              <p><strong>Front:</strong> {card.front}</p>
              <p><strong>Back:</strong> {card.back}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};
