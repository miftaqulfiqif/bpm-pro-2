import { useEffect, useState } from "react";

export default function message() {
  const [message, setMessage] = useState(null);
  const [button, setButton] = useState(false)

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:3000");

  //   ws.onmessage = (event) => {
  //     console.log(typeof event.data);
  //     const data = event.data;
  //     setMessage(data);
  //   };

  //   return () => ws.close();
  // }, []);

  const start = () => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      console.log(typeof event.data);
      const data = event.data;
      setMessage(data);
    };
    return () => ws.close();
  }

  return (
    <div>
      <h1>Live Sensor Data</h1>
      <p>Message from WebSocket: </p>
      {message ? <p>{message}</p> : <p>Waiting for data...</p>}
      <button  disabled={button} onClick={start}>Start</button>
    </div>
  );
}