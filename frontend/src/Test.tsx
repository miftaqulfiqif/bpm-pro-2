import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function Test() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const client = mqtt.connect("mqtt://broker.emqx.io");
    const topic = "blood_pressure/realtime/status";

    client.on("connect", () => {
      console.log("Terhubung ke broker MQTT");
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log("Gagal subscribe ke topik");
        } else {
          console.log("Berhasil subscribe ke topik : ", topic);
        }
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("data yang di terima: ", data);

        setMessage(data.message);
      } catch (error) {
        console.log(error);
      }
    });

    // Cleanup on unmount
    return () => {
      client.end();
    };
  });

  return (
    <div className="Test">
      <h1>Pesan dari MQTT:</h1>
      {message ? (
        <p style={{ color: "red" }}>{message}</p> // Menampilkan pesan dalam warna merah jika error
      ) : (
        <p>Menunggu pesan...</p>
      )}
    </div>
  );
}
