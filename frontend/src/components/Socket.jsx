import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000", {
  path: "/socket.io",
});

function Socket() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
  }, [socket]);
}

export { socket };
export default Socket;
