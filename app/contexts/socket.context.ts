import React, { createContext } from "react";
import { Platform } from 'react-native';
import io, { Socket } from "socket.io-client";

console.log('Emulation OS Platform: ', Platform.OS);

export const socketEndpoint: string = Platform.OS === 'web' 
  ? "http://localhost:3000" 
  : "http://172.20.10.3:3000";

export const socket: Socket = io(socketEndpoint, {
  transports: ["websocket"],
});

export let hasConnection: boolean = false;

socket.on("connect", () => {
  console.log("connect: ", socket.id);
  hasConnection = true;
});

socket.on("disconnect", () => {
  hasConnection = false;
  console.log("disconnected from server");
  socket.removeAllListeners();
});

export const SocketContext = createContext<Socket | null>(null);
