import express from "express";
import mqtt from "mqtt";
import { WebSocket, WebSocketServer } from "ws";
import { spawn } from "child_process";

const app = express();
const port = 3000;

// Menangani koneksi WebSocket
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  const pythonProcess = spawn("python", ["blood_pressure.py"]);
  pythonProcess.stdout.on("result", (result) => {
    console.log("Pesan dari python : ", result.toString());
    // sendToClients(data.toString());
  });

  websocketClients.push(ws);
  ws.on("close", () => {
    websocketClients = websocketClients.filter((client) => client !== ws);
    console.log("WebSocket client disconnected");
  });
});

app.server = app.listen(port, () => {
  console.log(`Server is running`);
});

app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Membuat Koneksi MQTT
const client = mqtt.connect("mqtt://broker.emqx.io:1883");

client.on("connect", () => {
  console.log("Connect to MQTT broker");
  console.log(`Open WebSocket client at ws://localhost:${port}`);
  client.subscribe("blood_pressure/graph", (err) => {
    if (!err) {
      console.log(`Subscribe to topic status graph`);
    }
  });
  client.subscribe("blood_pressure/realtime/status", (err) => {
    if (!err) {
      console.log(`Subscribe to topic status `);
    }
  });
  client.subscribe("blood_pressure/realtime", (err) => {
    if (!err) {
      console.log(`Subscribe to topic realtime`);
    }
  });
  client.subscribe("blood_pressure/realtime/result", (err) => {
    if (!err) {
      console.log(`Subscribe to topic result`);
    }
  });
  client.subscribe("blood_pressure/realtime/end", (err) => {
    if (!err) {
      console.log(`Subscribe to topic end`);
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Pesan di terima di topic ${topic} : ${message.toString()}`);

  if (topic == "blood_pressure/realtime/status") {
    sendToClients(message.toString());
  } else if (topic == "blood_pressure/realtime/end") {
    sendToClients(message.toString());
    websocketClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    websocketClients = [];
    wss.on("disconnection", (ws) => {
      ws.on("close", () => {
        websocketClients = websocketClients.filter((client) => client !== ws);
        console.log("WebSocket client disconnected");
      });
    });
  } else {
    const data = JSON.parse(message.toString());

    console.log(data);

    sendToClients(data);
    websocketClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    websocketClients = [];
    wss.on("disconnection", (ws) => {
      ws.on("close", () => {
        websocketClients = websocketClients.filter((client) => client !== ws);
        console.log("WebSocket client disconnected");
      });
    });
  }
});

// Mengirim data ke klien WebSocket
let websocketClients = [];
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
