import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl || !String(apiUrl).trim()) {
  throw new Error("Missing required env var: VITE_API_URL");
}

export function createAuthedSocket(token) {
  if (!token) throw new Error("createAuthedSocket: token is required");

  return io(apiUrl, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    timeout: 5000,
    reconnectionAttempts: 5,
    auth: { token },
  });
}

