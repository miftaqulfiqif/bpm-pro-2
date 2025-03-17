import { io } from "./app.js";
import PythonProcessManager from "./python-process.js";
import { prismaClient } from "./database.js";

class SocketHandler {
  constructor() {
    this.pythonProcessManager = new PythonProcessManager();
  }

  handleConnection(socket) {
    console.log("Connected to client");

    socket.on("join", (userId) => this.joinRoom(socket, userId));
    socket.on("status", (data) => this.handleStatus(socket, data));
    socket.on("realtime", (data) => this.handleRealtime(socket, data));
    socket.on("result", (data) => this.handleResult(socket, data));
    socket.on("start", (userId) => this.startProcess(socket, userId));
    socket.on("stop", (userId) => this.stopProcess(socket, userId));
    socket.on("done", (data) => this.handleDoneProcess(socket, data));
    socket.on("disconnect", () => this.handleDisconnect());
  }

  joinRoom(socket, userId) {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  }

  handleStatus(socket, data) {
    console.log(`Received status from client ${data.user_id}:`, data);
    io.to(data.user_id).emit("status", data);
  }

  handleRealtime(socket, data) {
    console.log(`Received realtime data from client ${data.user_id}:`, data);
    io.to(data.user_id).emit("realtime", data);
  }

  handleResult(socket, data) {
    console.log(`Received result from client ${data.user_id}:`, data);
    io.to(data.user_id).emit("result", data);

    // Simpan hasil pengukuran ke database
    const resultData = {
      user_id: data.user_id,
      systolic: data.data_measure.systolic,
      diastolic: data.data_measure.diastolic,
      mean: data.data_measure.mean,
      heart_rate: data.data_measure.heartRate,
      timestamp: data.data_measure.timestamp,
    };

    prismaClient.user
      .upsert({
        where: {
          user_id: data.user_id,
        },
        update: resultData,
        create: resultData,
      })
      .then(() => {
        console.log(`Result data for ${data.user_id} saved successfully.`);
      })
      .catch((error) => {
        console.error(`Error saving result data for ${data.user_id}:`, error);
      });
  }

  startProcess(socket, userId) {
    console.log(`Starting process for ${userId}`);
    this.pythonProcessManager.startProcess(userId);
  }

  handleDoneProcess(socket, data) {
    console.log(`Process for ${data.user_id} is done`);
    io.to(data.user_id).emit("done", "Program berakhir");
  }
  stopProcess(socket, userId) {
    console.log(`Stopping process for ${userId}`);
    this.pythonProcessManager.stopProcess(userId);
  }

  handleDisconnect() {
    console.log("Disconnected from client");
    this.pythonProcessManager.stopAllProcesses();
  }
}

export default SocketHandler;
