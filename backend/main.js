import express from 'express';
import mqtt from 'mqtt';
import { WebSocket, WebSocketServer } from 'ws';

const app = express();
const port = 3000;

const wss = new WebSocketServer({noServer: true});

let websocketClients = [];

const sendToClients = (data) => {
    websocketClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN){
            client.send(data);
        }
    });
}

// Menangani koneksi WebSocket
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    websocketClients.push(ws);
  
    ws.on('close', () => {
      websocketClients = websocketClients.filter(client => client !== ws);
      console.log('WebSocket client disconnected');
    });
});

app.server = app.listen(port, () => {
    console.log(`Server is running`)
})

app.server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request)      
    });
})

const client = mqtt.connect('mqtt://broker.emqx.io:1883');

client.on('connect', () => {
    console.log("Connect to MQTT broker");
    console.log(`Open WebSocket client at ws://localhost:${port}`);
    client.subscribe('blood_pressure/realtime/status', (err) => {
        if (!err) {
            console.log(`Subscribe to topic`)
        }
    });
});


client.on('message', (topic, message) => {
    console.log(`Receive message: ${topic} = ${message.toString()}`);
    sendToClients(message.toString());
})
