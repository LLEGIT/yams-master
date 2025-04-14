import { useSession } from '../ctx';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from './contexts/socket.context';
import { Link, Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const { signOut } = useSession();
  const socket = useContext(SocketContext);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (socket) {

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      socket.on('time-msg', (data: { time: string }) => {
        setCurrentTime(new Date(data.time).toLocaleTimeString());
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('time-msg');
      };
    } else {
      console.log('Socket context is null');
    }
  }, [socket]);

  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Yam master</Text>
      <Link href="/online" style={styles.button}>
        Play online
      </Link>
      <Link href="/online" style={styles.button}>
        Play against a bot
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
