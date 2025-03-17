import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const useCounter = () => {
  const [userId] = useState("user_123");
  const [message, setMessage] = useState("Waiting for data...");
  const [buttonLoading, setButtonLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const stopProcess = () => {
    if (socketRef.current) {
      setButtonLoading(false);
      socketRef.current.emit("stop", userId);
      socketRef.current.disconnect();
      socketRef.current = null;

      if (message === "Pengambilan data selesai.") {
        console.log(message);
        setMessage(message);
      } else {
        console.log("Program berakhir");
        setMessage("Program berakhir");
      }
    }
  };

  const buttonStart = () => {
    if (socketRef.current) {
      console.log("Socket sudah berjalan.");
      return; // Jika socket sudah terhubung, tidak buat socket baru
    }

    setButtonLoading(true);

    try {
      const socket = io("http://localhost:3000");
      socketRef.current = socket;

      socket.emit("join", userId);
      socket.emit("start", userId);

      socket.on("status", (data) => {
        console.log("Data status diterima:", data);
        setMessage(data.data);
      });

      socket.on("realtime", (data) => {
        console.log("Data realtime diterima:", data);
        setMessage(data.data);
      });

      socket.on("result", (data) => {
        console.log("Data result diterima:", data);
        setMessage("Pengambilan data selesai.");
        stopProcess();
      });

      socket.on("done", () => {
        stopProcess();
      });
    } catch (error) {
      alert("Gagal: " + error);
      setButtonLoading(false);
    }
  };

  const buttonStop = () => {
    stopProcess();
  };

  // Efek untuk membersihkan socket ketika komponen unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.off("status");
        socketRef.current.off("realtime");
        socketRef.current.off("result");
        socketRef.current.off("stop");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return {
    message,
    buttonLoading,
    buttonStart,
    buttonStop,
  };
};
