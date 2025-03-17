import { spawn } from "child_process";

class PythonProcessManager {
  constructor() {
    this.processByUserId = {};
  }

  startProcess(userId) {
    if (this.processByUserId[userId]) {
      console.log(`Process already running for ${userId}`);
      return;
    }

    console.log(`Starting Python process for user ${userId}`);
    const pythonProcess = spawn("python3", [
      "src/python/blood_pressure.py",
      userId,
    ]);

    this.processByUserId[userId] = pythonProcess;

    pythonProcess.stdout.on("data", (data) => {
      console.log("Data from Python:", data.toString());
    });

    pythonProcess.stderr.on("error", (err) => {
      console.error(`Error in process for ${userId}:`, err);
    });

    pythonProcess.on("close", () => {
      console.log(`Python process for user ${userId} finished`);
      delete this.processByUserId[userId];
    });
  }

  stopProcess(userId) {
    if (this.processByUserId[userId]) {
      console.log(`Stopping Python process for user ${userId}`);
      this.processByUserId[userId].kill();
      delete this.processByUserId[userId];
    }
  }

  stopAllProcesses() {
    Object.keys(this.processByUserId).forEach((userId) => {
      this.stopProcess(userId);
    });
  }
}

export default PythonProcessManager;
