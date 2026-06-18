// src/socket.js
import { io } from "socket.io-client";

// Connect once and reuse everywhere
const socket = io("http://localhost:5000");

export default socket;
