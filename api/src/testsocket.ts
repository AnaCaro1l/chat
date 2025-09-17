import { io } from "socket.io-client";

const socket = io("http://localhost:3333");


socket.on("message", (msg) => {
  console.log("Mensagem recebida do servidor:", msg.fromMe);
});
