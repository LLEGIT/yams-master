import { useSession } from '../ctx';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from './contexts/socket.context';
import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const { session, isLoading, signOut } = useSession(); // ✅ un seul appel
  const socketContext = useContext(SocketContext);
  const [currentTime, setCurrentTime] = useState<string>('');
  const { connected, setConnected, socket } = socketContext;

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setConnected(false);
      });

      socket.on('time-msg', (data: { time: string }) => {
        setCurrentTime(new Date(data.time).toLocaleTimeString());
      });
    } else {
      console.log('Socket context is null');
    }
  }, [socket]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View style={styles.container}>
      <Text>Bienvenue sur le jeu yam master</Text>
      <Text>Statut WebSocket : {connected ? 'Connecté' : 'Déconnecté'}</Text>
      <Text>Heure actuelle : {currentTime || 'Pas encore reçue'}</Text>

      <Link href="/online" style={styles.button}>
        Jouer en ligne
      </Link>
      <Link href="/bot" style={styles.button}>
        Jouer contre un bot
      </Link>
      <Text onPress={() => signOut()}>Se déconnecter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
});
