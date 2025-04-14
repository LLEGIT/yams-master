import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '../ctx';
import { socket, SocketContext } from './contexts/socket.context';
import { useState } from 'react';

export default function Root() {
  const [connected, setConnected] = useState<boolean>(false);

  return (
    <SocketContext.Provider value={{ socket, connected, setConnected }}>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="online" options={{ title: 'Online' }} />
          <Stack.Screen name="bot" options={{ title: 'Bot' }} />
        </Stack>
      </SessionProvider>
    </SocketContext.Provider>
  );
}
