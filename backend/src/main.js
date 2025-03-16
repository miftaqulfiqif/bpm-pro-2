import { app, io, server, port } from "./application/app.js";
import { spawn } from "child_process";

const processByUserId = {};
const userId = {};

io.on("connection", (socket) => {
  console.log("Connected to client");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("status", (data) => {
    console.log(`Received data from client ${data.user_id}:`, data);
    io.to(userId).emit("status", data);
  });

  socket.on("start", (userId) => {
    console.log(`Starting process for ${userId}`);

    if (processByUserId[userId]) {
      console.log(`Process already running for ${userId}`);
      return;
    }

    console.log("Python process started....");
    const pythonProcess = spawn("python3", [
      "src/python/blood_pressure.py",
      userId,
    ]);

    console.log(`Pyhton process ID: ${pythonProcess.pid}`);
    processByUserId[userId] = pythonProcess;

    pythonProcess.stdout.on("data", (data) => {
      // data = data.toString();
      // console.log("Data diterima:", data);
      // io.to(userId).emit("data", data.toString());
    });

    pythonProcess.stderr.on("error", (err) => {
      console.error(`Error in process ${userId}:`, err);
      io.to(userId).emit("error", "Process failed");
      delete processByUserId[userId];
    });

    pythonProcess.on("close", () => {
      io.to(userId).emit("done");
      delete processByUserId[userId];
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from client");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
