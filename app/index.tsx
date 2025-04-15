import { useSession } from '../ctx';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from './contexts/socket.context';
import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import PillButton from '../components/PillButton';

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
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue sur le jeu yam master</Text>
        <Text style={styles.status}>Statut WebSocket : {connected ? 'Connecté' : 'Déconnecté'}</Text>
        <Text style={styles.time}>Heure actuelle : {currentTime || 'Pas encore reçue'}</Text>

        <View style={styles.buttonContainer}>
          <Link href="/online" asChild>
            <PillButton title="Jouer en ligne" />
          </Link>
          <Link href="/bot" asChild>
            <PillButton title="Jouer contre un bot" />
          </Link>
          <PillButton title="Se déconnecter" onPress={() => signOut()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    gap: 40,
  },
  title: {
    color: '#fafaf9',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    color: '#fafaf9',
    fontSize: 16,
    marginBottom: 10,
  },
  time: {
    color: '#fafaf9',
    fontSize: 16,
    marginBottom: 30,
  },
});
