import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SendIcon from "./assets/icons/send_2.png";
import "./App.css";

const socket = io.connect("http://localhost:3001");

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const handleChangeNewMessage = (e) => {
    setNewMessage(e.target.value);
  };
  const handleKeyPressNewMessage = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const sendMessage = async () => {
    if (newMessage !== "") {
      const message = { user: socket.id, text: newMessage };
      await socket.emit("send_message", message);
      // console.log("socket.id => ", socket.id);
      setAllMessages((allMessages) => [...allMessages, message]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (message) => setAllMessages((allMessages) => [...allMessages, message]));
  }, []);

  const listOfMessages = allMessages.map((message, index) => (
    <div className={message.user === socket.id ? "sent-messages" : "received-messages"} key={`message_${index}`}>
      <p>{message.text}</p>
    </div>
  ));

  return (
    <div className="app">
      <div className="messages">{listOfMessages}</div>
      <div className="sendNewMessage">
        <input
          className="sendInput"
          value={newMessage}
          onChange={handleChangeNewMessage}
          onKeyPress={handleKeyPressNewMessage}
          placeholder="Type your message..."
        />
        <button className="sendButton" onClick={sendMessage}>
          <img src={SendIcon} />
        </button>
      </div>
    </div>
  );
}

export default App;
