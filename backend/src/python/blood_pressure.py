# PEMILIHAN PORT SECARA OTOMATIS, PENGULANGAN KETIKA PENGUKURAN SUDAH SELESAI, GRAFIK MQTT, STOP JIKA SELAMA REAL TIME TIDAK ADA RESPON 5 DETIK KEMBALI LOOPING.
import serial
import time
import json
from datetime import datetime
import serial.tools.list_ports
import threading
import queue
import socketio
import sys

# -------------------- KONFIGURASI --------------------

# Konfigurasi Socket.IO
sio = socketio.Client()
sio.connect("http://localhost:3000")

user_id = sys.argv[1] if len(sys.argv) > 1 else "default_user"

def send_data(event, message):
    try:
        receive = { "user_id": user_id, "data": message }
        sio.emit(event, receive)
    except Exception as e:
        print(f"Error sending data for event {event}: {e}")

def send_data_result(data):
    print(f"result : {data}")
    try:
        result = {
            "user_id": user_id,
            "data_measure": {
                "systolic": data["systolic"],
                "diastolic": data["diastolic"],
                "mean": data["mean"],
                "heart_rate": data["heart_rate"],
            } 
        }
        sio.emit("result", result)
    except Exception as e:
        print(f"Error sending data : {e}")

def send_done_event(user_id):
    try:
        sio.emit("done", {
            "user_id": user_id
        })
    except Exception as e:
        print(f"Error sending data : {e}")

# Konstanta protokol
START_BYTE = 0x5A
PARAM_TYPE_BP = 0xF2
PACKET_ID_REALTIME = 0x28
PACKET_ID_RESULT = 0x22
BAUD_RATE = 19200

# Timeout untuk mode realtime (dalam detik)
REALTIME_TIMEOUT = 5

# -------------------- VARIABEL GLOBAL --------------------

port_queue = queue.Queue()          # Queue untuk port yang valid
restart_detection = threading.Event()  # Event untuk restart loop pembacaan
in_realtime_mode = False           # Flag apakah sedang dalam mode realtime
last_realtime_data = 0             # Timestamp data realtime terakhir

# -------------------- DETEKSI PORT --------------------

def detect_port(port_name, result_queue, stop_event):
    """
    Mencoba membuka port dan membaca selama 2 detik untuk mendeteksi byte START_BYTE.
    Jika ditemukan, objek serial disimpan di queue dan stop_event diset.
    """
    try:
        ser = serial.Serial(port_name, BAUD_RATE, timeout=1)
        print(f"Mencoba port: {port_name}")
        start_time = time.time()
        while time.time() - start_time < 2 and not stop_event.is_set():
            data = ser.read(1)
            if data and data[0] == START_BYTE:
                print(f"Port {port_name} mendeteksi byte 0x5A.")
                result_queue.put(ser)
                stop_event.set()  # Hentikan thread lain
                return
        ser.close()
    except serial.SerialException as e:
        print(f"Gagal membuka port {port_name}: {e}")

def select_serial_port():
    """
    Melakukan pendeteksian port secara paralel untuk menemukan port yang mengirimkan byte START_BYTE.
    Jika tidak ditemukan, akan mengulang setelah jeda 1 detik.
    """
    attempts = 0
    max_attempts = 10

    # while attempts < max_attempts:
    while True:
        ports = list(serial.tools.list_ports.comports())    
        if not ports:
            print(f"Tidak ada port serial yang ditemukan. Coba lagi dalam 1 detik...")
            time.sleep(1)
            attempts += 1
            continue

            if attempts == max_attempts:
                print("Tidak ada port serial yang ditemukan. Ulangi beberapa saat lagi.")
                # mqtt_client.publish(f"{MQTT_TOPIC_REALTIME}/status",f"Tidak ada port serial yang ditemukan. Ulangi beberapa saat lagi.")
                return None
            continue
        
        print(f"Mendeteksi port secara paralel dari {len(ports)} port tersedia...")
        stop_event = threading.Event()

        # Kosongkan queue dari iterasi sebelumnya
        while not port_queue.empty():
            port_queue.get_nowait()
        
        threads = []
        for port in ports:
            thread = threading.Thread(target=detect_port, args=(port.device, port_queue, stop_event))
            thread.daemon = True
            threads.append(thread)
            thread.start()
        
        # Tunggu maksimum 3 detik hingga salah satu thread menemukan START_BYTE
        start_time = time.time()
        while time.time() - start_time < 3 and not stop_event.is_set():
            time.sleep(0.1)
        
        stop_event.set()
        try:
            ser = port_queue.get_nowait()
            return ser
        except queue.Empty:
            print(f"Tidak ada port yang mendeteksi byte 0x5A. Mencoba lagi...")
            for thread in threads:
                thread.join()
            time.sleep(1)


        print(f"Tidak ada port yang mendeteksi byte 0x5A dalam {max_attempts} percobaan.")

# -------------------- PEMROSESAN PAKET --------------------
def parse_packet(data_bytes):
    """
    Mengonversi paket data menjadi informasi pengukuran.
    Jika paket adalah realtime, perbarui timestamp dan publish ke MQTT.
    Jika paket adalah hasil pengukuran, publish hasil dan set restart_detection.
    """
    global in_realtime_mode, last_realtime_data

    try:
        if data_bytes[0] != START_BYTE:
            print(f"Paket tidak valid: Tanda mulai salah")
            return None

        length = data_bytes[1]
        packet_id = data_bytes[2]
        param_type = data_bytes[3]

        if param_type != PARAM_TYPE_BP:
            print(f"Tipe parameter tidak didukung: {hex(param_type)}")
            return None

        if packet_id == PACKET_ID_REALTIME and length >= 0x08:
            pressure = int.from_bytes(data_bytes[4:6], byteorder='big')

            # Update status realtime
            in_realtime_mode = True
            last_realtime_data = time.time()

            # Publish data realtime lengkap
            data = {
                "type": "realtime",
                "pressure": pressure,
                "unit": "mmHg",
                "timestamp": int(time.time())
            }
            
            send_data("realtime", f"Tekanan Real-Time: {pressure} mmHg")

            return f"Tekanan Real-Time: {pressure} mmHg"

        elif packet_id == PACKET_ID_RESULT and length >= 0x14:
            # Paket hasil pengukuran
            in_realtime_mode = False
            systolic = int.from_bytes(data_bytes[4:6], byteorder='big')
            diastolic = int.from_bytes(data_bytes[6:8], byteorder='big')
            mean = int.from_bytes(data_bytes[8:10], byteorder='big')
            heart_rate = int.from_bytes(data_bytes[10:12], byteorder='big')
            year = int.from_bytes(data_bytes[12:14], byteorder='big')
            month = data_bytes[14]
            day = data_bytes[15]
            hour = data_bytes[16]
            minute = data_bytes[17]

            try:
                measurement_time = datetime(year, month, day, hour, minute)
            except ValueError:
                print(f"Format waktu tidak valid: {year}-{month}-{day} {hour}:{minute}")
                measurement_time = datetime.now()

            timestamp = measurement_time.isoformat()
            data = {
                "type": "measurement",
                "systolic": systolic,
                "diastolic": diastolic,
                "mean": mean,
                "heart_rate": heart_rate,
                "unit": "mmHg",
                "timestamp": timestamp
            }
            send_data_result(data)
            # mqtt_client.publish(MQTT_TOPIC_RESULT, json.dumps(data))

            # Setelah mendapatkan hasil lengkap, set restart detection
            restart_detection.set()

            result = (f"  Hasil Pengukuran:\n"
                      f"  Sistolik: {systolic} mmHg\n"
                      f"  Diastolik: {diastolic} mmHg\n"
                      f"  Tekanan Rata-rata: {mean} mmHg\n"
                      f"  Detak Jantung: {heart_rate} bpm\n"
                      f"  Waktu: {day:02d}/{month:02d}/{year} {hour:02d}:{minute:02d}\n")
           
            return result

        else:
            print(f"Paket tidak dikenali: ID={hex(packet_id)}, Panjang={hex(length)}")
            return None

    except IndexError:
        print(f"Data paket terlalu pendek: {data_bytes.hex().upper()}")
        return None
    except Exception as e:
        print(f"Error saat memproses paket: {e}")
        return None

# -------------------- PEMBACAAN DATA SERIAL --------------------

def find_start_byte(ser):
    """
    Membaca byte per byte hingga menemukan START_BYTE.
    Jika gagal (timeout atau error), kembalikan None.
    """
    while True:
        try:
            start_byte = ser.read(1)
            if not start_byte:
                return None
            if start_byte[0] == START_BYTE:
                return start_byte
        except serial.SerialException:
            print(f"Error saat membaca port. Port mungkin terputus.")
            return None

def check_realtime_timeout():
    """
    Jika dalam mode realtime dan tidak ada data selama REALTIME_TIMEOUT detik,
    kembalikan True dan set restart_detection.
    """
    global in_realtime_mode
    if in_realtime_mode and (time.time() - last_realtime_data > REALTIME_TIMEOUT):
        print(f"EMERGENCY STOP: Tidak ada data realtime selama {REALTIME_TIMEOUT} detik!")
        in_realtime_mode = False
        restart_detection.set()
        return True
    return False

def read_serial_data(ser):
    """
    Membaca data dari port serial selama belum ada sinyal restart_detection.
    Jika timeout atau paket lengkap (hasil measurement) diterima, loop berhenti.
    """
    global in_realtime_mode, last_realtime_data

    print(f"Terhubung ke {ser.port} pada {BAUD_RATE} bps")
    print(f"Menunggu data dari alat pengukur tekanan darah...")

    send_data("status", "Terhubung ke alat pengukur tekanan darah silahkan menunggu data dari alat pengukur tekanan darah")
    
    restart_detection.clear()
    in_realtime_mode = False
    last_realtime_data = time.time()

    # Loop membaca data
    while not restart_detection.is_set():
        # Cek timeout realtime
        if check_realtime_timeout():
            print(f"Memulai deteksi ulang karena emergency stop...")
            break

        start_byte = find_start_byte(ser)
        if not start_byte:
            time.sleep(0.1)
            continue

        length_byte = ser.read(1)
        if not length_byte:
            continue

        length = length_byte[0]
        if length < 3 or length > 30:
            print(f"Panjang paket tidak valid: {length}")
            continue

        # Baca sisa paket (jumlah byte: length - 2, karena sudah membaca 2 byte awal)
        remaining_data = ser.read(length - 2)
        if len(remaining_data) < (length - 2):
            print(f"Paket tidak lengkap, diharapkan {length-2} byte, diterima {len(remaining_data)} byte")
            continue

        full_packet = start_byte + length_byte + remaining_data

        result = parse_packet(full_packet)

        if result:
            print("Result data:", result)

            # Jika restart_detection diset (misalnya setelah mendapatkan hasil measurement),
            # tunggu 5 detik sebelum keluar untuk memberi waktu pemulihan.
            if restart_detection.is_set():
                print(f"Pengukuran selesai. Menunggu 5 detik sebelum restart...")
                time.sleep(5)
                break

    return True

# -------------------- LOOP UTAMA --------------------

def capture_serial_data():
    # global mqtt_client

    try:
        send_data("status", f"Memulai proses python dengan user {user_id}")
        print(f"Emergency stop akan terjadi jika tidak ada data selama {REALTIME_TIMEOUT} detik dalam mode realtime")

        attempts = 0
        max_attempts = 3
        # Loop utama: Pilih port dan baca data
        # while attempts < max_attempts:
        while True:
            print(f"\n--- Memulai deteksi port serial baru ---")
            send_data("status", "Mencari port serial...")
            # mqtt_client.publish(f"{MQTT_TOPIC_REALTIME}/status", f"Loading.") #Publish MQTT
            ser = select_serial_port()
            if ser is None:
                print(f"Tidak dapat menemukan port yang valid. Mencoba lagi dalam 5 detik...")
                send_data("status", "Tidak dapat menemukan port yang valid. Mencoba lagi dalam 5 detik...")
                time.sleep(5)
                attempts += 1
                continue

            # Baca data dari port hingga selesai atau terjadi error
            should_restart = read_serial_data(ser)

            # Tutup port serial sebelum restart
            if ser.is_open:
                ser.close()
                print(f"Port serial {ser.port} ditutup.")

            if not should_restart:
                break

    except KeyboardInterrupt:
        print(f"Program dihentikan oleh pengguna.")
    except Exception as e:
        print(f"Error tidak terduga: {e}")
    finally:
        try:
            if 'ser' in locals() and hasattr(ser, 'is_open') and ser.is_open:
                ser.close()
                print(f"Port serial ditutup.")
        except Exception:
            pass
        # if mqtt_client is not None:
            # mqtt_client.loop_stop()
            # mqtt_client.disconnect()
            # print(f"Koneksi MQTT ditutup.")

if __name__ == "__main__":
    capture_serial_data()