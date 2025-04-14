import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Platform } from "react-native";
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

interface SocketContextProps {
  socket: Socket;
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SocketContext = createContext<SocketContextProps | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to WebSocket server.");
      setConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Disconnected from server. Reason:", reason);
      setConnected(false);
    };

    const handleError = (error: any) => {
      console.error("WebSocket error:", error.message || error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("error", handleError);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("error", handleError);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, setConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
