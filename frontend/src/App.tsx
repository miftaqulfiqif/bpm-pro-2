import { useEffect, useState } from "react";

export default function message() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/send-data"); // Sesuaikan dengan alamat server

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
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
