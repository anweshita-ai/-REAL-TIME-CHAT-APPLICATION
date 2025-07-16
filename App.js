import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
const [name, setName] = useState("");
const [msg, setMsg] = useState("");
const [messages, setMessages] = useState([]);
const [typingUser, setTypingUser] = useState("");

useEffect(() => {
// Load old messages
socket.on("message history", (history) => {
setMessages(history);
});
// New incoming messages
socket.on("chat message", (data) => {
  setMessages((prev) => [...prev, data]);
});

// Typing indicator
socket.on("typing", (name) => {
  setTypingUser(`${name} is typing...`);
});

socket.on("stop typing", () => {
  setTypingUser("");
});

return () => {
  socket.off("chat message");
  socket.off("typing");
  socket.off("stop typing");
  socket.off("message history");
};
// New incoming messages
socket.on("chat message", (data) => {
  setMessages((prev) => [...prev, data]);
});

// Typing indicator
socket.on("typing", (name) => {
  setTypingUser(`${name} is typing...`);
});

socket.on("stop typing", () => {
  setTypingUser("");
});

return () => {
  socket.off("chat message");
  socket.off("typing");
  socket.off("stop typing");
  socket.off("message history");
};
}, []);

const handleSend = (e) => {
e.preventDefault();
if (!msg.trim()) return;
socket.emit("chat message", { user: name, message: msg });
socket.emit("stop typing");
setMsg("");
};

return (
<div style={styles.container}>
{!name ? (
<div style={styles.nameBox}>
<h2>Enter Your Name</h2>
<input
style={styles.input}
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="Your name"
/>
</div>
) : (
<>
<h2>Welcome, {name} 👋</h2>
<div style={styles.chatBox}>
{messages.map((m, i) => (
<div key={i} style={styles.message}>
<strong>{m.user}</strong>: {m.message}
<span style={styles.time}>{m.time}</span>
</div>
))}
</div>
{typingUser && <p style={styles.typing}>{typingUser}</p>}
<form onSubmit={handleSend} style={styles.form}>
<input
style={styles.input}
value={msg}
onChange={(e) => {
setMsg(e.target.value);
socket.emit("typing", name);
if (e.target.value === "") {
socket.emit("stop typing");
}
}}
placeholder="Type a message..."
/>
<button type="submit" style={styles.button}>Send</button>
</form>
</>
)}
</div>
);
}

const styles = {
container: {
maxWidth: 600,
margin: "0 auto",
padding: 20,
fontFamily: "Arial",
textAlign: "center"
},
nameBox: {
marginTop: 100
},
chatBox: {
height: 300,
overflowY: "auto",
border: "1px solid #ccc",
padding: 10,
marginBottom: 10
},
message: {
textAlign: "left",
margin: "5px 0"
},
typing: {
fontStyle: "italic",
color: "#888"
},
time: {
fontSize: 10,
marginLeft: 10,
color: "#aaa"
},
input: {
padding: 8,
fontSize: 16,
width: "70%",
marginRight: 10
},
form: {
marginTop: 10
},
button: {
padding: 8,
fontSize: 16
}
};

export default App;
