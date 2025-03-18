import { MessageResult } from "./components/MessageResult";
import { useCounter } from "./hooks/Counter";

const App = () => {
  const { message, buttonLoading, buttonStart, buttonStop, isOpen, setIsOpen } =
    useCounter();

  const closeModal = () => setIsOpen(false);
  return (
    <div>
      <p>Live Sensor Data</p>
      <p>Message from WebSocket:</p>
      <p>{message}</p>
      <div className="flex gap-2">
        <button
          disabled={buttonLoading}
          onClick={buttonStart}
          className="bg-slate-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={buttonStop}
          className="bg-slate-700 text-white py-2 px-4 rounded"
        >
          Stop
        </button>

        <MessageResult
          stateModel={isOpen}
          closeModal={closeModal}
          message={message}
        />
      </div>
    </div>
  );
};

export default App;
