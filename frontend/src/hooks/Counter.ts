import { useState, useRef } from "react";

export const useCounter = () => {
  const [message, setMessage] = useState("Waiting for data...");
  const [buttonLoading, setButtonLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const buttonStart = () => {
    if (wsRef.current) {
      console.log("WebSocket sudah berjalan.");
      return;
    }

    setButtonLoading(true); // Set loading sebelum mulai koneksi

    try {
      const ws = new WebSocket("ws://localhost:3000");

      ws.onopen = () => {
        console.log("Connected to WebSocket");
      };

      ws.onmessage = (event) => {
        console.log("Received:", event.data);
        setMessage(event.data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setButtonLoading(false); // Set false jika terjadi error
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setButtonLoading(false); // Set false jika koneksi ditutup
        wsRef.current = null;
      };

      wsRef.current = ws;
    } catch (error) {
      alert("Gagal :" + error);
      setButtonLoading(false);
    }
  };

  return {
    message,
    buttonLoading,
    buttonStart,
  };
};
