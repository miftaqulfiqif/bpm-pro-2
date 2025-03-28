const mqtt = require("mqtt");

const client = mqtt.connect("ws://localhost:9001");

client.on("connect", () => {
    console.log("Terhubung ke MQTT Websocket");
    client.subscribe("sensor/tekanan_darah", (err) => {
        if (!err){
            console.log("Berhasil Subscribe")
        }
    })
})

client.on("message", (topic, message) => {
    console.log(`Pesan di terima di topic ${topic} : ${message.toString()}`);
})