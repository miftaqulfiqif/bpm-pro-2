import { spawn } from "child_process";
import { WebSocket, WebSocketServer } from "ws";
import express from "express";
import cors from "cors"; //library untuk frontend agar dapat mengakses api

const app = express();
app.use(cors());

const server = app.listen(3000, () => {
  console.log("Server is running");
});

const wss = new WebSocketServer({ server });

// Ketika frontend terhubung ke WebSocket
wss.on("connection", (ws) => {
  console.log("Frontend terhubung ke WebSocket");

  ws.on("message", (message) => {
    console.log(`Pesan dari frontend: ${message.toString()}`);
  });

  ws.on("close", () => {
    console.log("Frontend terputus dari WebSocket");
  });
});

// Fungsi untuk mengirim data dari Python ke frontend
function broadcastToClients(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Endpoint untuk menerima data dari Python
app.post("/send-data", express.json(), (req, res) => {
  const data = req.body;
  console.log("Data dari Python:", data);

  // Kirim ke semua client WebSocket (frontend)
  broadcastToClients(data);

  res.json({ status: "OK" });
});

const pythonProcess = spawn("python3", ["test.py"]);
pythonProcess.stdout.on("data", (data) => {
  console.log(typeof data);
  console.log(data.toString());
});
