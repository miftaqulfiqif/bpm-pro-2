import { useState, useRef } from "react";

export const useCounter = () => {
  const [message, setMessage] = useState("Waiting for data...");
  const [buttonLoading, setButtonLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const buttonStart = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setButtonLoading(false);
      setMessage("Waiting for data...");
    } else {
      setButtonLoading(true);

      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        console.log("Connected to WebSocket");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received:", data);
          setMessage(data);
        } catch (error) {
          console.log("Received:", event.data);
          setMessage(event.data);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setButtonLoading(false);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setButtonLoading(false);
      };

      wsRef.current = ws;
    }
  };

  return {
    message,
    buttonLoading,
    buttonStart,
  };
};
