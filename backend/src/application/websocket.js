import { WebSocket, WebSocketServer } from "ws";
import { spawn } from "child_process";
import { wss } from "./app.js";

let websocketClients = [];

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  const pythonProcess = spawn("python3", ["src/python/blood_pressure.py"]);
  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
    // sendToClients(data.toString());
  });

  websocketClients.push(ws);

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  ws.on("close", () => {
    websocketClients = websocketClients.filter((client) => client !== ws);
    console.log("WebSocket client disconnected");
    pythonProcess.kill();
  });
});

const sendToClients = (data) => {
  if (typeof data === "string") {
    websocketClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  } else {
    websocketClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
};

export { wss, sendToClients };
