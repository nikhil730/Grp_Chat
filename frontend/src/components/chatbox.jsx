import React, { useState, useEffect, useRef } from "react";
import "./chatbox.css";
import moment from "moment";
import io from "socket.io-client";
import { socket } from "./Socket";
const Chatbox = () => {
  // const [socket, setSocket] = useState(null);
  //console.log(socket);

  // useEffect(() => {
  //   const socketInstance = io("http://localhost:4000", {
  //     path: "/socket.io",
  //   });
  //   setSocket(socketInstance);
  //   console.log(socket);

  //   // listen for events emitted by the server

  //   socketInstance?.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   return () => {
  //     if (socketInstance) {
  //       socketInstance.disconnect();
  //     }
  //   };
  // }, []);
  const messageContainer = useRef(null);
  const clientsTotal = document.getElementById("client-total");
  const [messageInput, SetmessageInput] = useState("");
  const [nameInput, SetnameInput] = useState("users");
  const handleclick = (e) => {
    e.preventDefault();
    sendMessage();
  };
  socket?.on("clients-total", (data) => {
    console.log(data);
    // clientsTotal.innerText = `Total Clients: ${data}`;
  });
  const sendMessage = () => {
    console.log(messageInput);
    if (messageInput === "") return;
    // console.log(messageInput.value)
    const data = {
      name: nameInput,
      message: messageInput,
      dateTime: new Date(),
    };
    console.log("data ");
    console.log(data);
    socket?.emit("message", data);
    // socket?.emit("feedback", {
    //   feedback: `✍️ ${nameInput} is typing a message inside sendmessage`,
    // });
    addMessageToUI(true, data);
    SetmessageInput("");
  };
  const scrollToBottom = () => {
    if (messageContainer.current) {
      messageContainer.current.scrollTo(0, messageContainer.scrollHeight);
    }
  };
  const addMessageToUI = (isOwnMessage, data) => {
    //console.log(isOwnMessage);
    //console.log(data);
    clearFeedback();
    let element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>
          `;
    if (messageContainer.current) {
      messageContainer.current.innerHTML += element;
      element = "";
    } else {
      console.log("nothing");
    }
    scrollToBottom();
  };
  const clearFeedback = () => {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
      element.parentNode.removeChild(element);
    });
  };
  const handlefocus = (e) => {
    console.log(e);
    console.log(nameInput);
    socket?.emit("feedback", {
      feedback: `✍️ ${nameInput?.value} is typing a message handlefocus`,
    });
  };
  // messageInput.addEventListener("focus", (e) => {
  //   socket.emit("feedback", {
  //     feedback: `✍️ ${nameInput.value} is typing a message`,
  //   });
  // });
  const handlepress = (e) => {
    console.log(e);
    console.log(nameInput);
    socket?.emit("feedback", {
      feedback: `✍️ ${nameInput?.value} is typing a message handlepress`,
    });
  };
  // messageInput.addEventListener("keypress", (e) => {
  //   socket.emit("feedback", {
  //     feedback: `✍️ ${nameInput.value} is typing a message`,
  //   });
  // });
  const handleblur = (e) => {
    socket?.emit("feedback", {
      feedback: "",
    });
  };
  // messageInput.addEventListener("blur", (e) => {
  //   socket.emit("feedback", {
  //     feedback: "",
  //   });
  // });
  const handlechange = (e) => {
    console.log(e.target.value);
    SetmessageInput(e.target.value);
  };
  const handlenamechange = (e) => {
    console.log(e.target);
    SetnameInput(e.target.value);
  };
  socket.on("chat-message", (data) => {
    // console.log(data)
    addMessageToUI(false, data);
  });
  socket?.on("feedback", (data) => {
    clearFeedback();
    console.log(data.feedback);
    const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `;
    console.log(element);
    if (messageContainer.current) {
      messageContainer.current.innerHTML += element;
    }
  });

  return (
    <div>
      <h1 class="title">iChat 💬</h1>
      <div class="main">
        <div class="name">
          <span>
            <i class="far fa-user"></i>
          </span>
          <input
            type="text"
            id="name-input"
            class="name-input"
            value={nameInput}
            maxlength="20"
            onChange={handlenamechange}
          />
        </div>

        <ul
          class="message-container"
          id="message-container"
          ref={messageContainer}
        >
          {/* <!-- These li elements are only for reference, and therefore, they are commented out... --> */}
          {/* <!-- <li class="message-left">
          <p class="message">
            lorem impsun
            <span>bluebird ● 26 July 10:40</span>
          </p>
        </li>

        <li class="message-right">
          <p class="message">
            lorem impsun
            <span>bluebird ● 26 July 10:40</span>
          </p>
        </li>

        <li class="message-feedback">
          <p class="feedback" id="feedback">✍️ killer is typing a message...</p>
        </li> --> */}
        </ul>

        <form class="message-form" id="message-form">
          <input
            type="text"
            name="message"
            id="message-input"
            class="message-input"
            value={messageInput}
            onChange={handlechange}
            // onClick={handlepress}
            // onBlur={handleblur}
            // onFocus={handlefocus}
          />
          <div class="v-divider"></div>
          <button type="submit" onClick={handleclick} class="send-button">
            send{" "}
            <span>
              <i class="fas fa-paper-plane"></i>
            </span>
          </button>
        </form>
      </div>
      <h3 class="clients-total" id="client-total">
        Total clients: 2
      </h3>
    </div>
  );
};
export default Chatbox;
