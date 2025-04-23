import { Patients } from "@/models/Patients";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { NumberDomain } from "recharts/types/util/types";
import { io, Socket } from "socket.io-client";

type CategoryResult = {
  name: string;
  color: string;
};

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
  const [categoryResult, setCategoryResult] = useState<CategoryResult>();
  const [categoryColor, setCategoryColor] = useState("");
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
        console.log("Program berakhir");
        setMessage("Program berakhir");
      }
    }
    setIsOpen(true);
  };

  const calculationgCategoryResult = async (
    systolic: number,
    diastolic: number,
    patient_date_of_birth: string,
    patient_gender: string
  ) => {
    await axios
      .post(
        "http://localhost:3000/api/measurement-result",
        {
          systolic: systolic,
          diastolic: diastolic,
          patient_date_of_birth: patient_date_of_birth,
          patient_gender: patient_gender,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.data);
        setCategoryResult(res.data.data);
        return res;
      });
  };

  const clearResult = () => {
    setResult({
      systolic: 0,
      diastolic: 0,
      mean: 0,
      heart_rate: 0,
    });
    setCategoryResult({
      color: "",
      name: "",
    });
    setButtonLoading(false);
  };

  const buttonStart = (patient: Patients) => {
    setTimeout(() => {
      setButtonLoading(false);
      const data = {
        patient_date_of_birth: patient.date_of_birth,
        patient_gender: patient.gender,
        data_measure: {
          systolic: 129,
          diastolic: 80,
          mean: 23,
          heart_rate: 20,
        },
      };
      setItems([
        { id: 1, value: 120 },
        { id: 2, value: 130 },
        { id: 3, value: 68 },
        { id: 4, value: 123 },
        { id: 5, value: 80 },
        { id: 6, value: 20 },
        { id: 7, value: 200 },
        { id: 8, value: 123 },
        { id: 9, value: 80 },
        { id: 10, value: 20 },
        { id: 11, value: 200 },
      ]);
      calculationgCategoryResult(
        data.data_measure.systolic,
        data.data_measure.diastolic,
        data.patient_date_of_birth,
        data.patient_gender
      );
      setResult(data.data_measure);
    }, 5000);
    setButtonLoading(true);
  };

  const buttonStartTry = async () => {
    setStart(true);
    const userId = await axios
      .get("http://localhost:3000/api/user/current", {
        withCredentials: true,
      })
      .then((response) => {
        return response.data.data.username;
      });

    setUserId(userId);

    console.log(message);
    if (socketRef.current) {
      console.log("Socket already running.");
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
        setMessage("Catching data done.");
        setResult(data.data_measure);
        calculationgCategoryResult(
          data.data_measure.systolic,
          data.data_measure.diastolic,
          data.patient_date_of_birth,
          data.patient_gender
        );
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
    console.log("Program berakhir");
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
    categoryResult,
    categoryColor,
    clearResult,
    items,
    token,
  };
};
