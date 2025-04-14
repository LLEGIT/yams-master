import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '../ctx';
import { socket, SocketContext } from './contexts/socket.context';

export default function Root() {
  return (
    <SocketContext.Provider value={socket}>
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
