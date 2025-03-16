import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const userId = "user_123";

const Test = () => {
  const [message, setMessage] = useState("Waiting for data...");

  useEffect(() => {
    socket.emit("start", userId);

    socket.on("data", (data) => {
      console.log("Data diterima:", data);
      setMessage(data);
    });

    socket.on("done", () => {
      console.log("Pengambilan data selesai.");
    });

    return () => {
      socket.off("data");
      socket.off("done");
    };
  }, []);

  const startFetching = () => {
    socket.emit("join", userId);
    socket.emit("start", userId);
  };

  return (
    <div>
      <p>Live Sensor Data</p>
      <p>Message from WebSocket:</p>
      <p>{message}</p>
      <button onClick={startFetching}>Start</button>
    </div>
  );
};

export default Test;
