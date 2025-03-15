import mqtt from "./application/mqtt.js";
import { app, wss, port } from "./application/app.js";

app.server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
