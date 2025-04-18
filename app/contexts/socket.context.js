import React from "react";
import { Platform } from 'react-native';
import io from "socket.io-client";

console.log('Emulation OS Platform: ', Platform.OS);
export const socketEndpoint = Platform.OS === 'web' ? "http://localhost:3000" : process.env.EXPO_PUBLIC_API_URL;

export const socket = io(socketEndpoint, {
    transports: ["websocket"],
});;

export let hasConnection = false;

socket.on("connect", () => {
    hasConnection = true;
});

socket.on("disconnect", () => {
    hasConnection = false;
    socket.removeAllListeners();
});

export const SocketContext = React.createContext();