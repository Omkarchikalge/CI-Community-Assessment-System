import { useParams } from "react-router-dom";

export default function Analytics() {
  const { code } = useParams();

  return (
    <div className="container">
      <h2>Analytics for {code}</h2>
      <p>Total submissions: 10</p>
    </div>
  );
}
