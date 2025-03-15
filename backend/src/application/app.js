import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = 3000;

app.use(express.json());
app.use(cors());

export { app, wss, server, port };
