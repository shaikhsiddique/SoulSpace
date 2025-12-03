import { io } from "socket.io-client";

/**
 * Creates and returns a Socket.IO client instance
 * @param {string} token - JWT authentication token
 * @returns {Socket} Socket.IO client instance
 */
export const createSocketConnection = (token) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const socket = io(API_URL, {
    auth: {
      token: token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  return socket;
};

export default createSocketConnection;






