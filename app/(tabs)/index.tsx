import { Text, View } from 'react-native';
import { useSession } from '../../ctx';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/socket.context';

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
      <Text style={{ marginBottom: 20, fontSize: 18 }}>
        Current Time: {currentTime || 'Waiting for time...'}
      </Text>
      <Text
        onPress={() => {
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
