import { Server } from "socket.io";

export function setupSockets(httpServer, app) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  app.locals.io = io;

  io.on("connection", () => {});

  return io;
}

export function emitVitalsNew(io, vitals) {
  if (io) io.emit("vitals:new", vitals);
}

export function emitAlertNew(io, alert) {
  if (io) io.emit("alert:new", alert);
}

export function emitInsightUpdate(io, payload) {
  if (io) io.emit("insight:update", payload);
}
