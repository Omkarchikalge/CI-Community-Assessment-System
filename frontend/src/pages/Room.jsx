import { useParams } from "react-router-dom";

export default function Room() {
  const { code } = useParams();

  return (
    <div className="container">
      <h2>Room: {code}</h2>
      <p>Waiting for test...</p>
      <button onClick={() => window.location.href = `/test/${code}`}>
        Start Test
      </button>
    </div>
  );
}
