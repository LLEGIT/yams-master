import { Redirect, Slot, Stack } from 'expo-router';
import { SessionProvider, useSession } from '../ctx';
import { socket, SocketContext } from './contexts/socket.context';
import { Text } from 'react-native';

export default function Root() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (<Text>Loading...</Text>);
  }

  // if (!session) {
  //   return <Redirect href="/sign-in" />;
  // }

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
