import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { privateRouter } from "../routes/private-api.js";
import cookieParser from "cookie-parser";

const port = 3000;

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};
const io = new Server(server, {
  cors: { ...corsOptions },
});

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(publicRouter);
app.use(privateRouter);
app.use(errorMiddleware);
app.use("/uploads", express.static("uploads"));

export { app, server, io, port };
