import { Slot } from 'expo-router';
import { SessionProvider } from '../ctx';
import { socket, SocketContext } from './contexts/socket.context';

export default function Root() {
  return (
    <SocketContext.Provider value={socket}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </SocketContext.Provider>
  );
}
