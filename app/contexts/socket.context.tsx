import React, { createContext, useContext, ReactNode } from "react";
import { Platform, Text } from 'react-native';
import io, { Socket } from "socket.io-client";

export const socketEndpoint: string = Platform.OS === 'web'
  ? "http://localhost:3000"
  : "ws://92.184.108.73:3000";

console.log('Attempting to connect to WebSocket server at:', socketEndpoint);

export const socket: Socket = io(socketEndpoint, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

export let hasConnection: boolean = false;

socket.on("connect", () => {
  hasConnection = true;
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  hasConnection = false;
  console.log("Disconnected from server. Reason:", reason);
});

socket.on("error", (error) => {
  console.error("WebSocket error:", error);
});

socket.connect();

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
