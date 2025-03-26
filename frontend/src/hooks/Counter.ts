import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export const useCounter = () => {
  const [userId, setUserId] = useState("default_user_id");
  const [message, setMessage] = useState("Waiting for data...");
  const [items, setItems] = useState<{ id: number; value: number }[]>([]);
  const [result, setResult] = useState({
    systolic: 0,
    diastolic: 0,
    mean: 0,
    heart_rate: 0,
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem("token");

  const [start, setStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        // console.log("Program berakhir");
        setMessage("Program berakhir");
      }
    }
    setIsOpen(true);
  };

  const buttonStart = async () => {
    setStart(true);
    // Fungsi untuk ambil user id
    // const userId = await axios
    //   .get("http://localhost:3000/api/user/current", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     return response.data.data.username;
    //   })
    //   .catch(() => {
    //     setMessage("Anda belum login. Silahkan login terlebih dahulu.");
    //   });

    // setUserId(userId);

    console.log(message);
    // Jika socket sudah terhubung, tidak buat socket baru
    if (socketRef.current) {
      console.log("Socket sudah berjalan.");
      return;
    }

    setButtonLoading(true);

    try {
      const socket = io("http://localhost:3000");
      socketRef.current = socket;

      socket.emit("join", userId);
      socket.emit("start", userId);

      socket.on("status", (data) => {
        setMessage(data.data);
      });

      socket.on("start_realtime", (data) => {
        setStart(false);
      });

      socket.on("realtime", (data) => {
        setMessage(data.data);
      });

      socket.on("heart_rate_rps", (data) => {
        setItems((prevItems) => [
          ...prevItems,
          {
            id: prevItems.length,
            value: data.data,
          },
        ]);
      });

      socket.on("result", (data) => {
        setMessage("Pengambilan data selesai.");
        setResult(data.data_measure);

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
        socketRef.current.off("heart_rate_rps");
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
    open,
    start,
    setStart,
    isOpen,
    setIsOpen,
    result,
    setResult,
    items,
  };
};
