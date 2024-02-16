import "./App.css";
import Chatbox from "./components/chatbox";
import Socket, { socket } from "./components/Socket";
function App() {
  return (
    <div className="App">
      <Socket />
      <Chatbox socket={socket} />
    </div>
  );
}

export default App;
