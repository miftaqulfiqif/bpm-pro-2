import mqtt from "mqtt";
import { sendToClients } from "./websocket.js";

const client = mqtt.connect("mqtt://broker.emqx.io:1883");

client.on("connect", () => {
  console.log("Connect to MQTT broker");
  console.log(`Open WebSocket client`);

  client.subscribe("blood_pressure/realtime/status", (err) => {
    if (!err) {
      console.log(`Subscribe to topic status`);
    }
  });

  client.subscribe("blood_pressure/realtime/end", (err) => {
    if (!err) {
      console.log(`Subscribe to topic realtime`);
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Pesan di terima di topic ${topic} : ${message.toString()}`);

  if (topic == "blood_pressure/realtime/status") {
    sendToClients(message.toString());
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

export default { client };
