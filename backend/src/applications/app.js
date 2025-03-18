import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { privateRouter } from "../routes/private-api.js";

const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
app.use(publicRouter);
app.use(privateRouter);
app.use(errorMiddleware);

export { app, server, io, port };
