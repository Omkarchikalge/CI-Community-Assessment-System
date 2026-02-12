import { useState } from "react";

export default function QuestionCard({ question, index, onAnswer }) {
  const [selected, setSelected] = useState(null);

  function selectOption(i) {
    setSelected(i);
    onAnswer(index, i);
  }

  return (
    <div style={styles.card}>
      <h4>{index + 1}. {question.question}</h4>
      {question.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              checked={selected === i}
              onChange={() => selectOption(i)}
            />
            {opt}
          </label>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  }
};
