import express from 'express';
import mqtt from 'mqtt';
import { WebSocket, WebSocketServer } from 'ws';
import {spawn} from "child_process";

const app = express();
const port = 3000;

const wss = new WebSocketServer("wss://backend-bpm-pro-2.vercel.app/api/websocket");

// const pythonProcess = spawn('python', ['blood_pressure_1.py']);
// pythonProcess.stdout.on('data', (data) => {
//     console.log(data.toString());
//     // sendToClients(data.toString());
// })

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

    const pythonProcess = spawn('python', ['blood_pressure_1.py']);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        // sendToClients(data.toString());
    })
    
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
            console.log(`Subscribe to topic status`)
        }
    });

    client.subscribe('blood_pressure/realtime', (err) => {
        if (!err) {
            console.log(`Subscribe to topic realtime`)
        }
    });
});


client.on('message', (topic, message) => {

    console.log(`Receive message: ${topic} = ${message.toString()}`);
    if (topic === 'blood_pressure/realtime/status') {
        sendToClients(message.toString());
    } else {
        sendToClients(message.toJSON());
    }
})

