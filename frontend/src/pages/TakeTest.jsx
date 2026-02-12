import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function TakeTest() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTest() {
      try {
        const data = await apiFetch(`/tests/${code}`);
        setQuestions(data.questions.mcqs || []);
      } catch (err) {
        alert("Test not found");
      }
      setLoading(false);
    }

    fetchTest();
  }, [code]);

  function selectAnswer(qIndex, optionIndex) {
    setAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  }

  async function submitTest() {
    try {
      await apiFetch("/tests/submit", {
        method: "POST",
        body: JSON.stringify({
          room_code: code,
          answers: answers
        }),
      });

      alert("Test submitted successfully!");
      navigate("/student");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading test...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Unit Test</h2>

      {questions.map((q, index) => (
        <div key={index} style={styles.card}>
          <h4>{index + 1}. {q.question}</h4>

          {q.options.map((opt, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={answers[index] === i}
                  onChange={() => selectAnswer(index, i)}
                />
                {opt}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={submitTest}>Submit Test</button>
    </div>
  );
}

const styles = {
  card: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  }
};
