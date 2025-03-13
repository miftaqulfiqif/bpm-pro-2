import { useEffect, useState } from "react";

export default function message() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      console.log("Received message:",typeof event.data);
      const data = event.data;
      setMessage(data);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>Live Sensor Data</h1>
      {message ? <p>Message: {message}</p> : <p>Waiting for data...</p>}
    </div>
  );
}