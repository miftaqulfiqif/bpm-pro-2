import { useCounter } from "./hooks/Counter";

const App = () => {
  const { message, buttonLoading, buttonStart, buttonStop } = useCounter();
  return (
    <div>
      <p>Live Sensor Data</p>
      <p>Message from WebSocket:</p>
      <p>{message}</p>
      <button disabled={buttonLoading} onClick={buttonStart}>
        Start
      </button>
      <button onClick={buttonStop}> Stop </button>
    </div>
  );
};

export default App;
