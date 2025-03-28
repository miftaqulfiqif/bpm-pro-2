const SerialPort = require('serialport');
const mqtt = require('mqtt');
const { EventEmitter } = require('events');
const moment = require('moment');

// -------------------- KONFIGURASI --------------------

const MQTT_BROKER = "broker.emqx.io";
const MQTT_PORT = 1883;
const MQTT_TOPIC_REALTIME = "blood_pressure/realtime";
const MQTT_TOPIC_RESULT = "blood_pressure/result";
const MQTT_TOPIC_GRAPH = "blood_pressure/graph";
const MQTT_CLIENT_ID = `bp_monitor_${moment().format('YYYYMMDDHHmmss')}`;

const START_BYTE = 0x5A;
const PARAM_TYPE_BP = 0xF2;
const PACKET_ID_REALTIME = 0x28;
const PACKET_ID_RESULT = 0x22;
const BAUD_RATE = 19200;
const REALTIME_TIMEOUT = 5; // in seconds

// -------------------- VARIABEL GLOBAL --------------------

let mqttClient = null; // Klien MQTT global
let portQueue = []; // Queue untuk port yang valid
let restartDetection = new EventEmitter(); // Event untuk restart loop pembacaan
let inRealtimeMode = false; // Flag apakah sedang dalam mode realtime
let lastRealtimeData = 0; // Timestamp data realtime terakhir

// -------------------- MQTT CALLBACK --------------------

function onConnect() {
  console.log(`Terhubung ke broker MQTT: ${MQTT_BROKER}:${MQTT_PORT}`);
}

function onPublish() {
  // Callback publish (bisa diisi jika diperlukan)
}

// -------------------- DETEKSI PORT --------------------

async function detectPort(portName) {
  const port = new SerialPort(portName, { baudRate: BAUD_RATE, autoOpen: false });
  console.log(`Mencoba port: ${portName}`);
  
  try {
    await port.open();
    let startTime = Date.now();
    let foundStartByte = false;
    
    port.on('data', (data) => {
      if (Date.now() - startTime > 2000) return; // Timeout 2 detik
      if (data[0] === START_BYTE) {
        console.log(`Port ${portName} mendeteksi byte 0x5A.`);
        foundStartByte = true;
        portQueue.push(port); // Masukkan port ke queue
        restartDetection.emit('stop'); // Hentikan thread lain
      }
    });

    // Tunggu hingga data diterima atau waktu habis
    await new Promise(resolve => {
      port.on('open', () => {
        setTimeout(() => resolve(foundStartByte), 2000);
      });
    });

    if (!foundStartByte) {
      port.close();
      return null;
    }

    return port;
  } catch (error) {
    console.error(`Gagal membuka port ${portName}: ${error.message}`);
    return null;
  }
}

async function selectSerialPort() {
  while (true) {
    const ports = await SerialPort.list();
    if (!ports.length) {
      console.log('Tidak ada port serial yang ditemukan. Coba lagi dalam 1 detik...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }

    console.log(`Mendeteksi port secara paralel dari ${ports.length} port tersedia...`);

    const portPromises = ports.map(port => detectPort(port.path));

    const results = await Promise.all(portPromises);
    const validPort = results.find(port => port !== null);

    if (validPort) {
      return validPort;
    }

    console.log('Tidak ada port yang mendeteksi byte 0x5A. Mencoba lagi...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// -------------------- PEMROSESAN PAKET --------------------

function parsePacket(dataBytes) {
  if (dataBytes[0] !== START_BYTE) {
    console.log(`Paket tidak valid: Tanda mulai salah`);
    return null;
  }

  const length = dataBytes[1];
  const packetId = dataBytes[2];
  const paramType = dataBytes[3];

  if (paramType !== PARAM_TYPE_BP) {
    console.log(`Tipe parameter tidak didukung: ${paramType.toString(16)}`);
    return null;
  }

  if (packetId === PACKET_ID_REALTIME && length >= 0x08) {
    const pressure = dataBytes.readUInt16BE(4);

    // Update status realtime
    inRealtimeMode = true;
    lastRealtimeData = Date.now();

    // Publish data realtime lengkap
    const data = {
      type: "realtime",
      pressure: pressure,
      unit: "mmHg",
      timestamp: moment().toISOString(),
    };
    mqttClient.publish(MQTT_TOPIC_REALTIME, JSON.stringify(data));
    // Publish data untuk grafik (hanya nilai tekanan)
    mqttClient.publish(MQTT_TOPIC_GRAPH, pressure.toString());

    return `Tekanan Real-Time: ${pressure} mmHg`;
  }

  if (packetId === PACKET_ID_RESULT && length >= 0x14) {
    // Paket hasil pengukuran
    inRealtimeMode = false;
    const systolic = dataBytes.readUInt16BE(4);
    const diastolic = dataBytes.readUInt16BE(6);
    const mean = dataBytes.readUInt16BE(8);
    const heartRate = dataBytes.readUInt16BE(10);
    const year = dataBytes.readUInt16BE(12);
    const month = dataBytes[14];
    const day = dataBytes[15];
    const hour = dataBytes[16];
    const minute = dataBytes[17];

    const measurementTime = moment({ year, month: month - 1, day, hour, minute });

    const timestamp = measurementTime.toISOString();
    const data = {
      type: "measurement",
      systolic,
      diastolic,
      mean,
      heartRate,
      unit: "mmHg",
      timestamp,
    };
    mqttClient.publish(MQTT_TOPIC_RESULT, JSON.stringify(data));

    // Setelah mendapatkan hasil lengkap, set restart detection
    restartDetection.emit('restart');

    return `
      Hasil Pengukuran:
      Sistolik: ${systolic} mmHg
      Diastolik: ${diastolic} mmHg
      Tekanan Rata-rata: ${mean} mmHg
      Detak Jantung: ${heartRate} bpm
      Waktu: ${measurementTime.format('DD/MM/YYYY HH:mm')}
    `;
  }

  return null;
}

// -------------------- PEMBACAAN DATA SERIAL --------------------

async function readSerialData(port) {
  console.log(`Terhubung ke ${port.path} pada ${BAUD_RATE} bps`);
  console.log('Menunggu data dari alat pengukur tekanan darah...');

  const buffer = [];

  port.on('data', (data) => {
    buffer.push(...data);
    if (buffer.length >= 20) { // assuming a packet length of at least 20 bytes
      const result = parsePacket(Buffer.from(buffer));
      if (result) {
        console.log(result);
      }
      buffer.length = 0; // Clear buffer after processing
    }
  });

  port.on('error', (err) => {
    console.log(`Error saat membaca port: ${err.message}`);
  });

  return new Promise((resolve, reject) => {
    restartDetection.once('restart', () => resolve());
    restartDetection.once('stop', () => resolve());
  });
}

// -------------------- LOOP UTAMA --------------------

async function captureSerialData() {
  try {
    // Setup MQTT client
    mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`, { clientId: MQTT_CLIENT_ID });
    mqttClient.on('connect', onConnect);
    mqttClient.on('publish', onPublish);

    console.log(`Topik Real-Time: ${MQTT_TOPIC_REALTIME}`);
    console.log(`Topik Hasil: ${MQTT_TOPIC_RESULT}`);
    console.log(`Topik Grafik: ${MQTT_TOPIC_GRAPH}`);
    console.log(`Emergency stop akan terjadi jika tidak ada data selama ${REALTIME_TIMEOUT} detik dalam mode realtime`);

    // Loop utama: Pilih port dan baca data
    while (true) {
      console.log("\n--- Memulai deteksi port serial baru ---");
      const port = await selectSerialPort();
      if (!port) {
        console.log('Tidak dapat menemukan port yang valid. Mencoba lagi dalam 5 detik...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }

      // Baca data dari port hingga selesai atau terjadi error
      await readSerialData(port);

      // Tutup port serial sebelum restart
      if (port.isOpen) {
        port.close();
        console.log(`Port serial ${port.path} ditutup.`);
      }
    }
  } catch (error) {
    console.error(`Error tidak terduga: ${error.message}`);
  } finally {
    if (mqttClient) {
      mqttClient.end();
      console.log('Koneksi MQTT ditutup.');
    }
  }
}

captureSerialData();