import { useEffect, useState } from "react";

export default function Timer({ durationMinutes, onTimeout }) {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h3>
      Time Left: {Math.floor(seconds / 60)}:
      {String(seconds % 60).padStart(2, "0")}
    </h3>
  );
}
