import { MessageResult } from "./components/MessageResult";
import { useCounter } from "./hooks/Counter";

export const App = () => {
  const { message, buttonLoading, buttonStart } = useCounter();

  return (
    <div>
      <h1>Live Sensor Data</h1>
      <p>Message from WebSocket: </p>
      {
        typeof message === "string" ? (
          <p>{message}</p>
        ) : (
          <MessageResult message={message} />
        )
      }
      {/* <p>{message}</p> */}
      <button disabled={buttonLoading} onClick={buttonStart}>
        Start
      </button>
    </div>
  );
};